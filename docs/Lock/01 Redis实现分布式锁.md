---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Lock/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code](https://github.com/Q10Viking/learncode/tree/main/redis/_05_springboot_redis_lock)

:::

## Redis设计分布式锁需要考虑的问题

1. 要有过期时间
2. 获取锁和释放锁
3. redis中设置锁的原子性setnx或Lua脚本



## 利用setnx特性

::: tip

**SET** if **N**ot e**X**ists

:::

## 简单版

```java
@GetMapping("/v1/deduck_stock")
public String deduckStockV1(){
    // 在redis中它的库存设置为300
    final String key = "stock:product:1";
    final String lockKey = "lock:product:1";
    // 获取锁 setnx lock:product:1 true ex 1000
    Boolean result = stringRedisTemplate.opsForValue().setIfAbsent(lockKey,"true",1000, TimeUnit.MILLISECONDS);
    if(!result){
        return "error_code";
    }
    try{
        int stock = Integer.parseInt(stringRedisTemplate.opsForValue().get(key));
        if(stock>0){
            int realStock = stock - 1;
            stringRedisTemplate.opsForValue().set(key,String.valueOf(realStock));
            logger.info("扣减库存成功,剩余："+realStock);
        }else{
            logger.info("扣减库存失败");
        }
    }finally {
        // 释放锁
        stringRedisTemplate.delete(lockKey);
    }
    return "Finished";
}
```



### 存在问题

超时时间不好设置

如果设计时间太短：当线程A获得锁之后执行业务代码，但是由于执行业务代码消耗的时间太长，导致锁过期了。那么其他线程,比如线程B就获得锁了。当线程A执行完代码之后，在finally中释放了锁，但是此时释放的是线程B加的锁。锁并没有按照我们正常设想释放。

解决方式使用UUID。

## 简单版+UUID

```java
/**--------------------------------------------------------------------------------
     *      简单版+UUID setnx key value ex times
     *--------------------------------------------------------------------------------*/
@GetMapping("/v2/deduck_stock")
public String deduckStockV2(){
    // 在redis中它的库存设置为300
    final String key = "stock:product:1";
    final String lockKey = "lock:product:1";
    final String clientId = UUID.randomUUID().toString();
    // 获取锁
    Boolean result = stringRedisTemplate.opsForValue().setIfAbsent(lockKey,clientId,1000, TimeUnit.MILLISECONDS);
    if(!result){
        return "error_code";
    }
    try{
        int stock = Integer.parseInt(stringRedisTemplate.opsForValue().get(key));
        if(stock>0){
            int realStock = stock - 1;
            stringRedisTemplate.opsForValue().set(key,String.valueOf(realStock));
            logger.info("扣减库存成功,剩余："+realStock);
        }else{
            logger.info("扣减库存失败");
        }
    }finally {
        // 释放锁
        if(clientId.equals(stringRedisTemplate.opsForValue().get(lockKey))){
            stringRedisTemplate.delete(lockKey);
        }
    }
    return "Finished";
}
```



### 存在问题❤️

```java
// 释放锁
if(clientId.equals(stringRedisTemplate.opsForValue().get(lockKey))){
    stringRedisTemplate.delete(lockKey);
}
```

上面这段释放锁的代码（**并不具备原子性**）仍然还是锁的过期时间问题。如这种情况：线程从redis中根据lockkey取出来了clientId.但是此时由于线程切换，该线程挂起来了，在这段时间中，恰好锁的过期时间到了，那么系统中的其他线程就能获取到锁。而该线程被唤醒时，删除的锁就是其他线程加的锁了。

**使用Lua脚本可以保证原子性，这也是Redisson实现的主要逻辑**

```java
"local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); " +
                "if (counter > 0) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[2]); " +
                    "return 0; " +
                "else " +
                    "redis.call('del', KEYS[1]); " +
                    "redis.call('publish', KEYS[2], ARGV[1]); " +
                    "return 1; "+
                "end; " +
                "return nil;"
```



## 锁续命（Watch Dog）❤️

思路：开了一个分线程来监控主线程是否执行完业务代码，如果在锁超时时间内还没有执行完成，分线程将增加锁的过期时间。（分线程采用定时任务来监控）市面上有成熟的开源框架Redisson

```sh
# 这个命令和 EXPIRE 命令的作用类似，但是它以毫秒为单位设置 key 的生存时间，而不像 EXPIRE 命令那样，以秒为单位。
pexpire key milliseconds
# 这个命令类似于 TTL 命令，但它以毫秒为单位返回 key 的剩余生存时间，而不是像TTL 命令那样，以秒为单位。
pttl key
```

```java
/**--------------------------------------------------------------------------------
 *      Redisson
 *--------------------------------------------------------------------------------*/
@Autowired
private Redisson redisson;
@GetMapping("/v3/deduck_stock")
public String deduckStockV3(){
    // 在redis中它的库存设置为300
    final String key = "stock:product:1";
    final String lockKey = "lock:product:1";
    RLock lock = redisson.getLock(lockKey);
    lock.lock();
    try{
        int stock = Integer.parseInt(stringRedisTemplate.opsForValue().get(key));
        if(stock>0){
            int realStock = stock - 1;
            stringRedisTemplate.opsForValue().set(key,String.valueOf(realStock));
            logger.info("扣减库存成功,剩余："+realStock);
        }else{
            logger.info("扣减库存失败");
        }
    }finally {
        // 释放锁
        lock.unlock();
    }
    return "Finished";
}
```



### 再次压测检查

app1:8080

```sh
2022-08-10 00:03:42.169  INFO 7748 --- [io-8081-exec-36] org.hzz.controller.StockController       : 扣减库存成功,剩余：299
2022-08-10 00:03:42.181  INFO 7748 --- [io-8081-exec-28] org.hzz.controller.StockController       : 扣减库存成功,剩余：298
2022-08-10 00:03:42.210  INFO 7748 --- [io-8081-exec-87] org.hzz.controller.StockController       : 扣减库存成功,剩余：295
2022-08-10 00:03:42.239  INFO 7748 --- [io-8081-exec-36] org.hzz.controller.StockController       : 扣减库存成功,剩余：291
2022-08-10 00:03:42.245  INFO 7748 --- [io-8081-exec-78] org.hzz.controller.StockController       : 扣减库存成功,剩余：290
2022-08-10 00:03:42.253  INFO 7748 --- [io-8081-exec-96] org.hzz.controller.StockController       : 扣减库存成功,剩余：289
2022-08-10 00:03:42.261  INFO 7748 --- [io-8081-exec-35] org.hzz.controller.StockController       : 扣减库存成功,剩余：288
2022-08-10 00:03:42.271  INFO 7748 --- [io-8081-exec-96] org.hzz.controller.StockController       : 扣减库存成功,剩余：287
2022-08-10 00:03:42.289  INFO 7748 --- [io-8081-exec-96] org.hzz.controller.StockController       : 扣减库存成功,剩余：285
2022-08-10 00:03:42.295  INFO 7748 --- [o-8081-exec-107] org.hzz.controller.StockController       : 扣减库存成功,剩余：284
```

app2:8081

```sh
2022-08-10 00:03:42.197  INFO 14992 --- [io-8080-exec-54] org.hzz.controller.StockController       : 扣减库存成功,剩余：297
2022-08-10 00:03:42.203  INFO 14992 --- [io-8080-exec-26] org.hzz.controller.StockController       : 扣减库存成功,剩余：296
2022-08-10 00:03:42.219  INFO 14992 --- [io-8080-exec-90] org.hzz.controller.StockController       : 扣减库存成功,剩余：294
2022-08-10 00:03:42.225  INFO 14992 --- [io-8080-exec-95] org.hzz.controller.StockController       : 扣减库存成功,剩余：293
2022-08-10 00:03:42.232  INFO 14992 --- [io-8080-exec-33] org.hzz.controller.StockController       : 扣减库存成功,剩余：292
2022-08-10 00:03:42.279  INFO 14992 --- [o-8080-exec-100] org.hzz.controller.StockController       : 扣减库存成功,剩余：286
2022-08-10 00:03:42.300  INFO 14992 --- [io-8080-exec-26] org.hzz.controller.StockController       : 扣减库存成功,剩余：283
2022-08-10 00:03:42.308  INFO 14992 --- [io-8080-exec-15] org.hzz.controller.StockController       : 扣减库存成功,剩余：282
2022-08-10 00:03:42.313  INFO 14992 --- [o-8080-exec-108] org.hzz.controller.StockController       : 扣减库存成功,剩余：281
2022-08-10 00:03:42.318  INFO 14992 --- [io-8080-exec-44] org.hzz.controller.StockController       : 扣减库存成功,剩余：280
```



## Redisson❤️

::: tip

底层利用了Lua脚本在redis中的原子性。而没有使用setnx

:::

[Redisson官网](https://redisson.org/)

### Redisson核心架构思想

![image-20220809221647460](/images/lock/image-20220809221647460.png)

### Redisson设置锁的lua逻辑

```java
return commandExecutor.evalWriteAsync(getName(), LongCodec.INSTANCE, command,
                  "if (redis.call('exists', KEYS[1]) == 0) then " +
                      "redis.call('hset', KEYS[1], ARGV[2], 1); " +
                      "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                      "return nil; " +
                  "end; " +
                  "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                      "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                      "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                      "return nil; " +
                  "end; " +
                  "return redis.call('pttl', KEYS[1]);",
                    Collections.<Object>singletonList(getName()), internalLockLeaseTime, getLockName(threadId));
// key 续命时间  线程id
```

### 加锁不成功

pttl key 根据等待的时间，使用信号量进行阻塞。

当锁释放时会通过redis的发布订阅，通过信号量的release，或者信号量阻塞时长到期。线程继续去获取锁。在一个while(true)循环内



### 看门狗定时续命

递归实现的类似js的setTimeout的递归





## Java实现分布式锁

> 基于springboot,实现了分布式锁，可重入逻辑

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class RedisDistrLock {

    private final static String UNLOCK_LUA_NAME = "Redis分布式锁解锁脚本";
    private final static String UNLOCK_LUA = "local result = redis.call('get', KEYS[1]);" +
            "if result == ARGV[1] then redis.call('del', KEYS[1]) " +
            "return 1 else return nil end";

    /* 当前线程的锁集合，处理锁的可重入*/
    private ThreadLocal<Map<String, Integer>> lockers = new ThreadLocal<>();
    /* 当前线程锁的key和value集合*/
    private ThreadLocal<Map<String, String>> values = new ThreadLocal<>();

    @Autowired
    private RedisTemplate redisTemplate;

    private AtomicBoolean isLoadScript = new AtomicBoolean(false);
    private DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();

    @PostConstruct
    public void loadScript(){
        if(isLoadScript.get()) return;
        redisScript.setScriptText(UNLOCK_LUA);
        redisScript.setResultType(Long.class);
        loadRedisScript(redisScript,UNLOCK_LUA_NAME);
        isLoadScript.set(true);
    }

    /**
     * 加载lua脚本到redis服务器
     * @param redisScript
     * @param luaName
     */
    private void loadRedisScript(DefaultRedisScript<Long> redisScript, String luaName) {
        try {
            List<Boolean> results = redisTemplate.getConnectionFactory().getConnection()
                    .scriptExists(redisScript.getSha1());
            if (Boolean.FALSE.equals(results.get(0))) {
                String sha = redisTemplate.getConnectionFactory().getConnection()
                        .scriptLoad(redisScript.getScriptAsString().getBytes(StandardCharsets.UTF_8));
                log.info("预加载lua脚本成功：{}, sha=[{}]", luaName, sha);
            }
        } catch (Exception e) {
            log.error("预加载lua脚本异常：{}", luaName, e);
        }
    }

    /**
     * 尝试获取锁
     * @param key 锁的键
     * @return 是否成功获取锁
     */
    private Boolean tryLock(String key,long timeout) {

        /*缺省失效时间为5秒*/
        if(timeout <= 0) timeout = 5000;
        String value = getValueByKey(key);
        // 如果没有设置过值
        if (value == null) {
            // 锁的值使用UUID生成随机ID以保证值的唯一性
            value = UUID.randomUUID().toString();
            // 将新生成的值放入集合中
            values.get().put(key, value);
        }
        if (redisTemplate.opsForValue().setIfAbsent(key, value, Duration.ofSeconds(timeout))) {
            return true;
        }
        boolean isLock;
        // 一直阻塞，直到拿到锁
        while (true) {
            try {
                Thread.sleep(5);
                // 继续尝试获取锁
                isLock = this.tryLock(key,timeout);
                if (isLock) {
                    return true;
                }
            } catch (InterruptedException e) {
                log.debug("拿锁的休眠等待被中断！");
            }
        }
    }

    /**
     * 尝试释放锁
     * @param key 锁的键
     * @return 是否成功释放锁
     */
    private boolean tryRelease(String key) {
        String[] keys = new String[]{key};
        String[] args = new String[]{getValueByKey(key)};
        // 释放锁
        Long result = (Long)redisTemplate.execute(redisScript, Collections.singletonList(key),getValueByKey(key));
        return result != null;
    }

    /**
     * 获取当前线程的锁
     * @param key 锁的键
     * @return 当前线程的锁和该锁的重入次数
     */
    private Integer getLockerCnt(String key) {
        // 获取当前线程的锁集合
        Map<String, Integer> map = lockers.get();
        // 如果集合不为空，返回key对应的值
        if (map != null) {
            return map.get(key);
        }
        lockers.set(new HashMap<>(4));
        return null;
    }

    /**
     * 获取锁对应的值
     * @param key 锁的键
     * @return 锁对应的值
     */
    private String getValueByKey(String key) {
        // 获取当前线程的锁和对应值的键值对集合
        Map<String, String> map = values.get();
        // 如果集合不为空，返回key对应的值
        if (map != null) {
            return map.get(key);
        }
        values.set(new HashMap<>(4));
        return null;
    }

    /**
     * 加可重入锁
     * @param key 锁的键
     * @return 是否成功
     */
    public boolean lock(String key,long timeout){
        Integer refCnt = getLockerCnt(key);
        if (refCnt != null) {
            // 如果锁已持有，则锁的引用计数加1
            lockers.get().put(key, refCnt + 1);
            return true;
        }
        // 尝试加锁
        boolean ok = this.tryLock(key,timeout);
        // 如果加锁失败，则返回
        if (!ok) {
            return false;
        }
        // 加锁成功，引用计数设置为1
        lockers.get().put(key, 1);
        return true;
    }

    /**
     * 释放可重入锁
     * @param key 锁的键
     * @return 是否成功
     */
    public boolean unlock(String key) {
        Integer refCnt = getLockerCnt(key);
        // 当前未持有锁
        if (refCnt == null) {
            return false;
        }
        // 锁的引用数减1
        refCnt --;
        // 引用计数大于0，说明还持有锁
        if (refCnt > 0) {
            lockers.get().put(key, refCnt);
        } else {
            // 否则从锁集合中删除该键，并释放锁
            lockers.get().remove(key);
            return this.tryRelease(key);
        }
        return true;
    }

}

```



### 使用

> 缓存失效，设置缓存只用一个线程去加载数据库即可

```java
/*获取人气推荐产品*/
    private void getRecommendProducts(HomeContentResult result){
        final String recProductKey = promotionRedisKey.getRecProductKey();
        List<PmsProduct> recommendProducts = redisOpsExtUtil.getListAll(recProductKey, PmsProduct.class);
        if(CollectionUtils.isEmpty(recommendProducts)){
            // 分布式锁串行化，只让一个线程去加载缓存
            redisDistrLock.lock(promotionRedisKey.getDlRecProductKey(),promotionRedisKey.getDlTimeout());
            // 在从缓存中获取
            recommendProducts = redisOpsExtUtil.getListAll(recProductKey, PmsProduct.class);
            if(CollectionUtils.isEmpty(recommendProducts)){
                try {
                    // 从数据库中获取id
                    List<Long> recommendProductIds = smsHomeRecommendProductMapper.selectProductIdByExample(example2);
                    // 远程调用其他服务根据id获取商品
                    recommendProducts = pmsProductClientApi.getProductBatch(recommendProductIds);
                    // 存入缓存
                    log.info("人气推荐商品信息存入缓存，键{}" ,recProductKey);
                    redisOpsExtUtil.putListAllRight(recProductKey,recommendProducts);
                } finally {
                    redisDistrLock.unlock(promotionRedisKey.getDlRecProductKey());
                }
            }else{
                log.info("人气推荐商品信息已在缓存，键{}" ,recProductKey);
            }
        }else{
            log.info("人气推荐商品信息已在缓存，键{}" ,recProductKey);
        }
        // 设置查询的值
        result.setHotProductList(recommendProducts);
    }
```


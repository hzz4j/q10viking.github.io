---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---



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


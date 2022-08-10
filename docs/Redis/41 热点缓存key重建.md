---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



> 开发人员使用“缓存+过期时间”的策略既可以加速数据读写， 又保证数据的定期更新， 这种模式基本能够满足绝大部分需求。 但是有两个问题如果同时出现， 可能就会对应用造成致命的危害：

1. 当前key是一个热点key（例如一个热门的娱乐新闻），并发量非常大。
2. 重建缓存不能在短时间完成， 可能是一个复杂计算， 例如复杂的SQL、 多次IO、 多个依赖等。

::: tip

❤️在缓存失效的瞬间， 有大量线程来重建缓存， 造成后端负载加大， 甚至可能会让应用崩溃。❤️

要解决这个问题❤️主要就是要避免大量线程同时重建缓存（查询数据库，放入缓存）❤️。

:::

我们可以❤️利用互斥锁来解决，此方法只允许一个线程重建缓存， 其他线程等待重建缓存的线程执行完， 重新从缓存获取数据即可❤️。

```java
String get(String key) {
    // 从Redis中获取数据
    String value = redis.get(key);
    // 如果value为空， 则开始重构缓存
    if (value == null) {
        // 只允许一个线程重建缓存， 使用nx， 并设置过期时间ex 利用分布式锁
        String mutexKey = "mutext:key:" + key;
        if (redis.set(mutexKey, "1", "ex 180", "nx")) { // 拿锁成功的锁进行，进行数据库查询
             // 从数据源获取数据 double check 的思想
            value = db.get(key);
            // 回写Redis， 并设置过期时间
            redis.setex(key, timeout, value);
            // 删除key_mutex
            redis.delete(mutexKey);
        }
        else {
            // 其他线程休息50毫秒后重试
            Thread.sleep(50);
            get(key);
        }
    }
    return value;
}
```


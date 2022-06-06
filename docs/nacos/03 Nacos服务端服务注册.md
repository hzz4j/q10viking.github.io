---
typora-root-url: ..\.vuepress\public
---

## 服务端注册服务

[Nacos服务端注册服务 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/62938596e401fd2eed134f9a)

同步转异步解耦

服务注册过程

```
ConcurrentSkipListMap
ConcurrentLinkedQueue	监听器列表		
```



## Nacos服务注册表

服务注册表与注册逻辑

如何防止多节点并发冲突。考虑维度：写入和读取并发冲突。设计思想：**读写分离**

CopyOnWrite 写时复制； Nacos是如何落地的？

synchronsized(Service) 应用



服务更新配置



## 模型总结



## 双层锁    Nacos注册服务并发控制

https://www.processon.com/view/link/629207cef346fb41eeb97dfb

![Nacos注册服务并发控制](/images/nacos/Nacos注册服务并发控制.png)



## 心跳机制





### TODO 

HashTable 并发问题出现在哪里,出现在什么场景？复习杨过老师的课程。





## 设计思想

bean初始化@postconstructor注册监听器

异步解耦

空架子搭建

key的设计关联Service监听器，Instances（服务实例集合）



## Java 代码学习

```
map.values()是什么
集合对象求交集  hashcode & equals
```

两个服务实例？原本注册一个的

```
oldInstance: 192.168.1.4:8083:unknown:DEFAULT_1.0_true_false_DEFAULT

newInstance: 
192.168.1.4:8083:unknown:DEFAULT_1.0_false_false_DEFAULT
192.168.1.4:8082:unknown:DEFAULT_1.0_true_false_DEFAULT
```


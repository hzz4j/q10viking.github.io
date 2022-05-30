## SpringBoot启动

扩展点实现SmartLifeCycle

LifeCycleProcessor 切入点nacos服务发现。

org.springframework.context.support.DefaultLifecycleProcessor#getLifecycleBeans

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.alibaba.cloud.nacos.discovery.NacosDiscoveryAutoConfiguration,\
  com.alibaba.cloud.nacos.ribbon.RibbonNacosAutoConfiguration,\
  com.alibaba.cloud.nacos.endpoint.NacosDiscoveryEndpointAutoConfiguration,\
  com.alibaba.cloud.nacos.registry.NacosServiceRegistryAutoConfiguration,\
  com.alibaba.cloud.nacos.discovery.NacosDiscoveryClientConfiguration,\   # 服务发现的配置
```

```java
实现了SmartLifecycle接口
@Bean
	@ConditionalOnMissingBean
	@ConditionalOnProperty(value = "spring.cloud.nacos.discovery.watch.enabled",
			matchIfMissing = true)
	public NacosWatch nacosWatch(NacosServiceManager nacosServiceManager,
			NacosDiscoveryProperties nacosDiscoveryProperties) {
		return new NacosWatch(nacosServiceManager, nacosDiscoveryProperties);
	}
```



## Nacos服务发现

1. 程序启动就拉取一次
2. 定时任务不断更新
3. 服务端服务变动时通知客户端更新

学习到spring事件的使用



https://www.processon.com/view/link/6294ef2f1efad45e08412172

```
Map<Boolean, List<Instance>> ipMap = new HashMap<>(2);
        ipMap.put(Boolean.TRUE, new ArrayList<>());
        ipMap.put(Boolean.FALSE, new ArrayList<>());
```



```
服务发现时间回调
```

nacos通知注册的服务，刷新服务列表通过udp的方式。



线程工厂

```java
private ScheduledExecutorService executorService
    
this.executorService = new ScheduledThreadPoolExecutor(1, new ThreadFactory() {
                @Override
                public Thread newThread(Runnable r) {
                    Thread thread = new Thread(r);
                    thread.setDaemon(true);
                    thread.setName("com.alibaba.nacos.naming.push.receiver");
                    return thread;
                }
            });
```



线程池异常处理


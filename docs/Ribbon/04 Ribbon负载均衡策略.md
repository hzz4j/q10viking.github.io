---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Ribbon/
typora-root-url: ..\.vuepress\public
---



## Ribbon负载均衡策略

![img](/images/ribbon/13573.png)

1. **RandomRule**： 随机选择一个Server。
2. **RetryRule**： 对选定的负载均衡策略机上重试机制，在一个配置时间段内当选择Server不成功，则一直尝试使用subRule的方式选择一个可用的server。
3. **RoundRobinRule**： 轮询选择， 轮询index，选择index对应位置的Server。
4. **AvailabilityFilteringRule**： 过滤掉一直连接失败的被标记为circuit tripped的后端Server，并过滤掉那些高并发的后端Server或者使用一个AvailabilityPredicate来包含过滤server的逻辑，其实就是检查status里记录的各个Server的运行状态。
5. **BestAvailableRule**： 选择一个最小的并发请求的Server，逐个考察Server，如果Server被tripped了，则跳过。
6. **WeightedResponseTimeRule**： 根据响应时间加权，响应时间越长，权重越小，被选中的可能性越低。
7. **ZoneAvoidanceRule**： 默认的负载均衡策略，即复合判断Server所在区域的性能和Server的可用性选择Server，在没有区域的环境下，类似于轮询(RandomRule)
8. **NacosRule:**  同集群优先调用



## 使用NacosRule

### NacosRule集群优先的实现

```java
List<Instance> sameClusterInstances = instances.stream()
						.filter(instance -> Objects.equals(clusterName,
								instance.getClusterName()))
						.collect(Collectors.toList());
```



### 全局配置

```java
@Configuration
public class RibbonConfig {

    /**
     * 全局配置
     * 指定负载均衡策略
     * @return
     */
    @Bean
    public IRule() {
        // 指定使用Nacos提供的负载均衡策略（优先调用同一集群的实例，基于随机权重）
        return new NacosRule();
    }
 }
```

### **局部配置**

调用指定微服务提供的服务时，使用对应的负载均衡算法

修改application.yml

```yml
server:
  port: 8010
spring:
  application:
    name: mall-user
  cloud:
    nacos:
      server-addr: http://192.168.88.1:8848
      discovery:
        cluster-name: BJ
# 被调用微服务名称
mall-order:
  ribbon:
  	# 指定负载均衡策略
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule
```

![image-20210822142146975](/images/ribbon/image-20210822142146975.png)


---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /sentinel/
typora-root-url: ..\.vuepress\public
---



## 官方模板

定义的Sentinel进行资源保护的几个步骤

1. 定义资源

2. 定义规则

3. 检验规则是否生效



```java
Entry entry = null;
// 务必保证 finally 会被执行
try {
    // 资源名可使用任意有业务语义的字符串  开启资源的保护
    entry = SphU.entry("自定义资源名");
    // 被保护的业务逻辑    method
    // do something...
} catch (BlockException ex) {
    // 资源访问阻止，被限流或被降级   Sentinel定义异常  流控规则，降级规则，热点参数规则。。。。   服务降级(降级规则)
    // 进行相应的处理操作
} catch (Throwable ex) {
    // 若需要配置降级规则，需要通过这种方式记录业务异常    RuntimeException     服务降级   mock  feign:fallback 
    Tracer.traceEntry(ex, entry);
} finally {
    // 务必保证 exit，务必保证每个 entry 与 exit 配对
    if (entry != null) {
        entry.exit();
    }
```



## **Sentinel资源保护的方式**

> 依赖

   

```xml
<dependency>
     <groupId>com.alibaba.csp</groupId>
     <artifactId>sentinel-core</artifactId>
     <version>1.8.4</version>
</dependency>
```

编写测试逻辑

```java
@RestController
@Slf4j
public class HelloController {

    private static final String RESOURCE_NAME = "HelloWorld";

    @RequestMapping(value = "/hello")
    public String hello() {
        try (Entry entry = SphU.entry(RESOURCE_NAME)) {
            // 被保护的逻辑
            log.info("hello world");
            return "hello world";
        } catch (BlockException ex) {
            // 处理被流控的逻辑
            log.info("blocked!");
            return "被流控了";
        }
    
    }
    /**
     * 定义流控规则
     */
    @PostConstruct
    private static void initFlowRules(){
        List<FlowRule> rules = new ArrayList<>();
        FlowRule rule = new FlowRule();
        //设置受保护的资源
        rule.setResource(RESOURCE_NAME);
        // 设置流控规则 QPS
        rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        // 设置受保护的资源阈值
        // Set limit QPS to 20.
        rule.setCount(1);
        rules.add(rule);
        // 加载配置好的规则
        FlowRuleManager.loadRules(rules);
    }
}
```

![https://note.youdao.com/yws/public/resource/7ccbbecd48d3f995e3e36aab39a11049/xmlnote/80F68144D61543CCB96625745E23FDA2/54397](/images/sentinel/54397.png)

缺点

- 业务侵入性很强，需要在controller中写入非业务代码.
- 配置不灵活 若需要添加新的受保护资源 需要手动添加 init方法来添加流控规则  

----------

### 注解

**@SentinelResource注解实现**

@SentinelResource 注解用来标识资源是否被限流、降级。

- blockHandler:  定义当资源内部发生了BlockException应该进入的方法（捕获的是Sentinel定义的异常）
- fallback:  定义的是资源内部发生了Throwable应该进入的方法
- exceptionsToIgnore：配置fallback可以忽略的异常

源码入口：com.alibaba.csp.sentinel.annotation.aspectj.SentinelResourceAspect

1. 引入依赖

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-annotation-aspectj</artifactId>
    <version>1.8.4</version>
</dependency>
```

2. 配置切面

   ```java
   @Configuration
   public class SentinelAspectConfiguration {
   
       @Bean
       public SentinelResourceAspect sentinelResourceAspect() {
           return new SentinelResourceAspect();
       }
   }
   ```

3. UserController中编写测试逻辑，添加@SentinelResource，并配置blockHandler和fallback

```java
@SentinelResource(value = "hello world",
                  blockHandler = "handleException",
                  fallback = "fallbackException")
@RequestMapping("/hello2")
public String hello2() {
    //int i = 1 / 0;
    return "helloworld";
}

public String handleException(BlockException ex){
    return "被流控了";
}
public String fallbackException(Throwable t){
    return "被异常降级了";
}


@RequestMapping(value = "/findOrderByUserId/{id}")
@SentinelResource(value = "findOrderByUserId",
                  fallback = "fallback",fallbackClass = ExceptionUtil.class,
                  blockHandler = "handleException",blockHandlerClass = ExceptionUtil.class
                 )
public R  findOrderByUserId(@PathVariable("id") Integer id) {
    //ribbon实现
    String url = "http://mall-order/order/findOrderByUserId/"+id;
    R result = restTemplate.getForObject(url,R.class);

    if(id==4){
        throw new IllegalArgumentException("非法参数异常");
    }

    return result;
}
```

​      

4. 编写ExceptionUtil，注意如果指定了class，方法必须是static方法

```java
public class ExceptionUtil {

    public static R fallback(Integer id,Throwable e){
        return R.error(-1,"===被异常降级啦===");
    }

    public static R handleException(Integer id, BlockException e){
        return R.error(-2,"===被限流啦===");
    }
}
```


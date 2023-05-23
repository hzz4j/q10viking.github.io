---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springmvc/
typora-root-url: ..\.vuepress\public
---



1. @autowired
2. 方法参数
3. RequestContextHolder



```java
@RestController
public class TestController implements TestApi{

    @Autowired
    HttpServletRequest request;

    @Operation(summary = "测试request属性注入与方法参数注入")
    @ApiResponse(responseCode = "200", description = "测试request属性注入与方法参数注入")
    @GetMapping("/request")
    public Result<List<String>> request(HttpServletRequest methodParamRequest){
        HttpServletRequest contextRequest = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        System.out.println(this.request == methodParamRequest);
        System.out.println(this.request == contextRequest);
        System.out.println(methodParamRequest == contextRequest);

        return Result.success(
                Arrays.asList(
                        String.format("request: %s, methodParamRequest: %s, contextRequest: %s",
                                this.request, methodParamRequest, contextRequest),
                        String.format("request == methodParamRequest: %s, " +
                                "request == contextRequest: %s, " +
                                "methodParamRequest == contextRequest: %s",
                                this.request == methodParamRequest, this.request == contextRequest,methodParamRequest == contextRequest)
                )
        );

    }
}
```



> 输出

```json
{
    "code": "200",
    "msg": "success",
    "data": [
        "request: Current HttpServletRequest, methodParamRequest: org.apache.catalina.connector.RequestFacade@b41e134, contextRequest: org.apache.catalina.connector.RequestFacade@b41e134",
        "request == methodParamRequest: false, request == contextRequest: false, methodParamRequest == contextRequest: true"
    ]
}
```



## 区别

参考[Spring注入的成员属性HttpServletRequest是线程安全的吗](https://blog.csdn.net/f641385712/article/details/104579949)，里面有关于属性注入为request代理的代码分析

属性注入的是一个代理类。底层是通过RequestContextHolder获取的，所以不会有安全问题

![image-20230523231151252](/images/springboot/image-20230523231151252.png)
---
sidebarDepth: 3
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---





> 分析springboot下的spring mvc的执行流程



## @RequestParam

SpringMVC 是使用我们控制器方法的形参作为参数名称，再使用 request 的getParameterValues 方法获取的参数。所以才会有请求参数的 key 必须和方法形参变量名称保持一致的要求。

但是如果形参变量名称和请求参数的 key 不一致呢？此时，参数将无法封装成功。此时 RequestParam 注解就会起到作用，它会把该注解 value 属性的值作为请求参数的 key 来获取请求参数的值，并传递给控制器方法。



```java
@GetMapping("hello")
public String sayHello(@RequestParam("username")String name,Integer age) {
    System.out.println("控制器方法执行了"+name+","+age);
    return "success"; 
}
```

请求方式

> form-data的方式可以解析出来，可以通过@RequestParam也可以通过@RequestBody

![image-20230406172737256](/images/springmvc/image-20230406172737256.png)

> 常用的路径参数

![image-20230406172820326](/images/springmvc/image-20230406172820326.png)

### 



## @RequestBody

当我们使用 ajax 进行提交时，请求参数可能是 json 格式的：{key:value}，在此种情况下，要想实现封装以我们前面的内容是无法实现的。此时需要我们使用@RequestBody 注解

```java
@GetMapping("/say3")
public String say3(@RequestBody Map<String,Object> map) {
    log.info("name = "+ map.get("username") + ", age = " + map.get("age"));
    return "success";
}

@GetMapping("/say4")
public String say4(@RequestBody User user) {
    log.info("name = "+ user.getUsername() + ", age = " + user.getAge());
    return "success";
}
```

> 处理application/json

![image-20230406174348688](/images/springmvc/image-20230406174348688.png)



----------

> 处理**application/x-www-form-urlencoded**，下面的例子，只有`say5`能绑定值，`say6`的User里面的属性为null

```java
    @GetMapping("/say5")
    public String say5(@RequestBody MultiValueMap<String,Object> map) {
        log.info("name = "+ map.get("username") + ", age = " + map.get("age"));
        return "success";
    }

    @GetMapping("/say6")  // 需要删除@RequestBody
    public String say6(User user) {
        log.info("name = "+ user.getUsername() + ", age = " + user.getAge());
        return "success";
    }
```

![image-20230406180351747](/images/springmvc/image-20230406180351747.png)

> 但是换成post方法，则都有值

```java
@PostMapping("/say5")
public String say5(@RequestBody MultiValueMap<String,Object> map) {
    log.info("name = "+ map.get("username") + ", age = " + map.get("age"));
    return "success";
}

@PostMapping("/say6")  // 需要删除@RequestBody
public String say6(User user) {
    log.info("name = "+ user.getUsername() + ", age = " + user.getAge());
    return "success";
}
```

![image-20230406180743197](/images/springmvc/image-20230406180743197.png)





## 'x-www-form-urlencoded' or 'form-data' 

form-data适合发送文件

### content-type

![image-20230406172227046](/images/springmvc/image-20230406172227046.png)

### request payload

以不同的格式

![image-20230406172329046](/images/springmvc/image-20230406172329046.png)

`x-www-form-urlencoded`

```
username=techbos&password=Pa%24%24w0rd
```

`form-data`

```sh
--{boundary string}
Content-Disposition: form-data; name="username",

techbos
--{boundary string}
Content-Disposition: form-data; name="password",

Pa$$w0rd
--{boundary string}
Content-Disposition: form-data; name="file"; filename="image.jpg"
Content-Type: image/jpeg,

--{boundary string}--
```

![Alt Text](/images/springmvc/pzucwhmiybpy01w42z0q.png)

### 参考

['x-www-form-urlencoded' or 'form-data' 😵 ? Explained in 2 mins. - DEV Community](https://dev.to/getd/x-www-form-urlencoded-or-form-data-explained-in-2-mins-5hk6#:~:text=TL%3BDR If you need file uploads%2C form-data is,of day they both deliver some http payload.)

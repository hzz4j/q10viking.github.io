---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springboot/
typora-root-url: ..\.vuepress\public
---



::: tip

现在一般使用springboot开发时都采用Rest的风格，不怎么采用模板，但是还是有需求的情况，这里采用thymeleaf模板来演示

:::


![View-Server-Client-Life-Cycle-of-Thymeleaf-Template-2](/images/springboot/View-Server-Client-Life-Cycle-of-Thymeleaf-Template-2.jpg)

## @RestController与@Controller

- 一般采用Rest风格开发时使用的是`@RestController`或者`@Controller+@ResponseBody`的方式
- 如果使用模板则只能使用`@Controller`

> `@RestController` is the combination of `@Controller` and `@ResponseBody`.
>
> Flow of request in a `@Controller` class without using a `@ResponseBody` annotation:

![](/images/springboot/xm7KW.png)

> `@RestController` returns an object as response instead of view.

![](/images/springboot/wCZrD.png)



## 依赖

[Source Code](https://github.com/Q10Viking/learncode/tree/main/springboot/springboot-thymeleaf)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```



## thymeleaf模板文件位置配置

> 这是默认的配置

```yaml
spring:
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
```

- templates文件夹是收到保护的文件夹，通过浏览器不能访问到，需要通过内部跳转到页面，完整模板的解析
- public文件夹是不受保护的资源，可以直接访问

![image-20230605163006800](/images/springboot/image-20230605163006800.png)



## Model&ModelMap&ModelView

**为渲染视图提供数据**

```java
@Controller
@RequestMapping("/view")
public class ViewPageController {
    @GetMapping("/showViewPage")
    public String passParametersWithModel(Model model) {
        Map<String, String> map = new HashMap<>();
        map.put("spring", "mvc");
        model.addAttribute("message", "Q10Viking-model");
        model.mergeAttributes(map);
        return "view/viewPage";
    }

    @GetMapping("/printViewPage")
    public String passParametersWithModelMap(ModelMap map) {
        map.addAttribute("welcomeMessage", "welcome");
        map.addAttribute("message", "Q10Viking-modelMap");
        return "view/viewPage";
    }

    @GetMapping("/goToViewPage")
    public ModelAndView passParametersWithModelAndView() {
        ModelAndView modelAndView = new ModelAndView("view/viewPage");
        modelAndView.addObject("message", "Q10Viking-modelAndView");
        return modelAndView;
    }
}
```

![image-20230605162615378](/images/springboot/image-20230605162615378.png)

## 页面命名空间xmlns

xmlns是xml name space的缩写

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
  <div>Web Application. Passed parameter : <span th:text="${message}"></span></div>
</body>
</html>
```

> 为什么需要xmlns

在xhtml中允许使用不同的dtd文件，不同的dtd文件可能包含相同的标识，这样会出现标志冲突问题，使用xmlns的话就可以区分开在不同文件相同的标识。例如在a.dtd和b.dtd中都包含了table,但是如果一个xhtml中同时包含了这两个dtd文件，且使用了tableb标签，这样就会出现标志冲突问题，为了解决这个问题，就可以使用xmlns如下

```html
<html xmlns:a="[http://www.a.com](http://www.a.com/)">
<html xmlns:b="[http://www.b.com](http://www.b.com/)">
<a:table...>
<b:table...>
```

这样就区分开了使用的是哪个dtd文件中的标志。



## 表单提交

[Thymeleaf标准URL语法 - Thymeleaf教程 (yiibai.com)](https://www.yiibai.com/thymeleaf/standardurlsyntax.html) `@{}`

```java
@GetMapping("/greeting") // 获取表单页面
public String greetingForm(Model model) {
    log.info(model.toString());
    model.addAttribute("greeting", new Greeting());
    return "greeting/greeting";
}


// 提交表单
@PostMapping("/greeting")
public String greetingSubmit(@ModelAttribute Greeting greeting, Model model) {
    model.addAttribute("greeting", greeting);
    log.info(greeting.toString());
    log.info(model.toString());
    return "greeting/result";
}
```

> greeting.html

```html
<!DOCTYPE HTML>
<html xmlns:th="https://www.thymeleaf.org">
<head>
  <title>Getting Started: Handling Form Submission</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<h1>Form</h1>
<form action="#" th:action="@{/greeting}" th:object="${greeting}" method="post">
  <p>Id: <input type="text" th:field="*{id}" /></p>
  <p>Message: <input type="text" th:field="*{content}" /></p>
  <p><input type="submit" value="Submit" /> <input type="reset" value="Reset" /></p>
</form>
</body>
</html>
```



## @ModelAtrribute

- 定在方法上，表示每次请求到具体的mapping method之前都会调用此方法，我们可以在这里面设置Model的数据
  - 直接返回数据，key为名字如employees，data为返回的值
  - 使用参数的Model传入数据
- 定义在方法参数上，可以获取上部绑定的值

```java
@Controller
@Slf4j
public class EmployeeController {

    Map<Long, Employee> employeeMap = new HashMap<>();

    @ModelAttribute("employees")
    public List<Employee> initEmployees() {
        log.info("initEmployees: size="+ employeeMap.size());
        employeeMap.put(1L, new Employee(1L, "John", "223334411", "rh"));
        employeeMap.put(2L, new Employee(2L, "Peter", "22001543", "informatics"));
        employeeMap.put(3L, new Employee(3L, "Mike", "223334411", "admin"));
        return new ArrayList<Employee>(employeeMap.values());
    }

    @ModelAttribute
    public void addAttributes(final Model model) {
        log.info("addAttributes");
        model.addAttribute("msg", "Welcome to the Netherlands!");
    }

    @RequestMapping(value = "/employee", method = RequestMethod.GET)
    public ModelAndView showEmployees(@ModelAttribute("employees") final List<Employee> employees) {
        System.out.println(Arrays.toString(employees.toArray()));
        return new ModelAndView("employee/employeeHome");
    }

    @RequestMapping(value = "/employee/{Id}",method = RequestMethod.GET)
    public @ResponseBody Employee getEmployeeById(@PathVariable final Long Id) {
        return employeeMap.get(Id);
    }
}

```

```html
<div th:switch="${employees}">
  <h2 th:case="null">No employees yet!</h2>
  <div th:case="*">
    <h2>Employees</h2>
    <h3 th:text="${msg}"></h3>
    <table>
      <thead>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>contactNumber</th>
        <th>workingArea</th>
      </tr>
      </thead>
      <tbody>
      <tr th:each="employee : ${employees}">
        <td th:text="${employee.id}"></td>
        <td th:text="${employee.name}"></td>
        <td th:text="${employee.contactNumber}"></td>
        <td th:text="${employee.workingArea}"></td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
```



请求两次

![image-20230605190623356](/images/springboot/image-20230605190623356.png)

![image-20230605190704281](/images/springboot/image-20230605190704281.png)

## 参考

[Tutorial: Thymeleaf + Spring](https://www.thymeleaf.org/doc/tutorials/3.1/thymeleafspring.html)

[Spring Boot - How Thymeleaf Works? - GeeksforGeeks](https://www.geeksforgeeks.org/spring-boot-how-thymeleaf-works/)

[Getting Started | Handling Form Submission (spring.io)](https://spring.io/guides/gs/handling-form-submission/)

[Model, ModelMap, and ModelAndView in Spring MVC | Baeldung](https://www.baeldung.com/spring-mvc-model-model-map-model-view)

[Spring Boot CRUD Application with Thymeleaf | Baeldung](https://www.baeldung.com/spring-boot-crud-thymeleaf)


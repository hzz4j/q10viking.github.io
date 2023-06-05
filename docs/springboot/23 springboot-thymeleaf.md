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

## @RestController与@Controller

- 一般采用Rest风格开发时使用的是`@RestController`或者`@Controller+@ResponseBody`的方式
- 如果使用模板则只能使用`@Controller`

> `@RestController` is the combination of `@Controller` and `@ResponseBody`.
>
> Flow of request in a `@Controller` class without using a `@ResponseBody` annotation:

![](/images/springboot/xm7KW.png)

> `@RestController` returns an object as response instead of view.

![](/images/springboot/wCZrD.png)



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

![image-20230605163006800](/C:/Users/11930/AppData/Roaming/Typora/typora-user-images/image-20230605163006800.png)



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



## 参考

[Tutorial: Thymeleaf + Spring](https://www.thymeleaf.org/doc/tutorials/3.1/thymeleafspring.html)

[Spring Boot - How Thymeleaf Works? - GeeksforGeeks](https://www.geeksforgeeks.org/spring-boot-how-thymeleaf-works/)

[Getting Started | Handling Form Submission (spring.io)](https://spring.io/guides/gs/handling-form-submission/)

[Model, ModelMap, and ModelAndView in Spring MVC | Baeldung](https://www.baeldung.com/spring-mvc-model-model-map-model-view)


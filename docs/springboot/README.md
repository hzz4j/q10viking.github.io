---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---





::: tip
[Spring Boot document](https://spring.io/projects/spring-boot)
::: 



## 基础知识

@RestController的作用等同于@Controller + @ResponseBody

----------

使用@RequestBody注解时，是用于接收Content-Type为application/json类型的请求,数据类型是JSON：{"aaa":"111","bbb":"222"}

不使用@RequestBody注解时，可以接收Content-Type为application/x-www-form-urlencoded类型的请求所提交的数据，数据格式：aaa=111&bbb=222 ,form表单提交以及jQuery的.post()方法所发送的请求就是这种类型。





## 资源

[Agenda - Spring Boot - Spring Academy](https://spring.academy/courses/spring-boot/lessons/agenda)
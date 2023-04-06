---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springmvc/
typora-root-url: ..\.vuepress\public
---



## SpringMVC执行过程

- DispatcherServlet： 前端调度器 ， 负责将请求拦截下来分发到各控制器方法中
- 负责根据请求的URL和配置@RequestMapping映射去匹配， 匹配到会返回Handler（具体控制器的方法）
- 负责调用Handler-具体的方法-  返回视图的名字  Handler将它封装到ModelAndView(封装视图名，request域的数据）
-  根据ModelAndView里面的视图名地址去找到具体的jsp封装在View对象中
- 进行视图渲染（将jsp转换成html内容 --这是Servlet容器的事情了） 最终response到的客户端

![img](/images/springmvc/460)

1. 用户发送请求至前端控制器DispatcherServlet

2. DispatcherServlet收到请求调用处理器映射器HandlerMapping。

3. 1. 处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。

4. DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter,执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作

5. 执行处理器Handler(Controller，也叫页面控制器)。

6. 1. Handler执行完成返回ModelAndView
   2. HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet

7. DispatcherServlet将ModelAndView传给ViewReslover视图解析器

8. 1. ViewReslover解析后返回具体View

9. DispatcherServlet对View进行渲染视图（即将模型数据model填充至视图中）。

10. DispatcherServlet响应用户。



> **整个调用过程其实都在DispatcherServlet#doDispatch中体现了**

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
   
   try {
      
      try {
          // 文件上传相关
         processedRequest = checkMultipart(request);
         multipartRequestParsed = (processedRequest != request);
         
        // DispatcherServlet收到请求调用处理器映射器HandlerMapping。
        // 处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。
         mappedHandler = getHandler(processedRequest);
         if (mappedHandler == null) {
            noHandlerFound(processedRequest, response);
            return;
         }

        // 4.DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter,
         HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

         // Process last-modified header, if supported by the handler.  HTTP缓存相关
         String method = request.getMethod();
         boolean isGet = HttpMethod.GET.matches(method);
         if (isGet || HttpMethod.HEAD.matches(method)) {
            long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
            if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
               return;
            }
         }
         // 前置拦截器
         if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            // 返回false就不进行后续处理了
            return;
         }

         // 执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作
         // 执行处理器Handler(Controller，也叫页面控制器)。
         // Handler执行完成返回ModelAndView
         // HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet
         mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

         if (asyncManager.isConcurrentHandlingStarted()) {
            return;
         }
         // 如果没有视图，给你设置默认视图  json忽略
         applyDefaultViewName(processedRequest, mv);
         //后置拦截器
         mappedHandler.applyPostHandle(processedRequest, response, mv);
      }
      catch (Exception ex) {
         dispatchException = ex;
      }
      catch (Throwable err) {
         // As of 4.3, we're processing Errors thrown from handler methods as well,
         // making them available for @ExceptionHandler methods and other scenarios.
         dispatchException = new NestedServletException("Handler dispatch failed", err);
      }
      // DispatcherServlet将ModelAndView传给ViewReslover视图解析器
      // ViewReslover解析后返回具体View
      // DispatcherServlet对View进行渲染视图（即将模型数据model填充至视图中）。
      // DispatcherServlet响应用户。
      // 最后执行拦截器的afterCompletion
      processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
   }
   catch (Exception ex) {
      triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
   }
   catch (Throwable err) {
      triggerAfterCompletion(processedRequest, response, mappedHandler,
            new NestedServletException("Handler processing failed", err));
   }
   finally {
      if (asyncManager.isConcurrentHandlingStarted()) {
         // Instead of postHandle and afterCompletion
         if (mappedHandler != null) {
            mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
         }
      }
      else {
         // Clean up any resources used by a multipart request.
         if (multipartRequestParsed) {
            cleanupMultipart(processedRequest);
         }
      }
   }
```




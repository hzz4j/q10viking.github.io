---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /spring/
typora-root-url: ..\.vuepress\public
---



Lifecycle表示的是ApplicationContext的生命周期，可以定义一个SmartLifecycle来监听ApplicationContext的启动和关闭

```java
@Component
public class ZhouyuLifecycle implements SmartLifecycle {

 private boolean isRunning = false;

 @Override
 public void start() {
  System.out.println("启动");
  isRunning = true;
 }

 @Override
 public void stop() {
        // 要触发stop()，要调用context.close()，或者注册关闭钩子（context.registerShutdownHook();）
  System.out.println("停止");
  isRunning = false;
 }

 @Override
 public boolean isRunning() {
  return isRunning;
 }
}
```


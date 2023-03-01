---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



Timer只有一个线程，如果任务抛出异常，那么后续提交的任务，将不再执行。

而ScheduleThreadPoolExecutor，任务抛出异常，只是任务丢失了，如果线程池没有线程了，会补充添加一个线程进去。



TODO 异常体现 和 任务运行时间

Timer： 单线程，线程挂了，不会再创建线程执行任务

定时线程池： 线程挂了，再提交任务，线程池会创建新的线程执行任务


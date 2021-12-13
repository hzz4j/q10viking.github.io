1. 生命周期
2. 生命周期的监听函数
3. 各种类加载器
4. 用类加载器来加载基础设施类
5. xml文件的解析
6. 堆栈来设置层级结构
7. MBeanBase JMX jconsole
8. 部署应用StandardContext
9. Adaptor,mapping组件将请求映射到指定的应用

----------

自定义类加载器

- tomcat自己有不同的类加载器WebappClassLoaderBase

--------

发送数据

- Content-Length: 3;  IdentityInputFilter

- 另外一种方式Transfer-encoding: chunked,规范 ChunkedInputFilter

  ```
  在最后一行的时候
  
  sb.append("2\r\n")
  sb.append("aa\r\n");
  sb.append("0\r\n")
  sb.append("\r\n")
  ```

  

## 打包成Jar

[(7条消息) IDEA初见---输出HelloWorld,并打包成jar包_小白-CSDN博客_helloworld jar包](https://blog.csdn.net/weixin_36910300/article/details/78505144)
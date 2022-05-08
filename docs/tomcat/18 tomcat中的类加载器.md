## Java中系统自带的类加载器

每个类加载器对应的目录

系统类加载器（应用程序类加载器 指定的classpath），扩展类加载器，启动类加载器。

“**双亲委派**”: 首先委派给父类加载器，父类加载器没有加载到类，自己才进行类的加载

```java
abstract ClassLoader {
	loadClass(String name){}   // 进行了并发的控制，每个类加载器再加载一个类都有对应的一把锁
}
```



## 自定义类加载器打破双亲委派机制

1. 继承抽象的ClassLoader类

2. 指定父类加载器

3. 指定加载类的路径（在findClass中使用该路径）

   ```java
   findClass(String name){
       // 读取文件为字节
   	byte[] data = getBytes("指定目录下的类文件");
       // 调用java中提供的defineClass方法将字节数据变成Java对象
        Class clazz = this.defineClass(name,data,0,data.length);
       return clazz;
   }
   ```

   
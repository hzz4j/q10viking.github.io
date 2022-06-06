---
typora-root-url: ..\.vuepress\public
---

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

> 打破双亲委派（**就是加载类的先后顺序问题**）就是自己定义的类加载器先去加载，更好的利用双亲委派。

1. 继承抽象的ClassLoader类

2. 指定父类加载器与Java系统关联起来

3. 指定加载类的路径（在findClass中使用该路径），**这个过程就是实际去加载类（将class文件读取成二进制流，然后转化为Class对象）**

   ```java
   findClass(String name){
       // 读取文件为字节
   	byte[] data = getBytes("指定目录下的类文件");
       // 调用java中提供的defineClass方法将字节数据变成Java对象，在这个方法中或进行类的沙箱保护机制
        Class clazz = this.defineClass(name,data,0,data.length);
       return clazz;
   }
   ```

4. 在loadClass方法中进行打破双亲委派

   1. 需要注意到的点是**在加载一个类的过程中，这个类依赖到的其他类，那么这些类也是使用这个类加载器进行去加载，也就是说java系统就会再次调用我们自定义的类加载器去加载这个依赖的类，也就说重新调用自定义类加载器的loadClass方法**

   2. java有**沙箱保护机制**，对于包名以java开头的类，会提供保护。所以java中保护类需要先使用Java中类加载器进行加载，**但是我们需要越过系统类加载器。**

      ```java
      Exception in thread "main" java.lang.SecurityException: Prohibited package name: java.lang
      ```

```java
package org.hzz;

import java.io.*;

public class MyClassLoader extends ClassLoader{

    @Override
    public Class<?> loadClass(String name) throws ClassNotFoundException {
        ClassLoader extClassLoader = getSystemClassLoader().getParent();
        Class<?> aClass = null;
        try{
             aClass = extClassLoader.loadClass(name);
        }catch (ClassNotFoundException ignore){}

        if(aClass != null){
            return aClass;
        }
        return findClass(name);
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] data = getBytes("D:\\learncode\\classloader\\out\\production\\classloader\\org\\hzz\\Test1.class");
        // defineClass方法中会进行类的沙箱安全保护机制
        Class<?> aClass = this.defineClass(name, data, 0, data.length);
        return aClass;
    }

    private byte[] getBytes(String path){
        byte[] data = null;
        FileInputStream in = null;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            in = new FileInputStream(new File(path));
            int b;
            while((b = in.read())!=-1){
                out.write(b);
            }
            data = out.toByteArray();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if(in != null) in.close();
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return data;
    }


    public static void main(String[] args) throws ClassNotFoundException {
        MyClassLoader myClassLoader1 = new MyClassLoader();
        MyClassLoader myClassLoader2 = new MyClassLoader();
        Class<?> aClass = myClassLoader1.loadClass("org.hzz.Test1");
        Class<?> bClass = myClassLoader2.loadClass("org.hzz.Test1");
        System.out.println(aClass == bClass); // false
        System.out.println(aClass.getClassLoader()); // org.hzz.MyClassLoader@1b6d3586
    }
}

```



## 不同类加载器实例加载出来的类是不同的

> JVM中确定一个类是 classloader + class

```java
MyClassLoader myClassLoader1 = new MyClassLoader();
MyClassLoader myClassLoader2 = new MyClassLoader();
Class<?> aClass = myClassLoader1.loadClass("org.hzz.Test1");
Class<?> bClass = myClassLoader2.loadClass("org.hzz.Test1");
System.out.println(aClass == bClass); // false
```



## tomcat类加载器处理应用的原理

WebappClassLoader:tomat中用于部署应用，比如说有两个应用，这两个应用都有相同的类名。org.hzz.Test。

那么tomcat为了区分，就使用自定义的类加载器，来分别加载应用中的类

```
WebappClassLoader实例(目录)--------应用1
WebappClassLoader实例（目录）--------应用2
```

Tomcat中内部也有很多类需要加载,

tomcat中的实现

```java
Context
	name
	WebappClassLoader
```

![](/images/tomcat/image-20220508145923528.png)

## WebappClassLoader加载类原理

```
1. 先从tomcat的缓冲中查找是否加过这个类
2. 再从jvm的缓冲中查找是否加载过这个类
3. 先从扩张类加载加载器去加载类，处理java的沙箱安全保护机制、
4. 是否用父类加载器去加载 Class.forName(name,false,parentClassLoader);
5. 没有委托，那么就自己就先去加载类
6. 还是没有找到，那么就委托父类加载器去加载
```

### 实际去加载类findClass

> 从引用的classes 目录和lib包目录下

```java
// WebappClassLoaderBase  ResourceEntry findResourceInternal
1. 先生成ResourceEntry对象（urlpath,文件的二进制内容，loadedClass对象）
	2. 在生成的ResourceEntry对象中会去读取class文件
	
2. 获取这个ResourceEntry对象中加载的类文件的二进制数据，去生成类（defineClass）
3. 将这个ResourceEntry的属性
```

那么如何去找到文件，生成字节流呢？尤其是在jar包中的

1. 普通的class根据路径直接去找

2. jar包里面的class

   ```java
   // 去Jar包中寻找这个类,扎到了返回,没有就为null
   JarEntry jarfile = JarFile.getJarEntry("org/apache/catalina/deploy/ServletDef.class");
   ```

   

## 实战从jar包中加载一个类

>  D:\learncode\classloader\src\org\hzz\JarFileTest.java

```java
package org.hzz;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

public class JarFileTest extends ClassLoader{
    public static void main(String[] args) throws Exception {
        JarFile jarFile = new JarFile("D:\\learncode\\classloader\\myjars\\hzz-test.jar");
        ZipEntry entry = jarFile.getEntry("org/hzz/Test1.class");
        // 处理二进制数据
        int contentLength = (int)entry.getSize();
        byte[] binaryContent = new byte[contentLength];
        InputStream binaryStream = jarFile.getInputStream(entry);
        int pos = 0;
        while (true) {
            int n = binaryStream.read(binaryContent, pos,
                    binaryContent.length - pos);
            if (n <= 0)
                break;
            pos += n;
        }
        // 加载类
        Class<?> aClass = new JarFileTest().defineClass("org.hzz.Test1",
                binaryContent, 0, binaryContent.length);
        Method main = aClass.getDeclaredMethod("main", String[].class);
        //Thread.currentThread().setContextClassLoader(aClass.getClassLoader());
        main.invoke(null, (Object)new String[]{});
        System.out.println(aClass.getClassLoader());
//        Enumeration entries = jarFile.entries();
//        while (entries.hasMoreElements()) {
//            System.out.println(entries.nextElement());
//        }
    }
}

```



## 热加载

WebappLoader.java

需要有一个线程去监听

### 检测文件是否修改

#### 1. 如何判断一个文件是否变化？

比较文件的修改时间。

如果文件不存在了，则抛出一个异常

---------

**jar包是否有添加和删除**: tomcat在加载应用时会把jar包的名称存储起来，当检测的时候，又去获取所所有的jar包，然后进行比较。

```
[1.jar,2.jar]  启动时读取到的jar包
[11.jar,23.jar]  修改后的jar包，检测时读取到的
```

当检测到有修改后。就调用StandardContext.reload

```
在reload中会重新stop()--->start()
热加载 context实例还是存在的，只是在stop时将webappclassLoader = null;当start时又会重新创建一个WebAppClassLoader
最后调用WebappLoader中的startInternal()方法，创建新的WebappClassLoader实例，然后开始重新加载应用。到此tomcat的热部署流程就完成了。
```

在java中类的加载是jvm自动帮我们做的。那么在tomcat中自定义加载器之后，难道加载应用的类时。每次都去调用WebappClassLoader的loadClass方法吗？**只需要loadClass一次，那么在这个类中所有new出来的对象都是由这个类加载加载的**

```java
// 如果我们通过自定义的类加载器加载一个类
MyClassLoader1 myClassLoader1 = new MyClassLoader1();
Class<?> aClass = myClassLoader1.loadClass("org.hzz.Test1");
Object o = aClass.newInstance();  //在Test1的构造方法中A a = new A()对象，那么a.getClass().getClassLoader()还是我们自定的类加载器
```



```
Context
	name
	reloadable = true
	WebappClassLoader
```

第二个问题： 如果之前的类已经实例化了，已经被业务代码使用了，那么重新加载这个类，怎么直到哪个业务类引用了这个实例？其实并不是我想的这样，而是把整个应用又重新加载了一遍。[Tomcat热部署实现原理 - andrew2717 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yuanjia2717/p/11279312.html)

## 什么是热部署？

tomcat中应用的配置变更了

会将context实例销毁掉，重新新生一个Context












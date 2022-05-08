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

2. 指定父类加载器与Java系统关联起来

3. 指定加载类的路径（在findClass中使用该路径）

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


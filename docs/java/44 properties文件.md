---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 1. ResourceBundle解析

1. 在maven项目中properties放在类加载路径下，即resource文件夹中
2. 可以使用`java.util.ResourceBundle`解析properties文件

> 获取该文件时不能传入后缀名

<img src="/images/filesystem/image-20201008155013339.png" alt="image-20201008155013339" />



### 1.1 ResourceBundle是用于国际化的

![image-20210205012323300](/images/java/image-20210205012323301)

```java
public class ResourceBundleDemo {
    public static void main(String[] args) throws UnsupportedEncodingException {
        printMsg(Locale.SIMPLIFIED_CHINESE);
        System.out.println("-----------------------");
        printMsg(Locale.ENGLISH);

    }

    private static void  printMsg(Locale locale) throws UnsupportedEncodingException {
        ResourceBundle resourceBundle = ResourceBundle.getBundle("test", locale);
        String value = resourceBundle.getString("name");
        String utf8Value = new String (value.getBytes("ISO-8859-1"),"utf-8");
        System.out.println(utf8Value);
    }
}

/**
 黄壮壮
 -----------------------
 huangzhuangzhuang
 */
```





## 2 Properties解析

### 2.1 类加载器

1. thread context ClassLoader 线程上下文加载器
2. class loader 类加载器
3. bootstrap ClassLoader 引导类加载器

```java
public static ClassLoader getDefaultClassLoader() {
		ClassLoader cl = null;
		try {
			cl = Thread.currentThread().getContextClassLoader();
		}
		catch (Throwable ex) {
			// Cannot access thread context ClassLoader - falling back...
		}
		if (cl == null) {
			// No thread context class loader -> use class loader of this class.
			cl = ClassUtils.class.getClassLoader();
			if (cl == null) {
				// getClassLoader() returning null indicates the bootstrap(引导类) ClassLoader
				try {
					cl = ClassLoader.getSystemClassLoader();
				}
				catch (Throwable ex) {
					// Cannot access system ClassLoader - oh well, maybe the caller can live with null...
				}
			}
		}
		return cl;
	}
```





### 2.2 加载Properties文件

1. Properties **load方法**

   ```java
   load(InputStream in);	//	可以借助类加载器来加载进来流
   load(Reader reader);	//	spring EncodeResource.getReader
   ```

2. 类加载器的getResourceAsStream ,进行辅助即可

#### 2.2.1 通过ClassLoader



1. 主要是为了解决`classpath`问题



##### 1 测试用例(单个properties文件)

![image-20210203173832205](/images/java/image-20210203173832205.png)

```java
public class PropertiesTestDemo {

    public static void main(String[] args) throws IOException {
        String resourceName = "META-INF/spring.handlers";

        ClassLoader classLoaderToUse = Thread.currentThread().getContextClassLoader();

        URL url = classLoaderToUse.getResource(resourceName);
		
        //	InputStream is = url.openConnection().getInputStream();
	   InputStream is = url.openStream();	//	简化版
        Properties properties = new Properties();
        try{
            properties.load(is);
        }finally {
            is.close();
        }
        //  {http://time.geekbang.org/schema/users=org.geekbang.thinking.in.spring.configuration.meta.UsersNamespaceHandler}
        System.out.println(properties);
    }
}

```



##### 2 更加简便的方法

```java
public class PropertiesTestDemo {

    public static void main(String[] args) throws IOException {
        String resourceName = "META-INF/spring.handlers";
        //  相比 new FileInputStream() 容易解决classpath路径问题
        InputStream is = PropertiesTestDemo.class.getClassLoader().getResourceAsStream(resourceName);

        Properties props = new Properties();
        try{
            props.load(is);
        }finally {
            is.close();
        }

        //  {http://time.geekbang.org/schema/users=org.geekbang.thinking.in.spring.configuration.meta.UsersNamespaceHandler}
        System.out.println(props);

    }
}
```



### 2.3 使用Spring 封装好的ClasspathResource

```java
public static void main(String[] args) throws IOException {
        String resourceName = "META-INF/spring.handlers";

        ClassPathResource resource = new ClassPathResource(resourceName);

        InputStream is = resource.getInputStream();
        Properties properties = new Properties();
        try{
            properties.load(is);
        }finally {
            is.close();
        }
        //  {http://time.geekbang.org/schema/users=org.geekbang.thinking.in.spring.configuration.meta.UsersNamespaceHandler}
        System.out.println(properties);
    }
```



------------------



## 3 Properties与Map之间的相互转化



```java
// map转化为properties
Map<String,String> map = new HashMap(properties);

//	properties 转化为 map
Properties properties = new Properties();
properties.putAll(Map)
```

```java
public class TravelProperties {
    public static void main(String[] args) throws IOException {
        InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("META-INF/default.properties");

        Properties properties = new Properties();
        properties.load(is);

       Map<String,String> map = new HashMap<>();
        for(Map.Entry<Object, Object> entry: properties.entrySet()){
            map.put((String)entry.getKey(),(String)entry.getValue());
        }

        System.out.println(map);
    }
}
/**
 {school=CAU, name=Q10Viking}
 */
```

## 4 Propterties常用方法

### 4.1 clear清空

```java
//	Clears this hashtable so that it contains no keys.
clear() 
```

### 4.2 putAll 添加Map或者是Properties对象

```java
//	Properties extends HashTable 而 HashTable实现了Map
putAll(Map)
```


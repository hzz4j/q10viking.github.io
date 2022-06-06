## tomcat中使用自定义的类加载器加载类

在tomcat中可以看到很多类都是通过自定义类加载器loadClass的方式来加载类的，然后通过反射的方式创建加载出来类的实例。而这个类的构造方法中往往又new 出来许多新的对象。那么这些new出来的新的对象也是通过加载这个类的类加载器加载的。

**下面的代码可以看到通过自定类加载加载出来的类，并不能转化，应为此时强制转化时这个类是由另外一个类加载器加载的（appclassloader)，要想调用方法，那么就必须通过反射的方式。这也就是tomcat中catalina为什么通过反射方法调用的方式。**

```java
public static void main(String[] args) throws Exception {
    MyClassLoader1 myClassLoader1 = new MyClassLoader1();
    Class<?> aClass = myClassLoader1.loadClass("org.hzz.Test1");
    Object o = aClass.newInstance();
    System.out.println(Test1.class.getClassLoader()); // 可以看到AppClassLoader是由类加载器加载的
    Test1 t1 = (Test1) o;  // java.lang.ClassCastException: org.hzz.Test1 cannot be cast to org.hzz.Test1
    ((Test1) o).methodB();
}
```



## Tomcat启动流程-初始化

通过解析server.xml配置文件，通过tomcat自定义的类加载器，去加载类，生成一系列容器对象。接着开始启动

```
BootStrap.start()--->Catalina.start()---->Server.start()继续调用
--->server.init() 注册MBean jmx
--->service.init()
	---> connector.init()  ---> 创建了一个CoyoteAdapter
					   ----> 协议初始化如 Http11Protocol.init
					   		---> endpoint.init()
					   			---> endpoint.bind 是否在初始化绑定
					   				---> serverSocketFactory = new DefaultServerSocket
					   				---> serverSocker = serverSocketFactory.createSocket
					   ----> mapperListener.init(); // mapper的生成
	---> engine.init()  
```

## Tomcat启动流程-启动

```
Server.start() 初始化完成server.init()后，然后调用进行启动 ---> startInternal()
--->service.start()
	---> connector.start()
		----> 协议处理启动如 Http11Protocol.start()
			---> endpoint.start()
				---> endpoint.bind 如果没有在初始化时绑定，则绑定
					   ---> serverSocketFactory = new DefaultServerSocket
					   ---> serverSocker = serverSocketFactory.createSocket			
		----> mapperListener.start(); // mapper的生成
	---> engine.start()  
			threadStart();会启动一个后台线程，处理各个容器的后台任务container.backgroundProcess。⭐比如session的过期，热部署
```

### mapper映射关系的生成

> org.apache.catalina.connector.MapperListener#startInternal
>
> 在处理请求时快速解析当前请求对应的context,对应的Wrapper

```
mapper对象
	List<Host>  
		Host: 下有List<Context>
			context: 下有List<Wrapper>
				Wrapper: Servlet的映射关系
```



## tomcat的SPI机制

> 在tomat中启动StandardContext.start()时，会触发一个事件，通知对应的监听器，去META-INF/services/目录下找到ServletContainerInitializer文件

tomcat中SPI机制的实现：org.apache.catalina.startup.WebappServiceLoader#load。大概原理就是去这个目录下（META-INF/services/）读取javax.servlet.ServletContainerInitializer文件。将里面的内容读取出来，然后通过来加载器进行加载。

```java
is = url.openStream();  // url是ClassLoader.getSystemResources(configFile)
InputStreamReader in = new InputStreamReader(is, UTF8);
reader = new BufferedReader(in);
String line;
while ((line = reader.readLine()) != null) {
    int i = line.indexOf('#');
    if (i >= 0) {
        line = line.substring(0, i);
    }
    line = line.trim();
    if (line.length() == 0) {
        continue;
    }
    servicesFound.add(line);
}
```



> 通过SPI机制发现的类，在这里StandardContext.start()进行调用。

```java
// Call ServletContainerInitializers
for (Map.Entry<ServletContainerInitializer, Set<Class<?>>> entry :
     initializers.entrySet()) {
    try {
        entry.getKey().onStartup(entry.getValue(),
                                 getServletContext());
    } catch (ServletException e) {
        log.error(sm.getString("standardContext.sciFail"), e);
        ok = false;
        break;
    }
}
```



## Tomcat为什么会阻塞

> tomcat运行main方法后为什么没有结束？

```
Catalina.start()--->在方法的最后有一个
await() // 阻塞
	---> getServer().await() 在这个方法中开启了一个ServerSocket,不断循环监听连接，如果有连接发送进来，并且发送了退出命令，那么就跳出循环，如果port设置是-1，那么就不断的循环睡眠，默认的端口是8005
stop(); //阻塞唤醒后就停止
```

> port设置为1的情况，不断循环睡眠

```java
private volatile boolean stopAwait = false;

while(!stopAwait) {
    try {
    	Thread.sleep( 10000 );
    } catch( InterruptedException ex ) {
    // continue and check the flag
    }
}
```

> 接收连接，发送SHUTDOWN后，退出 org.apache.catalina.core.StandardServer#await

```java
int expected = 1024; // Cut off to avoid DoS attack
while (expected < shutdown.length()) {
    if (random == null)
        random = new Random();
    expected += (random.nextInt() % 1024);
}
while (expected > 0) {
    int ch = -1;
    try {
        ch = stream.read();		// socket.setSoTimeOut(10*1000) 设置了超时时间
    } catch (IOException e) {
        log.warn(sm.getString("standardServer.accept.readError"), e);
        ch = -1;
    }
    // Control character or EOF (-1) terminates loop
    if (ch < 32 || ch == 127) {
        break;
    }
    command.append((char) ch);
    expected--;
}
} finally {
    // Close the socket now that we are done with it
    try {
        if (socket != null) {
            socket.close();
        }
    } catch (IOException e) {
        // Ignore
    }
}

// Match against our command string
boolean match = command.toString().equals(shutdown);
```

----------

## tomcat部署应用

> 在StandardContext启动时

```
实例化StandardContext
	webappclassloader
start() 在这个过程中
	会解析web.xml文件,生成一个WEBXML对象
		List<ServletDef> 
		List<FilterDef>
	设置属性： 
		如webappclassloader
		  List<Wrapper>
		  mapper
做完这些之后，就会生成一个mapping
```

> mapper启动时进行生成映射关系

```
mapper对象
	List<Host>  
		Host: 下有List<Context>
			context: 下有List<Wrapper>
				Wrapper: Servlet的映射关系
	
```

## tomcat中请求经过流程

接收到请求之后，adapter组件（将映射关系放到request的mappingdata中），mapping组件，解析到请求

adapter将解析出来的数据 host context wrapper   在request中保存了mappingdata数据（StandardHost,StandardContext,StandardWrapper）

request

开始执行StandardHost的阀门Valve 直到最后一个Value（在容器中单独标识了最后的阀门，用于处理连接到下一个容器，StandardEngineValve）.

再执行StandardHost的阀门Valve 直到最后一个Value.

再执行StandardHost的阀门Valve 直到最后一个Value. （最后一个阀门，是**StandardWrapperValve**））

**在这个StandardWrapperValve阀门中,进行了servlet的类加载--->走过滤器链---->调用到Servlet的service方法。**

> **阀门相当于一个链表,每个阀门都有一个next属性**



## tomcat解析类文件是否有指定注解

org.apache.catalina.startup.ContextConfig#processAnnotationsStream

它居然能解析出来是否有注解
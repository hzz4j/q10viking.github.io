

> 说明

```java
// initialize 设置成true会初始化，也会执行static静态代码块
// 设置成false,则不会初始化，也不会执行static静态代码块
public static Class<?> forName(String name, boolean initialize,
                                   ClassLoader loader)
```

> 测试

```java
public abstract class SelectorImpl {
    protected Set<Integer> selectedKeys = new HashSet();
    static {
        System.out.println("run?");
    }
}
```

```java
public class NioEventLoop {
    public NioEventLoop()  {}
    public void getSelectorImplClass(){
        try{
            // initialize设置true或false
            Class<?> selectorImplClass = Class.forName("org.hzz.reflect.netty.SelectorImpl",
                    false,ClassLoader.getSystemClassLoader());

        }catch (Exception xxx){}
    }

}
```

```java
public class TestMain {
    public static void main(String[] args) {
        NioEventLoop nioEventLoop = new NioEventLoop();
        nioEventLoop.getSelectorImplClass();   // SelectorImpl静态代码块没有执行
    }
}
```


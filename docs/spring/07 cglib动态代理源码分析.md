---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /spring/
typora-root-url: ..\.vuepress\public
---



## 使用

### 代理类

> 定义一个UserService类

```java
public class UserService {
    public void test() {
        System.out.println("test");
    }
}
```

> cglib实现代理

```java
public class Main {
    public static void main(String[] args) {
        final UserService target = new UserService();
        Enhancer enhancer = new Enhancer();
        enhancer.setUseCache(false);
        enhancer.setSuperclass(UserService.class);
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                if(method.getName().equals("test")){
                    System.out.println("before");
                    Object result = method.invoke(target, objects);
                    System.out.println("after");
                    return result;
                }
                return method.invoke(target, objects);
            }
        });

        UserService proxy = (UserService) enhancer.create();
        proxy.test();
    }
}
/**
 * before
 * test
 * after
 */
```

### 代理接口



> 定义一个接口

```java
public interface UserServiceInterface {
    void test();
}
```

> cglib实现代理

```java
public class MainInterface {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setUseCache(false);
        enhancer.setSuperclass(UserServiceInterface.class);
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                if(method.getName().equals("test")){
                    System.out.println("执行切面逻辑");
                }
                return null;
            }
        });

        Object proxy = enhancer.create();
        ((UserServiceInterface)proxy).test();
    }
}
/**
 * 执行切面逻辑
 */
```





## 查看生成的代理类

```
-Dcglib.debugLocation=D:\Github\learncode\spring\_03-cglib\_03-cglib\target\classes
```

![image-20230409141330800](/images/spring/image-20230409141330800.png)

::: details

```java
public class UserService$$EnhancerByCGLIB$$7fc9ae62 extends UserService implements Factory {
    private boolean CGLIB$BOUND;
    public static Object CGLIB$FACTORY_DATA;
    private static final ThreadLocal CGLIB$THREAD_CALLBACKS;
    private static final Callback[] CGLIB$STATIC_CALLBACKS;
    private MethodInterceptor CGLIB$CALLBACK_0;
    private static Object CGLIB$CALLBACK_FILTER;
    private static final Method CGLIB$test$0$Method;
    private static final MethodProxy CGLIB$test$0$Proxy;
    private static final Object[] CGLIB$emptyArgs;
    private static final Method CGLIB$equals$1$Method;
    private static final MethodProxy CGLIB$equals$1$Proxy;
    private static final Method CGLIB$toString$2$Method;
    private static final MethodProxy CGLIB$toString$2$Proxy;
    private static final Method CGLIB$hashCode$3$Method;
    private static final MethodProxy CGLIB$hashCode$3$Proxy;
    private static final Method CGLIB$clone$4$Method;
    private static final MethodProxy CGLIB$clone$4$Proxy;

    static void CGLIB$STATICHOOK1() {
        CGLIB$THREAD_CALLBACKS = new ThreadLocal();
        CGLIB$emptyArgs = new Object[0];
        Class var0 = Class.forName("org.hzz.UserService$$EnhancerByCGLIB$$7fc9ae62");
        Class var1;
        Method[] var10000 = ReflectUtils.findMethods(new String[]{"equals", "(Ljava/lang/Object;)Z", "toString", "()Ljava/lang/String;", "hashCode", "()I", "clone", "()Ljava/lang/Object;"}, (var1 = Class.forName("java.lang.Object")).getDeclaredMethods());
        CGLIB$equals$1$Method = var10000[0];
        CGLIB$equals$1$Proxy = MethodProxy.create(var1, var0, "(Ljava/lang/Object;)Z", "equals", "CGLIB$equals$1");
        CGLIB$toString$2$Method = var10000[1];
        CGLIB$toString$2$Proxy = MethodProxy.create(var1, var0, "()Ljava/lang/String;", "toString", "CGLIB$toString$2");
        CGLIB$hashCode$3$Method = var10000[2];
        CGLIB$hashCode$3$Proxy = MethodProxy.create(var1, var0, "()I", "hashCode", "CGLIB$hashCode$3");
        CGLIB$clone$4$Method = var10000[3];
        CGLIB$clone$4$Proxy = MethodProxy.create(var1, var0, "()Ljava/lang/Object;", "clone", "CGLIB$clone$4");
        CGLIB$test$0$Method = ReflectUtils.findMethods(new String[]{"test", "()V"}, (var1 = Class.forName("org.hzz.UserService")).getDeclaredMethods())[0];
        CGLIB$test$0$Proxy = MethodProxy.create(var1, var0, "()V", "test", "CGLIB$test$0");
    }

    final void CGLIB$test$0() {
        super.test();
    }

    public final void test() {
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        if (var10000 != null) {
            var10000.intercept(this, CGLIB$test$0$Method, CGLIB$emptyArgs, CGLIB$test$0$Proxy);
        } else {
            super.test();
        }
    }

    final boolean CGLIB$equals$1(Object var1) {
        return super.equals(var1);
    }

    public final boolean equals(Object var1) {
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        if (var10000 != null) {
            Object var2 = var10000.intercept(this, CGLIB$equals$1$Method, new Object[]{var1}, CGLIB$equals$1$Proxy);
            return var2 == null ? false : (Boolean)var2;
        } else {
            return super.equals(var1);
        }
    }

    final String CGLIB$toString$2() {
        return super.toString();
    }

    public final String toString() {
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        return var10000 != null ? (String)var10000.intercept(this, CGLIB$toString$2$Method, CGLIB$emptyArgs, CGLIB$toString$2$Proxy) : super.toString();
    }

    final int CGLIB$hashCode$3() {
        return super.hashCode();
    }

    public final int hashCode() {
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        if (var10000 != null) {
            Object var1 = var10000.intercept(this, CGLIB$hashCode$3$Method, CGLIB$emptyArgs, CGLIB$hashCode$3$Proxy);
            return var1 == null ? 0 : ((Number)var1).intValue();
        } else {
            return super.hashCode();
        }
    }

    final Object CGLIB$clone$4() throws CloneNotSupportedException {
        return super.clone();
    }

    protected final Object clone() throws CloneNotSupportedException {
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        return var10000 != null ? var10000.intercept(this, CGLIB$clone$4$Method, CGLIB$emptyArgs, CGLIB$clone$4$Proxy) : super.clone();
    }

    public static MethodProxy CGLIB$findMethodProxy(Signature var0) {
        String var10000 = var0.toString();
        switch (var10000.hashCode()) {
            case -1422510685:
                if (var10000.equals("test()V")) {
                    return CGLIB$test$0$Proxy;
                }
                break;
            case -508378822:
                if (var10000.equals("clone()Ljava/lang/Object;")) {
                    return CGLIB$clone$4$Proxy;
                }
                break;
            case 1826985398:
                if (var10000.equals("equals(Ljava/lang/Object;)Z")) {
                    return CGLIB$equals$1$Proxy;
                }
                break;
            case 1913648695:
                if (var10000.equals("toString()Ljava/lang/String;")) {
                    return CGLIB$toString$2$Proxy;
                }
                break;
            case 1984935277:
                if (var10000.equals("hashCode()I")) {
                    return CGLIB$hashCode$3$Proxy;
                }
        }

        return null;
    }

    public UserService$$EnhancerByCGLIB$$7fc9ae62() {
        CGLIB$BIND_CALLBACKS(this);
    }

    public static void CGLIB$SET_THREAD_CALLBACKS(Callback[] var0) {
        CGLIB$THREAD_CALLBACKS.set(var0);
    }

    public static void CGLIB$SET_STATIC_CALLBACKS(Callback[] var0) {
        CGLIB$STATIC_CALLBACKS = var0;
    }

    private static final void CGLIB$BIND_CALLBACKS(Object var0) {
        UserService$$EnhancerByCGLIB$$7fc9ae62 var1 = (UserService$$EnhancerByCGLIB$$7fc9ae62)var0;
        if (!var1.CGLIB$BOUND) {
            var1.CGLIB$BOUND = true;
            Object var10000 = CGLIB$THREAD_CALLBACKS.get();
            if (var10000 == null) {
                var10000 = CGLIB$STATIC_CALLBACKS;
                if (var10000 == null) {
                    return;
                }
            }

            var1.CGLIB$CALLBACK_0 = (MethodInterceptor)((Callback[])var10000)[0];
        }

    }

    public Object newInstance(Callback[] var1) {
        CGLIB$SET_THREAD_CALLBACKS(var1);
        UserService$$EnhancerByCGLIB$$7fc9ae62 var10000 = new UserService$$EnhancerByCGLIB$$7fc9ae62();
        CGLIB$SET_THREAD_CALLBACKS((Callback[])null);
        return var10000;
    }

    public Object newInstance(Callback var1) {
        CGLIB$SET_THREAD_CALLBACKS(new Callback[]{var1});
        UserService$$EnhancerByCGLIB$$7fc9ae62 var10000 = new UserService$$EnhancerByCGLIB$$7fc9ae62();
        CGLIB$SET_THREAD_CALLBACKS((Callback[])null);
        return var10000;
    }

    public Object newInstance(Class[] var1, Object[] var2, Callback[] var3) {
        CGLIB$SET_THREAD_CALLBACKS(var3);
        UserService$$EnhancerByCGLIB$$7fc9ae62 var10000 = new UserService$$EnhancerByCGLIB$$7fc9ae62;
        switch (var1.length) {
            case 0:
                var10000.<init>();
                CGLIB$SET_THREAD_CALLBACKS((Callback[])null);
                return var10000;
            default:
                throw new IllegalArgumentException("Constructor not found");
        }
    }

    public Callback getCallback(int var1) {
        CGLIB$BIND_CALLBACKS(this);
        MethodInterceptor var10000;
        switch (var1) {
            case 0:
                var10000 = this.CGLIB$CALLBACK_0;
                break;
            default:
                var10000 = null;
        }

        return var10000;
    }

    public void setCallback(int var1, Callback var2) {
        switch (var1) {
            case 0:
                this.CGLIB$CALLBACK_0 = (MethodInterceptor)var2;
            default:
        }
    }

    public Callback[] getCallbacks() {
        CGLIB$BIND_CALLBACKS(this);
        return new Callback[]{this.CGLIB$CALLBACK_0};
    }

    public void setCallbacks(Callback[] var1) {
        this.CGLIB$CALLBACK_0 = (MethodInterceptor)var1[0];
    }

    static {
        CGLIB$STATICHOOK1();
    }
}
```

:::



### methodProxy

> UserService代理对象在 执⾏test()⽅法，那么当执⾏流程进⼊到intercept()⽅法时，MethodProxy对象表示的就是test()⽅法， 但是我们现在知道了在UserService类和UserService代理类中都有test()⽅法，所以MethodProxy对象 代理的就是这两个test()

```java
//  o表示当前代理对象，target表示被代理对象

// 执⾏UserService代理对象的CGLIB$test$0()⽅法，也就是执⾏UserService代理对象的⽗类的test()
Object result = methodProxy.invokeSuper(o, objects);
// 报错 ClassCastException: org.hzz.UserService cannot be cast to org.hzz.UserService$$EnhancerByCGLIB$$7fc9ae62
Object result = methodProxy.invokeSuper(target, objects);
// 执⾏UserService对象的test()
Object result = methodProxy.invoke(target, objects);
// 报错：栈溢出
Object result = methodProxy.invoke(o, objects);
```

所以在执⾏methodProxy.invokeSuper()⽅法时，就会去执⾏CGLIB$test$0()⽅法。 我们来总结⼀下cglib的⼤概⼯作原理是：cglib会根据所设置的Superclass，⽣成代理类作为其⼦类， 并且会重写Superclass中的⽅法，Superclass中的某⼀个⽅法，⽐如test()，相应的在代理类中会对应 两个⽅法，⼀个是重写的test()，⽤来执⾏增强逻辑，⼀个是CGLIB$test$0()，会直接调⽤ super.test()，是让MethodProxy对象来⽤的。
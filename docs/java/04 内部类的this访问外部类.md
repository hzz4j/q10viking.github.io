---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



> 非静态内部类访问外部类的方式，this

```java
public class SessionRepositoryFilter {
    private final class SessionRepositoryRequestWrapper{
        public void getSession(){
            System.out.println("===============SessionRepositoryRequestWrapper run====================================");
            System.out.println(this);
            SessionRepositoryFilter.this.execute();
            System.out.println("===============SessionRepositoryRequestWrapper run====================================");
        }
    }

    public void execute(){
        System.out.println("===============SessionRepositoryFilter run====================================");
        System.out.println(this);
        System.out.println("===============SessionRepositoryFilter run====================================");
    }

    public void doFilterInternal(){
        SessionRepositoryRequestWrapper wrapper = new SessionRepositoryRequestWrapper();
        wrapper.getSession();
    }

    public static void main(String[] args) {
        SessionRepositoryFilter filter = new SessionRepositoryFilter();
        filter.doFilterInternal();

    }
}
/**
 ===============SessionRepositoryRequestWrapper run====================================
 org.hzz.inner.SessionRepositoryFilter$SessionRepositoryRequestWrapper@1b6d3586
 ===============SessionRepositoryFilter run====================================
 org.hzz.inner.SessionRepositoryFilter@4554617c
 ===============SessionRepositoryFilter run====================================
 ===============SessionRepositoryRequestWrapper run====================================
 */
```


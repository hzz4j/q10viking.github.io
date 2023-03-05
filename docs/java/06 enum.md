---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 基本使用

```java
package org.http.enm.value;

import java.util.HashMap;
import java.util.Map;

public enum HttpMethod {

    GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE;


    private static final Map<String, HttpMethod> mappings = new HashMap<>(16);

    static {
        for (HttpMethod httpMethod : values()) {
            mappings.put(httpMethod.name(), httpMethod);
        }
    }


    /**
     * Resolve the given method value to an {@code HttpMethod}.
     * @param method the method value as a String
     * @return the corresponding {@code HttpMethod}, or {@code null} if not found
     * @since 4.2.4
     */

    public static HttpMethod resolve(String method) {
        return (method != null ? mappings.get(method) : null);
    }


    /**
     * Determine whether this {@code HttpMethod} matches the given method value.
     * @param method the HTTP method as a String
     * @return {@code true} if it matches, {@code false} otherwise
     * @since 4.2.4
     */
    public boolean matches(String method) {
        return name().equals(method);
    }

}
```



## 方法

- values
- valueOf

```java
public class Main {
    public static void main(String[] args) {
        HttpMethod post1 = HttpMethod.valueOf("POST");
        HttpMethod post2 = HttpMethod.valueOf("POST");
        System.out.println(post1 == post2); // true
        HttpMethod[] values = HttpMethod.values();
    }
}
```



## 信息的聚合

```java
public interface ICode {
    int getCode();
    String getMessage();
}
```

```java
public enum ResultCode implements ICode{
    SUCCESS(200,"操作成功"),
    FAILED(500,"操作失败");

    private int code;
    private String message;

    private ResultCode(int code ,String message){
        this.code = code;
        this.message = message;
    }
    @Override
    public int getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}

```




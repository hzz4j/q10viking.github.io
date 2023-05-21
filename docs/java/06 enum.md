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



### 父类

```java
public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable {

    // 字面常量
    private final String name;

    public final String name() {
        return name;
    }

    private final int ordinal;
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





## 泛型遍历枚举😘

[Iterate enum values using java generics - Stack Overflow](https://stackoverflow.com/questions/2205891/iterate-enum-values-using-java-generics)

```java
public <T extends Enum<T>> void enumValues(Class<T> enumType) {
        for (T c : enumType.getEnumConstants()) {
             System.out.println(c.name());
        }
}
```

在实现反序列化泛型的时候，我遇到了这个问题,根据上面的方法解决了

[Source Code](https://github.com/Q10Viking/learncode/tree/main/javahelper/fastjson2-demo/src/main/java/org/hzz/enumm)

```java
public interface  Status {
    Integer getCode();
}

public enum HttpStatus implements Status{
    OK(200,"OK"),
    BAD_REQUEST(400,"Bad Request"),
    NOT_FOUND(404,"Not Found");
    private Integer code;
    private String desc;
    private HttpStatus(Integer code, String desc){
        this.code = code;
        this.desc = desc;
    }

    @Override
    public Integer getCode(){
        return this.code;
    }
}
```



```java
import com.alibaba.fastjson2.JSONReader;
import com.alibaba.fastjson2.reader.ObjectReader;

import java.lang.reflect.Type;

public class StatusEnumReader implements ObjectReader {

    /**
     * 读取json中的status字段，转换为枚举类型
     * @param jsonReader
     * @param fieldType 比如：class org.hzz.enumm.HttpStatus
     * @param fieldName 比如：status
     * @param features 一个标识位 6755399441055744
     * @return
     */
    @Override
    public Object readObject(JSONReader jsonReader, Type fieldType, Object fieldName, long features) {
        // 读取json中的status字段，转换为枚举类型
        Integer code = jsonReader.read(Integer.class);
        if(code == null) return null;

        // 从class转变为枚举类型
        if (fieldType instanceof Class && Enum.class.isAssignableFrom((Class<?>) fieldType)) {
            Class<?> clazz = (Class<?>) fieldType;
            Enum<?>[] enums = (Enum<?>[]) clazz.getEnumConstants();
            for (Enum<?> e : enums) {
                if (e instanceof Status && ((Status) e).getCode().equals(code)) {
                    return e;
                }
            }
        }
        return null;
    }
}
```






---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---





## ==



::: tip

==对比的是栈中的值，基本数据类型是变量值，引用类型是堆中内存对象的地址

:::



## equals

equals：object中默认也是采用==比较，通常会重写



Object类

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

String类就重写了

- 如果内存地址相等就返回true
- 否则就比较内容

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```



## 测试

上述代码可以看出，String类中被复写的equals()方法其实是比较两个字符串的内容。

```java
public class StringEqualsDemo {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = new String("Hello");
        String str3 = str2; // 引用传递
        System.out.println(str1 == str2); // false
        System.out.println(str1 == str3); // false
        System.out.println(str2 == str3); // true
        System.out.println(str1.equals(str2)); // true
        System.out.println(str1.equals(str3)); // true
        System.out.println(str2.equals(str3)); // true
    }
}
```


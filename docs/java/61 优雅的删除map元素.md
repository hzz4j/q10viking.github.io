---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 数据准备

```java
public Map<String, String> initMap = new HashMap<String, String>() {{
    put("user1", "刘零");
    put("user2", "郑一");
    put("user3", "吴二");
    put("user4", "张三");
    put("user5", "李四");
    put("user6", "王五");
    put("user7", "钱六");
    put("user8", "孙七");
}};
```

## 使用增强 for 循环删除

```java
/**
     * 使用 for 循环删除
     */
    public void remove1() {
        Set<Map.Entry<String, String>> entries = new CopyOnWriteArraySet<>(initMap.entrySet());
        for (Map.Entry<String, String> entry : entries) {
            if ("王五".equals(entry.getValue())) {
                initMap.remove(entry.getKey());
            }
        }
        System.out.println(initMap);
        // {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user3=吴二, user4=张三}
    }
```

通过HashMap的entrySet方法获取元素集合，然后再进行循环遍历，判断value值是否为需要删除的元素，再移除对应的Key。
需要注意增强的 for 循环底层使用的迭代器 Iterator，而 HashMap 是 fail-fast 原则的错误机制，所以遍历时删除元素会出现 java.util.ConcurrentModificationException 并发修改异常。我们可以使用CopyOnWriteArraySet封装一层避免出现并发修改异常。

- fail-fast:为了将错误或异常情况尽早暴露出来，避免潜在的问题在后续代码中蔓延，提高系统的稳定性和可靠性。

## 使用 forEach 循环删除

```java
/**
     * 使用 forEach 循环删除
     */
    public void remove2() {
        ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>(initMap);
        map.forEach((k, v) -> {
            if ("王五".equals(v)) {
                map.remove(k);
            }
        });
        System.out.println(map);
        System.out.println(initMap);
    }
    /**
     * {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user3=吴二, user4=张三}
     * {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user6=王五, user3=吴二, user4=张三}
     */
```

通过HashMap的forEach方法循环删除目标元素，同样的使用了ConcurrentHashMap封装避免出现并发修改异常。



## 使用 Iterator 迭代器删除

```java
/**
     * 使用 Iterator 迭代器删除
     */
    public void remove3() {
        ConcurrentHashMap<String, String> resultMap = new ConcurrentHashMap<>();
        Iterator<Map.Entry<String, String>> iterator
                = new ConcurrentHashMap<>(initMap).entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            if ("王五".equals(entry.getValue())) {
                iterator.remove();
            }else {
                resultMap.put(entry.getKey(),entry.getValue());
            }
        }
        System.out.println(resultMap);
        System.out.println(initMap);
    }
    /**
     * {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user3=吴二, user4=张三}
     * {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user6=王五, user3=吴二, user4=张三}
     */
```

通过Iterator迭代删除元素不会出现并发修改异常，但由于HashMap是线程不安全的，这时如果多个线程同时修改HashMap数据也会出现并发修改异常 ，日常使用可以先用ConcurrentHashMap封装。

## 使用 removeIf 删除（推荐使用）❤️

```java
/**
     * 使用 removeIf 删除
     */
    public void remove4() {
        initMap.entrySet().removeIf(entry -> "王五".equals(entry.getValue()));
        System.out.println(initMap);
        // {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user3=吴二, user4=张三}
    }
```

通过entrySet获取元素然后使用removeIf方法删除目标数据；而removeIf的底层是通过Iterator迭代器实现的。所以也存在第三种方法同样的问题(并发问题)

```java
default boolean removeIf(Predicate<? super E> filter) {
    Objects.requireNonNull(filter);
    boolean removed = false;
    final Iterator<E> each = iterator();
    while (each.hasNext()) {
        if (filter.test(each.next())) {
            each.remove();
            removed = true;
        }
    }
    return removed;
}
```

## 使用 Stream 删除（推荐使用）❤️

```
/**
     * 使用 Stream 删除
     */
    public void remove5() {
        Map<String, String> map = initMap.entrySet().stream()
                .filter(entry -> !"王五".equals(entry.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        System.out.println(map);
        // {user1=刘零, user2=郑一, user7=钱六, user8=孙七, user5=李四, user3=吴二, user4=张三}
    }
```

通过Stream 的 filter 方法进行过滤，然后生成一个新的map。这种方式“一行代码“就能够实现删除的动作，**并且没有并发问题**。
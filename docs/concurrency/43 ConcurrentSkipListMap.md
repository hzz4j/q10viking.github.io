---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## ConcurrentSkipListMap

支持并发下的key有序性

```java
public class Test {
    public static void main(String[] args) {
        Map<Integer,Integer> m = new ConcurrentSkipListMap<>();

        for (int i=0;i<4;i++){
            int j = ThreadLocalRandom.current().nextInt(10);
            new Thread(()-> m.put(j,j)).start();
        }
        System.out.println(m);
    }
}
/**
 {0=0, 5=5, 9=9}
 */
```

## 跳表工作原理

通过维护索引来空间换取时间

![Skip_list_map](/images/concurrency/Skip_list_map.gif)
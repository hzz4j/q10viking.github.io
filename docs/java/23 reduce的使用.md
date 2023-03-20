---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



```java
<U> U reduce(U identity,
                 BiFunction<U, ? super T, U> accumulator,
                 BinaryOperator<U> combiner);
```

## 基本使用

```java
package org.hzz;

import java.util.Arrays;
import java.util.List;

public class ReduceBasic {
    public static void main(String[] args) {
        String[] strArray = {"abc", "mno", "xyz"};
        List<String> strList = Arrays.asList(strArray);

        System.out.println("stream test");
        int streamResult = strList.stream().reduce(
                0,
                (total,s) -> { System.out.println("accumulator: total[" + total + "] s[" + s + "] s.codePointAt(0)[" + s.codePointAt(0) + "]"); return total + s.codePointAt(0); },
                (a,b) -> { System.out.println("combiner: a[" + a + "] b[" + b + "]"); return 1000000;}
        );
        System.out.println("streamResult: " + streamResult);

        System.out.println("parallelStream test");
        int parallelStreamResult = strList.parallelStream().reduce(
                0,
                (total,s) -> { System.out.println("accumulator: total[" + total + "] s[" + s + "] s.codePointAt(0)[" + s.codePointAt(0) + "]"); return total + s.codePointAt(0); },
                (a,b) -> { System.out.println("combiner: a[" + a + "] b[" + b + "]"); return 1000000;}
        );
        System.out.println("parallelStreamResult: " + parallelStreamResult);

        System.out.println("parallelStream test2");
        int parallelStreamResult2 = strList.parallelStream().reduce(
                0,
                (total,s) -> { System.out.println("accumulator: total[" + total + "] s[" + s + "] s.codePointAt(0)[" + s.codePointAt(0) + "]"); return total + s.codePointAt(0); },
                (a,b) -> { System.out.println("combiner: a[" + a + "] b[" + b + "] a+b[" + (a+b) + "]"); return a+b;}
        );
        System.out.println("parallelStreamResult2: " + parallelStreamResult2);
    }
}
/**
 * stream test
 * accumulator: total[0] s[abc] s.codePointAt(0)[97]
 * accumulator: total[97] s[mno] s.codePointAt(0)[109]
 * accumulator: total[206] s[xyz] s.codePointAt(0)[120]
 * streamResult: 326
 * parallelStream test
 * accumulator: total[0] s[mno] s.codePointAt(0)[109]
 * accumulator: total[0] s[xyz] s.codePointAt(0)[120]
 * combiner: a[109] b[120]
 * accumulator: total[0] s[abc] s.codePointAt(0)[97]
 * combiner: a[97] b[1000000]
 * parallelStreamResult: 1000000
 * parallelStream test2
 * accumulator: total[0] s[mno] s.codePointAt(0)[109]
 * accumulator: total[0] s[xyz] s.codePointAt(0)[120]
 * combiner: a[109] b[120] a+b[229]
 * accumulator: total[0] s[abc] s.codePointAt(0)[97]
 * combiner: a[97] b[229] a+b[326]
 * parallelStreamResult2: 326
 */
```



## 方法的增强

```java
   public void saveAll2(Friend friend) {
       wTransactionTemplate.execute((wstatus) -> {
           rTransactionTemplate.execute((rstatus) -> {
               try {
                   saveW(friend);
                   saveR(friend);
                   //int a = 1 / 0;
               } catch (Exception e) {
                   e.printStackTrace();
                   wstatus.setRollbackOnly();
                   rstatus.setRollbackOnly();
                   return false;
               }
               return true;
           });
           return true;
       });
   }
```

结合callable来增加嵌套的方法，来优化上面不断嵌套的代码结构

```java

public class ReduceTest {
    public static void main(String[] args) throws Exception {
        ReduceTest reduceTest = new ReduceTest();
        reduceTest.inCombinedTx(()-> {
            System.out.println("origin method run...");
            return null;
        }, new String[]{"wTransactionManager", "rTransactionManager"});
    }


    public <V> V m1(Callable<V> callable) throws Exception {
        System.out.println("wTransactionManager");
        return callable.call();
    }
    public <V> V m2(Callable<V> callable) throws Exception {
        System.out.println("rTransactionManager");
        return callable.call();
    }

    public <V> V inCombinedTx(Callable<V> callable, String[] transactions) throws Exception {
        // 相当于循环 [wTransactionManager,wTransactionManager]
        Callable<V> a = Stream.of(transactions)
                .filter(ele -> !StringUtils.isEmpty(ele))
                .distinct()
                .reduce(callable, (r, tx) -> {
                    switch (tx) {
                        case "wTransactionManager":
                            return () -> m1(r);
                        case "rTransactionManager":
                            return () -> m2(r);
                        default:
                            return r;
                    }
                },(r1,r2)->null); // 为了参数推断
        return a.call();
    }
}
/**
 * rTransactionManager
 * wTransactionManager
 * origin method run...
 */
```


---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## Exchange简介

当一个线程运行到exchange()方法时会阻塞，另一个线程运行到exchange()时，二者交换数据，然后执行后面的程序。

## 使用

可以看到创建的线程只有5个，最后的线程没有得到交换，一直阻塞中

```java
public class ExchangerRunner {
    public static void main(String []args) {
        final Exchanger<Integer> exchanger = new Exchanger<Integer>();
        for(int i = 0 ; i < 5 ; i++) {
            final Integer num = i;
            new Thread() {
                public void run() {
                    System.out.println("我是线程：Thread_" + this.getName() + "我的数据是：" + num);
                    try {
                        Integer exchangeNum = exchanger.exchange(num);
                        Thread.sleep(1000);
                        System.out.println("我是线程：Thread_" + this.getName() + "我原先的数据为：" + num + " , 交换后的数据为：" + exchangeNum);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }.start();
        }
    }
}
/**
 我是线程：Thread_Thread-1我的数据是：1
 我是线程：Thread_Thread-4我的数据是：4
 我是线程：Thread_Thread-3我的数据是：3
 我是线程：Thread_Thread-2我的数据是：2
 我是线程：Thread_Thread-0我的数据是：0
 我是线程：Thread_Thread-4我原先的数据为：4 , 交换后的数据为：1
 我是线程：Thread_Thread-2我原先的数据为：2 , 交换后的数据为：3
 我是线程：Thread_Thread-3我原先的数据为：3 , 交换后的数据为：2
 我是线程：Thread_Thread-1我原先的数据为：1 , 交换后的数据为：4
 */
```


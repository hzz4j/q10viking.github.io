---
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---





## 部署多台机器的并发问题

::: tip

分布式架构的部署，JVM的并发锁保证不了并发的问题

[Source Code](https://github.com/Q10Viking/learncode/tree/main/redis/_05_springboot_redis_lock)

:::



## Nginx的配置

```sh
	upstream redislock{
		server localhost:8080 weight=1;
		server localhost:8081 weight=1;
	}

    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
			proxy_pass http://redislock;
        }
```



## 部署

https://www.processon.com/view/link/62f24f5fe401fd2fc7cbe5f5

![image-20220809201246047](/images/lock/image-20220809201246047.png)

```java
@GetMapping("deduck_stock")
    public String deduckStock(){
        // 在redis中它的库存设置为300
        final String key = "stock:product:1";
        synchronized (lock){
            int stock = Integer.parseInt(stringRedisTemplate.opsForValue().get(key));
            if(stock>0){
                int realStock = stock - 1;
                stringRedisTemplate.opsForValue().set(key,String.valueOf(realStock));
                logger.info("扣减库存成功,剩余："+realStock);
            }else{
                logger.info("扣减库存失败");
            }
        }
        return "Finished";
    }
```



## JMeter压测复现并发bug

::: tip

[Apache JMeter - Download Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi)

下载至本地后，解压压缩包，点击进入bin文件夹，双击jmeter.bat文件

选择Options --> Choose Language --> Chinese(Simplified)，设置语言为中文简体

[SkyRain的博客-CSDN博客_jmeter下载](https://blog.csdn.net/tianqingmuyu/article/details/108401543)

:::

![image-20220809201811036](/images/lock/image-20220809201811036.png)

![image-20220809201957411](/images/lock/image-20220809201957411.png)



## 观察结果

发下应用app，库存扣减重复。

app1:8080

```sh
2022-08-09 20:15:10.344  INFO 1408 --- [nio-8080-exec-2] org.hzz.controller.StockController       : 扣减库存成功,剩余：299
2022-08-09 20:15:10.369  INFO 1408 --- [io-8080-exec-18] org.hzz.controller.StockController       : 扣减库存成功,剩余：298
2022-08-09 20:15:10.380  INFO 1408 --- [io-8080-exec-21] org.hzz.controller.StockController       : 扣减库存成功,剩余：297
2022-08-09 20:15:10.395  INFO 1408 --- [io-8080-exec-26] org.hzz.controller.StockController       : 扣减库存成功,剩余：296
2022-08-09 20:15:10.406  INFO 1408 --- [io-8080-exec-22] org.hzz.controller.StockController       : 扣减库存成功,剩余：294
2022-08-09 20:15:10.414  INFO 1408 --- [io-8080-exec-19] org.hzz.controller.StockController       : 扣减库存成功,剩余：293
2022-08-09 20:15:10.423  INFO 1408 --- [io-8080-exec-20] org.hzz.controller.StockController       : 扣减库存成功,剩余：292
2022-08-09 20:15:10.433  INFO 1408 --- [io-8080-exec-17] org.hzz.controller.StockController       : 扣减库存成功,剩余：291
2022-08-09 20:15:10.441  INFO 1408 --- [io-8080-exec-11] org.hzz.controller.StockController       : 扣减库存成功,剩余：290
2022-08-09 20:15:10.449  INFO 1408 --- [io-8080-exec-12] org.hzz.controller.StockController       : 扣减库存成功,剩余：289
```

app2:8081

```sh
2022-08-09 20:15:10.350  INFO 21568 --- [nio-8081-exec-8] org.hzz.controller.StockController       : 扣减库存成功,剩余：299
2022-08-09 20:15:10.362  INFO 21568 --- [io-8081-exec-20] org.hzz.controller.StockController       : 扣减库存成功,剩余：298
2022-08-09 20:15:10.381  INFO 21568 --- [io-8081-exec-24] org.hzz.controller.StockController       : 扣减库存成功,剩余：297
2022-08-09 20:15:10.390  INFO 21568 --- [io-8081-exec-19] org.hzz.controller.StockController       : 扣减库存成功,剩余：296
2022-08-09 20:15:10.400  INFO 21568 --- [io-8081-exec-21] org.hzz.controller.StockController       : 扣减库存成功,剩余：295
2022-08-09 20:15:10.411  INFO 21568 --- [io-8081-exec-22] org.hzz.controller.StockController       : 扣减库存成功,剩余：294
2022-08-09 20:15:10.419  INFO 21568 --- [io-8081-exec-18] org.hzz.controller.StockController       : 扣减库存成功,剩余：292
2022-08-09 20:15:10.436  INFO 21568 --- [io-8081-exec-23] org.hzz.controller.StockController       : 扣减库存成功,剩余：291
2022-08-09 20:15:10.446  INFO 21568 --- [io-8081-exec-14] org.hzz.controller.StockController       : 扣减库存成功,剩余：289
```


---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## MySQL实现分布式锁

> 可以利用数据库的唯一索引来实现，唯一索引天然具有排他性

```sql
CREATE TABLE `t_methodlock`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `method_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '锁定的方法名',
  `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '保存数据时间，自动生成',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uidx_method_name`(`method_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '锁定中的方法' ROW_FORMAT = Dynamic;

```

![img](/images/lock/46070)

## 实现

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/lock)

> 核心逻辑

```java
public abstract class AbstractLock implements Lock{

    /**
     * 加锁，增加重试逻辑
     */
    @Override
    public void lock() {
        //尝试获取锁
        if(tryLock()){
            System.out.println("---------获取锁---------");
        }else {
            //等待锁 阻塞
            waitLock();
            //重试
            lock();
        }
    }


    //尝试获取锁
    public abstract boolean tryLock() ;

    //等待锁
    public abstract void waitLock() ;
}
```

> 实现

```java
@Component
@Slf4j
public class MysqlDistributedLock extends AbstractLock{

    @Autowired
    private MethodlockMapper methodlockMapper;

    @Override
    public void unLock() {
        methodlockMapper.deleteByMethodlock("lock");
    }

    @Override
    public boolean tryLock() {
        try{
            methodlockMapper.insertSelective(new Methodlock("lock"));
        }catch(Exception e){
            log.info("获取锁失败");
            return false;
        }
        return true;
    }

    @Override
    public void waitLock() {
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
}
```



## 测试

```java
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
public class LockApplicationTests {

	@Autowired
	private MysqlDistributedLock lock;

	@Autowired
	private OrderCodeGenerator orderCodeGenerator;

	private static volatile List<String> threadList = new ArrayList<>();
	private static int count = 5;

	@Test
	public void contextLoads() throws InterruptedException {
		log.info("Hello World");
		CountDownLatch countDownLatch = new CountDownLatch(count);
		for (int i = 0; i < count; i++) {
			new Thread(()->{
				try {
					countDownLatch.await();
					getOrderCode();
				} catch (InterruptedException e) {
				}
			}).start();
			countDownLatch.countDown();
		}

		while(threadList.size()<count){}
		threadList.forEach(System.out::println);
	
	}

	public void getOrderCode(){
		lock.lock();
		String genCode = orderCodeGenerator.genCode();
		log.info(Thread.currentThread().getName()+": "+genCode);
		threadList.add(Thread.currentThread().getName());
		lock.unLock();
	}

}

```

![image-20230322230409039](/images/lock/image-20230322230409039.png)


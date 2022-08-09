---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Redis/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code JedisClusterApp.java](https://github.com/Q10Viking/learncode/blob/main/redis/_01_java_redis/src/main/java/org/hzz/JedisClusterApp.java)

:::



```java
/**
 * 访问redis集群
 */
public class JedisClusterApp {
    public static void main(String[] args) throws IOException {
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(20);
        config.setMaxIdle(10);
        config.setMinIdle(5);

        Set<HostAndPort> jedisClusterNode = new HashSet<HostAndPort>();
        jedisClusterNode.add(new HostAndPort("192.168.187.135", 8001));
        jedisClusterNode.add(new HostAndPort("192.168.187.135", 8004));
        jedisClusterNode.add(new HostAndPort("192.168.187.130", 8002));
        jedisClusterNode.add(new HostAndPort("192.168.187.130", 8005));
        jedisClusterNode.add(new HostAndPort("192.168.187.132", 8003));
        jedisClusterNode.add(new HostAndPort("192.168.187.132", 8006));

        JedisCluster jedisCluster = null;
        try {
            //connectionTimeout：指的是连接一个url的连接等待时间
            //soTimeout：指的是连接上一个url，获取response的返回等待时间
            jedisCluster = new JedisCluster(jedisClusterNode, 6000, 5000, 10, "Root.123456", config);
            System.out.println(jedisCluster.set("test:hzz", "hello Redis Cluster"));
            System.out.println(jedisCluster.get("test:hzz"));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (jedisCluster != null)
                jedisCluster.close();
        }
    }
}
/**
 * OK
 * hello Redis Cluster
 */

```

![image-20220809164317767](/images/Redis/image-20220809164317767.png)
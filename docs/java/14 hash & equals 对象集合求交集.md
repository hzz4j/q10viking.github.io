---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---




> 在看nacos服务注册时，求服务实例集合的交集
>
> equals相等，则hashCode一定相等；
>
> hashCode相等，则equals不一定相等（哈希冲突）

## 重写hashcode与equals方法

```java
public class Instance {
    private String ip;
    private boolean ephemeral;

    public Instance(String ip, boolean ephemeral) {
        this.ip = ip;
        this.ephemeral = ephemeral;
    }

    public String getIp() {
        return ip;
    }

    public boolean isEphemeral() {
        return ephemeral;
    }

    @Override
    public int hashCode() {
        return this.ip.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (null == obj || obj.getClass() != getClass()) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        Instance other = (Instance) obj;
        
        return getIp().equals(other.getIp()) && this.isEphemeral() == other.isEphemeral();
    }

    @Override
    public String toString() {
        return ip + "##" + ephemeral;
    }
}
```





## 测试



```java
public class MainTest {
    public static void main(String[] args) {
        List<Instance> newInstance = Arrays.asList(
                new Instance("192.168.187.135",true),
                new Instance("192.168.187.136",true)
        );

        List<Instance> oldInstance = Arrays.asList(
                new Instance("192.168.187.135",false),
                new Instance("192.168.187.136",true)
        );

        Collection intersection = CollectionUtils.intersection(newInstance, oldInstance);
        System.out.println(intersection);
    }
}
/**
 * [192.168.187.136##true]
 */
```


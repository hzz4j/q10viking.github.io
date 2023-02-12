---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---



## 电脑设备

[惠普暗影精灵 Ⅳ 代游戏本 15-dc0008tx 软件和驱动下载 | 惠普®客户支持 (hp.com)](https://support.hp.com/cn-zh/drivers/selfservice/omen-by-hp-15-dc0000-laptop-pc-series/20329817/model/22297550?sku=4LE28PA&serialnumber=5CD8463TW1)

![image-20230211235550899](/images/win11/image-20230211235550899.png)

## 问题描述



> 驱动显示感叹号

![image-20230211194934858](/images/win11/image-20230211194934858.png)

> 无Wifi选项

![image-20230211195331418](/images/win11/image-20230211195331418.png)

> 网络连接适配器只有一个有线的适配器

![image-20230211195436295](/images/win11/image-20230211195436295.png)

> 驱动精灵检测

![image-20230211204923176](/images/win11/image-20230211204923176.png)

> 问题描述

英特尔无线驱动程序22.100.0.3

WLAN 2 适配器的驱动程序可能出现问题

Windows 无法自动将 IP 协议堆栈绑定到网络适配器

>  Intel® Wireless-AC 9560 160MHz



## 解决方式



## 下载

使用[英特尔® 驱动程序和支持助理 (intel.cn)](https://www.intel.cn/content/www/cn/zh/support/detect.html)安装最新的驱动

![image-20230212144449563](/images/win11/image-20230212144449563.png)



![image-20230212151224123](/images/win11/image-20230212151224123.png)

### 重点❤

服务的设置，设置为自动❤（ `Intel® PROSet/Wireless WiFi Service`,`Wired AutoConfig`,`WLAN AutoConfig`）❤

![image-20230212145039471](/images/win11/image-20230212145039471.png)

其中windows移动热点服务，是电脑端开wifi给其他设备，比如手机连接的，这个可以不管

![image-20230212145751191](/images/win11/image-20230212145751191.png)



当以上步骤做完之后，

1. 进入设备管理器，将`Inter(R) Wireless-AC 9560 160MHZ`卸载，不勾选删除。
2. 关机（不要重新启动）
3. 拔出所有外设，包括电源，鼠标，网线之类
4. 重新开机

修复成功。





其他的尝试

win+X



```
设备 PCI\VEN_8086&DEV_A370&SUBSYS_00348086&REV_10\3&11583659&0&A3 需要进一步安装。
sfc /scannow
netsh winsock reset
```



## 效果

展示页面

![image-20230212144305695](/images/win11/image-20230212144305695.png)



> 设备管理

![image-20230212144420129](/images/win11/image-20230212144420129.png)

> 网络连接

![image-20230212144623643](/images/win11/image-20230212144623643.png)

网络适配器的配置

![image-20230212150740701](/images/win11/image-20230212150740701.png)

> 设置

![image-20230212150901666](/images/win11/image-20230212150901666.png)

![image-20230212151113899](/images/win11/image-20230212151113899.png)



## 复盘

在设备选择驱动的时候，一定要选择最新的驱动，也就是从Inter官网下载的驱动，目前版本是`22.190.0.4`

![image-20230212151224123](/images/win11/image-20230212151224123.png)

因为在电脑上可能会搜索到很多可安装的驱动，一个一个试，直到安装的版本是最新的为止，上面操作的步骤是直接卸载，重启之后，系统会自动搜索驱动然后选择最新的版本。所以不用操作。

![image-20230212153453443](/images/win11/image-20230212153453443.png)

> 最新的驱动

![image-20230212153331092](/images/win11/image-20230212153331092.png)

>  其他三个驱动



![image-20230212152932588](/images/win11/image-20230212152932588.png)



![image-20230212153100707](/images/win11/image-20230212153100707.png)

![image-20230212153206978](/images/win11/image-20230212153206978.png)

### 服务要开

> Intel® PROSet/Wireless Service 使用自动方式



## 参考链接

[下载适用于 英特尔® Wireless Bluetooth® 的软件和驱动程序 (intel.cn)](https://www.intel.cn/content/www/cn/zh/support/articles/000005489/wireless.html)

[英特尔® 驱动程序和支持助理 (intel.cn)](https://www.intel.cn/content/www/cn/zh/support/detect.html)


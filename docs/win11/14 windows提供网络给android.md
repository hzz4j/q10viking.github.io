---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /win11/
typora-root-url: ..\.vuepress\public
---



## windows提供网络给安卓

1. 下载这个软件[GitHub - Genymobile/gnirehtet: Gnirehtet provides reverse tethering for Android](https://github.com/Genymobile/gnirehtet)进行解压

2. 下载https://dl.google.com/android/repository/platform-tools-latest-windows.zip 进行解压，解压后全部复制到gnirehtet解压的目录

![image-20240401022100443](/images/win11/image-20240401022100443.png)

## 安卓成功联网

经测试使用虎牙的2k HDR都没有问题。

![image-20240401022342171](/images/win11/image-20240401022342171.png)



## wireshark进行抓包PC虎牙直播端

1. 使用wireshark进行抓包虎牙直播，获取推流,首先需要开启直播，用wireshark获取到推流地址。

![image-20240401132947134](/images/win11/image-20240401132947134.png)

```
rtmp://111.23.9.58/tx.direct.huya.com/huyalive
2306934046-2306934046-9908206281598959616-4613991548-10057-A-0-1?streamcode=eJxdUMluq0AA%2BxsuEdKwM4ccBphszUyAJhB6qSihLEOAsBSYr39R3zv01QfLtiwfXBVfaXFbA2F8sqwAHSoqUHUh%2Bd%2F2v3zcts9AAkAzhH7o0vhex%2Ff0R0P8ISEEpgx02ZQ0aEIN6pIuqrqkQChpqil%2Br4hIBKIkDEXC0mGtes4nQthBT%2Byy0Co89BenPt8eihPyPETPaKK5hyJ%2ByEm4n6OScXrHMjknE3WskpwRRs5lIk5cILT3Q9xYNK9WwWrevmoTB3O93KjzgsvhwMd%2B6D2n%2FOqOdb%2FPDSWeu4tbcbYvg5jdP94qY3i5Bl3LlA14HPvcAQbheLQaDtmWWbtUwvN2jG%2FLMgfH81HZ%2BO0htTeukQ%2B1HMHpdTVaVB5t3c9IkDXWaVL6mbr5J4%2FswF%2BCufcIpqn%2FqElgXk%2FEeoPcHd3MD3aV8Vgxeg0jwi6VbWlh1zSJYSf4atAw%2B35lLeTjEr%2F%2FO08SPgo%2BLG26Bn8AIbuVRg%3D%3D&huya_ticket=1&anchor_rank=0&appid=66&muid=4613881655&room=2306934046&seq=1711948707002&streamseq=1711948707002&uacode=H4sIAAAAAAAAAytIjk%2BtSI0vSc0tyEksSVUzNTQytjAwUstPS8tMzkzMAQBkvRMgIAAAAA%3D%3D&&gameid=2771&liveid=7352763700591466466&codec=264
```

2. 获取到推流地址之后,我们需要退出这个应用，保持开播的状态，但是退出这个pc上的虎牙直播就需要停播，停播了就不能再使用obs进行推流，所以我只能使用第三方推流。

![image-20240401213419669](/images/win11/image-20240401213419669.png)

虎牙直播客户端抓包，然后使用开启第三方的直播推流，这个推流码是可以用的。

![image-20240401141917041](/images/win11/image-20240401141917041.png)

测试效果，正常开播，推流成功了。

![image-20240401213914012](/images/win11/image-20240401213914012.png)

### 小结

1. 电脑PC端开播，首先使用wireshark抓取到推流码。得到推流码之后，使用第三方开发，这个推流码可以继续使用。但是多此一举，因为虎牙PC端本身就提供了推流码不用我们再次抓包获取。
   1. 经过测试，这个推流码不用每次都获取，可以直接使用。
2. 我们抓包的推流码不能用于手机端和网页端的开播。
   1. 网页端有现成的推流码
   2. 手机端我需要额外抓包，分析出推流地址。

### wireshark抓包虎牙手机端

找到了手机端连接windows的wifi，通过ip我找到了对应的网卡接口，但是经过分析找不到rtmp的包。尝试了一下不知道是不是rtmp默认端口改了还是怎么回事，wireshark找到解析不了rtmpt包，我使用decode as也不行，解析出来时unknown(0x0).

![image-20240401144440581](/images/win11/image-20240401144440581.png)

![image-20240401144545931](/images/win11/image-20240401144545931.png)

### fiddle抓包虎牙手机端






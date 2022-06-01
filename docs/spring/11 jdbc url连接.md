## JDBC serverTimezone选择

在mysql文档中可用的时区都在/usr/share/zoneinfo目录下，

```sh
ls /usr/share/zoneinfo/

[root@localhost zoneinfo]# ls /usr/share/zoneinfo/
Africa      Atlantic   Chile    Eire     GB       GMT+0      Indian       Japan        Mexico   NZ-CHAT   posixrules  ROK        Universal  zone1970.tab
America     Australia  CST6CDT  EST      GB-Eire  Greenwich  Iran         Kwajalein    MST      Pacific   PRC         Singapore  US         zone.tab
Antarctica  Brazil     Cuba     EST5EDT  GMT      Hongkong   iso3166.tab  leapseconds  MST7MDT  Poland    PST8PDT     Turkey     UTC        Zulu
Arctic      Canada     EET      Etc      GMT0     HST        Israel       Libya        Navajo   Portugal  right       tzdata.zi  WET
Asia        CET        Egypt    Europe   GMT-0    Iceland    Jamaica      MET          NZ       posix     ROC         UCT        W-SU
```

选择一个Hongkong

```
jdbc:mysql://192.168.187.135:3306/test?characterEncoding=utf-8&useSSL=false&serverTimezone=Hongkong
```


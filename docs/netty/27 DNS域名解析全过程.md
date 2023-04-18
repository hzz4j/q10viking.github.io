---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /netty/
typora-root-url: ..\.vuepress\public
---



> 相当于 “浏览器中输入URL到返回页面的全过程”

1. 根据域名，进行DNS域名解析；
2. 拿到解析的IP地址，建立TCP连接；
3. 向IP地址，发送HTTP请求；
4. 服务器处理请求；
5. 返回响应结果；
6. 关闭TCP连接；
7. 浏览器解析HTML；
8. 浏览器布局渲染；

DNS一个由分层的服务系统，大致说来，有3种类型的 DNS服务器:根 DNS服务器、顶级域(Top-Level Domain，TLD） DNS服务器和权威DNS服务器

- 根 DNS服务器。截止到2022年4月22日，有1533个根名字服务器遍及全世界，可到https://root-servers.org/查询分布情况，根名字服务器提供 TLD服务器的IP地址。

- 顶级域（DNS）服务器。对于每个顶级域（如com、org、net、edu和 gov）和所有国家的顶级域（如uk、fr、ca和jp），都有TLD服务器（或服务器集群）。TLD服务器提供了权威DNS服务器的IP地址。

- 权威DNS服务器。在因特网上的每个组织机构必须提供公共可访问的 DNS记录，这些记录将这些主机的名字映射为IP地址。一个组织机构的权威DNS服务器收藏了这些DNS记录。一个组织机构能够选择实现它自己的权威 DNS服务器以保存这些记录；也可以交由商用DNS服务商存储在这个服务提供商的一个权威DNS 服务器中，比如阿里云旗下的中国万网。

- 有另一类重要的DNS服务器，称为本地DNS 服务器（ local DNS server）。严格说来，一个本地DNS服务器并不属于该服务器的层次结构，但它对 DNS层次结构是至关重要的。每个ISP都有一台本地DNS服务器。同时很多路由器中也会附带DNS服务。

当主机发出DNS请求时,该请求被发往本地DNS服务器，它起着代理的作用，并将该请求转发到DNS服务器层次结构中，同时本地DNS服务器也会缓存DNS记录。

所以一个 DNS客户要决定主机名www.baidu.com 的IP地址。粗略说来，将发生下列事件。客户首先与根服务器之一联系，它将返回顶级域名com的 TLD服务器的IP地址。该客户则与这些TLD服务器之一联系，它将为baidu.com返回权威服务器的IP地址。最后，该客户与baidu.com权威服务器之一联系，它为主机名www.baidu.com返回其IP地址
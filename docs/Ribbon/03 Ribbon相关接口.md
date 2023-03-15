---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /Ribbon/
typora-root-url: ..\.vuepress\public
---



参考： **org.springframework.cloud.netflix.ribbon.RibbonClientConfiguration**

**IClientConfig**：Ribbon的客户端配置，默认采用**DefaultClientConfigImpl**实现。

**IRule**：Ribbon的负载均衡策略，默认采用**ZoneAvoidanceRule**实现，该策略能够在多区域环境下选出最佳区域的实例进行访问。

**IPing**：Ribbon的实例检查策略，默认采用**DummyPing**实现，该检查策略是一个特殊的实现，实际上它并不会检查实例是否可用，而是始终返回true，默认认为所有服务实例都是可用的。

**ServerList**：服务实例清单的维护机制，默认采用**ConfigurationBasedServerList**实现。

**ServerListFilter**：服务实例清单过滤机制，默认采**ZonePreferenceServerListFilter**，该策略能够优先过滤出与请求方处于同区域的服务实例。   

**ILoadBalancer**：负载均衡器，默认采用**ZoneAwareLoadBalancer**实现，它具备了区域感知的能力。


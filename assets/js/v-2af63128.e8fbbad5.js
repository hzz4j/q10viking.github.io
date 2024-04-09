"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[28365],{87954:(a,n,s)=>{s.r(n),s.d(n,{data:()=>e});const e={key:"v-2af63128",path:"/seata/05%20seata%20AT%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/seata/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Feign调用异常，调用层如何接收下层的抛出的异常信息？",slug:"feign调用异常-调用层如何接收下层的抛出的异常信息",children:[]},{level:2,title:"Netty seata中的通信",slug:"netty-seata中的通信",children:[]},{level:2,title:"前置镜像后置镜像的生成",slug:"前置镜像后置镜像的生成",children:[]},{level:2,title:"事务管理者TM创建全局事务",slug:"事务管理者tm创建全局事务",children:[]},{level:2,title:"OrderService RM注册分支事务",slug:"orderservice-rm注册分支事务",children:[{level:3,title:"获取连接断点位置",slug:"获取连接断点位置",children:[]}]},{level:2,title:"回到Seata",slug:"回到seata",children:[]}],filePathRelative:"seata/05 seata AT源码分析.md"}},24188:(a,n,s)=>{s.r(n),s.d(n,{default:()=>p});const e=(0,s(20641).Fv)('<p>@GlobalTransaction依赖本地事务</p><p>TM: 如何获取全局事务ID</p><p>xid需要传递 SeataFeignClient</p><h2 id="feign调用异常-调用层如何接收下层的抛出的异常信息" tabindex="-1"><a class="header-anchor" href="#feign调用异常-调用层如何接收下层的抛出的异常信息" aria-hidden="true">#</a> Feign调用异常，调用层如何接收下层的抛出的异常信息？</h2><h2 id="netty-seata中的通信" tabindex="-1"><a class="header-anchor" href="#netty-seata中的通信" aria-hidden="true">#</a> Netty seata中的通信</h2><h2 id="前置镜像后置镜像的生成" tabindex="-1"><a class="header-anchor" href="#前置镜像后置镜像的生成" aria-hidden="true">#</a> 前置镜像后置镜像的生成</h2><p>seata是读未提交</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>io.seata.config.ConfigurationProvider\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="事务管理者tm创建全局事务" tabindex="-1"><a class="header-anchor" href="#事务管理者tm创建全局事务" aria-hidden="true">#</a> 事务管理者TM创建全局事务</h2><p>db存储模式下建立的session就是往数据库中插入一条数据</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">insert</span> <span class="token keyword">into</span> global_table<span class="token punctuation">(</span>xid<span class="token punctuation">,</span> transaction_id<span class="token punctuation">,</span> <span class="token keyword">status</span><span class="token punctuation">,</span> application_id<span class="token punctuation">,</span> transaction_service_group<span class="token punctuation">,</span> transaction_name<span class="token punctuation">,</span> timeout<span class="token punctuation">,</span> begin_time<span class="token punctuation">,</span> application_data<span class="token punctuation">,</span> gmt_create<span class="token punctuation">,</span> gmt_modified<span class="token punctuation">)</span> <span class="token keyword">values</span> <span class="token punctuation">(</span>?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> ?<span class="token punctuation">,</span> <span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><img src="/images/seata/image-20220609083842913.png" alt="image-20220609083842913"></p><h2 id="orderservice-rm注册分支事务" tabindex="-1"><a class="header-anchor" href="#orderservice-rm注册分支事务" aria-hidden="true">#</a> OrderService RM注册分支事务</h2><h3 id="获取连接断点位置" tabindex="-1"><a class="header-anchor" href="#获取连接断点位置" aria-hidden="true">#</a> 获取连接断点位置</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token class-name"><span class="token namespace">io<span class="token punctuation">.</span>seata<span class="token punctuation">.</span>rm<span class="token punctuation">.</span>datasource<span class="token punctuation">.</span></span>DataSourceProxy</span>#<span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>现在目标找ConnectionProxy如何被创建</p><p>mapper执行，会最终执行到MapperProxy,然后进入到mybatis的执行逻辑</p><p>Mybatis与Spring结合时，有这么一个类SqlSessionTemplate 内部类SqlSessionInterceptor</p><p>SpringManagedTransaction从这个事务管理器获取链接</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">new</span> <span class="token class-name">ConnectionProxy</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> targetConnection<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="回到seata" tabindex="-1"><a class="header-anchor" href="#回到seata" aria-hidden="true">#</a> 回到Seata</h2><p>DataSourceProxy ConnectionProxy PreparedStatementProxy</p><p>PreparedStatementProxy.execute</p>',23),t={},p=(0,s(66262).A)(t,[["render",function(a,n){return e}]])},66262:(a,n)=>{n.A=(a,n)=>{const s=a.__vccOpts||a;for(const[a,e]of n)s[a]=e;return s}}}]);
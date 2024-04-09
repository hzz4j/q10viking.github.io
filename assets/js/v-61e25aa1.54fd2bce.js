"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[15602],{47542:(t,s,r)=>{r.r(s),r.d(s,{data:()=>e});const e={key:"v-61e25aa1",path:"/Redis/53%20Redis%E9%9B%86%E7%BE%A4%E7%9A%84%E5%8E%9F%E7%90%86.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Redis/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[],filePathRelative:"Redis/53 Redis集群的原理.md"}},94827:(t,s,r)=>{r.r(s),r.d(s,{default:()=>o});const e=(0,r(20641).Fv)("<p>Redis 集群通过数据分片和主从复制实现了横向扩展和高可用性。它将数据划分为 <strong>16384 个哈希槽</strong>，并将这些槽均匀地分配到多个节点上。<strong>每个节点</strong>负责<strong>处理一部分槽的数据</strong>，实现了数据的分散存储和负载均衡。</p><p>在集群中，每个哈希槽有一个主节点和多个从节点。<strong>主节点负责处理读写请求</strong>，而从节点则通过主从复制机制复制主节点的数据，<strong>提供数据的冗余备份和故障恢复功能</strong>。</p><p>当主节点发生故障时，集群会<strong>自动进行故障转移</strong>。它会选举一个从节点升级为新的主节点，保证服务的持续可用性。同时，集群管理节点负责监控节点的状态，并协调故障转移过程。</p><p>客户端在与 Redis 集群交互时，根据键的哈希值将请求发送到相应的节点。客户端还可以通过集群管理节点获取整个集群的拓扑信息，了解哪些键存储在哪个节点上。</p><p>通过<strong>数据分片</strong>和<strong>主从复制</strong>，Redis 集群实现了数据水平切分、负载均衡和高可用性。它允许数据规模和吞吐量的线性扩展，<strong>并能自动处理节点故障</strong>。集群管理节点协调集群状态，<strong>客户端通过哈希槽映射与集群交互</strong>，从而实现了一个稳定和可靠的 Redis 分布式系统。</p>",5),n={},o=(0,r(66262).A)(n,[["render",function(t,s){return e}]])},66262:(t,s)=>{s.A=(t,s)=>{const r=t.__vccOpts||t;for(const[t,e]of s)r[t]=e;return r}}}]);
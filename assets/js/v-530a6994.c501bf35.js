"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[30133],{90346:(t,l,e)=>{e.r(l),e.d(l,{data:()=>r});const r={key:"v-530a6994",path:"/rabbitmq/21%20RabbitMQ%E9%9B%86%E7%BE%A4.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/rabbitmq/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[],filePathRelative:"rabbitmq/21 RabbitMQ集群.md"}},12777:(t,l,e)=>{e.r(l),e.d(l,{default:()=>s});var r=e(20641);const a=(0,r.Lk)("p",null,"RabbitMQ 支持两种主要类型的集群：普通集群（Classic Cluster）和镜像集群（Mirrored Cluster）。他们之间有一些重要的区别：",-1),n=(0,r.Lk)("ul",null,[(0,r.Lk)("li",null,[(0,r.Lk)("strong",null,"普通集群"),(0,r.eW)("： 这种模式使用Erlang语言天生具备的集群方式搭建。这种集群模式下，集群的各个节点之间只会有相同的元数据，即队列结构，而消息不会进行冗余，只存在一个节点中。消费时，如果消费的不是存有数据的节点， RabbitMQ会临时在节点之间进行数据传输，将消息从存有数据的节点传输到消费的节点。很显然，这种集群模式的消息可靠性不是很高。因为如果其中有个节点服务宕机了，那这个节点上的数据就无法消费了，需要等到这个节点服务恢复后才能消费，而这时，消费者端已经消费过的消息就有可能给不了服务端正确应答，服务起来后，就会再次消费这些消息，造成这部分消息重复消费。 另外，如果消息没有做持久化，重启就消息就会丢失。并且，这种集群模式也不支持高可用，即当某一个节点服务挂了后，需要手动重启服务，才能保证这一部分消息能正常消费。所以这种集群模式只适合一些对消息安全性不是很高的场景。而在使用这种模式时，消费者应该尽量的连接上每一个节点，减少消息在集群中的传输。")]),(0,r.Lk)("li",null,[(0,r.Lk)("strong",null,"镜像集群"),(0,r.eW)("：这种模式是在普通集群模式基础上的一种增强方案，这也就是RabbitMQ的官方HA高可用方案。需要在搭建了普通集群之后再补充搭建。其本质区别在于，"),(0,r.Lk)("strong",null,"这种模式会在镜像节点中间主动进行消息同步，而不是在客户端拉取消息时临时同步"),(0,r.eW)("。并且在集群"),(0,r.Lk)("strong",null,"内部有一个算法会选举产生master和slave，当一个master挂了后，也会自动选出一个来"),(0,r.eW)("。从而给整个集群提供高可用能力。这种模式的消息可靠性更高，因为每个节点上都存着全量的消息。而他的弊端也是明显的，集群内部的网络带宽会被这种同步通讯大量的消耗，进而降低整个集群的性能。这种模式下，队列数量最好不要过多")])],-1),i=(0,r.Lk)("p",null,"总的来说，普通集群适用于对性能要求高，但可以接受数据丢失的情况。而镜像集群则适用于对数据持久性和可用性有更高要求，并愿意付出一些性能代价的场景。",-1),u={},s=(0,e(66262).A)(u,[["render",function(t,l){return(0,r.uX)(),(0,r.CE)(r.FK,null,[a,n,i],64)}]])},66262:(t,l)=>{l.A=(t,l)=>{const e=t.__vccOpts||t;for(const[t,r]of l)e[t]=r;return e}}}]);
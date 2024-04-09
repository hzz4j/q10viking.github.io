"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[82787],{3033:(s,e,a)=>{a.r(e),a.d(e,{data:()=>n});const n={key:"v-87399d76",path:"/Redis/33%20Redis%E9%9B%86%E7%BE%A4%E9%80%89%E4%B8%BE%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Redis/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Redis集群选举原理",slug:"redis集群选举原理",children:[]},{level:2,title:"集群脑裂数据丢失问题",slug:"集群脑裂数据丢失问题",children:[]},{level:2,title:"集群是否完整才能对外提供服务",slug:"集群是否完整才能对外提供服务",children:[]},{level:2,title:"Redis集群为什么至少需要三个master节点，并且推荐节点数为奇数",slug:"redis集群为什么至少需要三个master节点-并且推荐节点数为奇数",children:[]},{level:2,title:"Redis集群对批量操作命令的支持",slug:"redis集群对批量操作命令的支持",children:[]}],filePathRelative:"Redis/33 Redis集群选举原理分析.md"}},42206:(s,e,a)=>{a.r(e),a.d(e,{default:()=>t});const n=(0,a(20641).Fv)('<h2 id="redis集群选举原理" tabindex="-1"><a class="header-anchor" href="#redis集群选举原理" aria-hidden="true">#</a> <strong>Redis集群选举原理</strong></h2><p>当slave发现自己的master变为FAIL状态时，便尝试进行Failover，以期成为新的master。由于挂掉的master可能会有多个slave，从而存在多个slave竞争成为master节点的过程， 其过程如下：</p><ol><li>slave发现自己的master变为FAIL</li><li>将自己记录的集群currentEpoch（当前的选举周期）加1，并广播FAILOVER_AUTH_REQUEST 信息</li><li><strong>其他节点收到该信息，只有master响应，判断请求者的合法性，并发送FAILOVER_AUTH_ACK，对每一个epoch（选举的周期）只发送一次ack</strong></li><li>尝试failover的slave收集master返回的FAILOVER_AUTH_ACK</li><li><strong>slave收到超过半数master的ack后变成新Master</strong>(这里解释了集群为什么至少需要三个主节点，如果只有两个，当其中一个挂了，只剩一个主节点是不能选举成功的)</li><li>slave广播Pong消息通知其他集群节点</li></ol><p>从节点并不是在主节点一进入 FAIL 状态就马上尝试发起选举，而是有一定延迟，一定的延迟确保我们等待FAIL状态在集群中传播，slave如果立即尝试选举，其它masters或许尚未意识到FAIL状态，可能会拒绝投票</p><p>延迟计算公式</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>DELAY <span class="token operator">=</span> 500ms + random<span class="token punctuation">(</span><span class="token number">0</span> ~ 500ms<span class="token punctuation">)</span> + SLAVE_RANK * 1000ms\n<span class="token comment"># SLAVE_RANK表示此slave已经从master复制数据的总量的rank。Rank越小代表已复制的数据越新。这种方式下，持有最新数据的slave将会首先发起选举（理论上）。</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="集群脑裂数据丢失问题" tabindex="-1"><a class="header-anchor" href="#集群脑裂数据丢失问题" aria-hidden="true">#</a> <strong>集群脑裂数据丢失问题</strong></h2><p>如某个主节点与集群网络断了</p><p>redis集群没有过半机制会有脑裂问题，网络分区导致脑裂后多个主节点对外提供写服务，一旦网络分区恢复，会将其中一个主节点变为从节点，这时会有大量数据丢失。</p><p>规避方法可以在redis配置里加上参数(这种方法不可能百分百避免数据丢失，参考集群leader选举机制)：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>min-replicas-to-write <span class="token number">1</span>  //写数据成功最少同步的slave数量，这个数量可以模仿大于半数机制配置，比如集群总共三个节点可以配置1，加上leader就是2，超过了半数\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><strong>注意</strong>：这个配置在一定程度上会影响集群的可用性，比如slave要是少于1个，这个集群就算leader正常也不能提供服务了，需要具体场景权衡选择。</p><p><img src="/images/Redis/image-20211115060128194.png" alt=""></p><h2 id="集群是否完整才能对外提供服务" tabindex="-1"><a class="header-anchor" href="#集群是否完整才能对外提供服务" aria-hidden="true">#</a> <strong>集群是否完整才能对外提供服务</strong></h2><p>当redis.conf的配置cluster-require-full-coverage为no时，表示当负责一个插槽的主库下线且没有相应的从库进行故障恢复时，集群仍然可用，如果为yes则集群不可用。</p><h2 id="redis集群为什么至少需要三个master节点-并且推荐节点数为奇数" tabindex="-1"><a class="header-anchor" href="#redis集群为什么至少需要三个master节点-并且推荐节点数为奇数" aria-hidden="true">#</a> <strong>Redis集群为什么至少需要三个master节点，并且推荐节点数为奇数</strong></h2><p>因为新master的选举需要大于半数的集群master节点同意才能选举成功，如果只有两个master节点，当其中一个挂了，是达不到选举新master的条件的。</p><p>奇数个master节点可以在满足选举该条件的基础上节省一个节点，比如三个master节点和四个master节点的集群相比，大家如果都挂了一个master节点都能选举新master节点，如果都挂了两个master节点都没法选举新master节点了，所以奇数的master节点更多的是⭐<strong>从节省机器资源角度出发</strong>⭐说的。</p><h2 id="redis集群对批量操作命令的支持" tabindex="-1"><a class="header-anchor" href="#redis集群对批量操作命令的支持" aria-hidden="true">#</a> <strong>Redis集群对批量操作命令的支持</strong></h2><p>对于类似mset，mget这样的多个key的原生批量操作命令，redis集群只支持所有key落在同一slot的情况，如果有多个key一定要用mset命令在redis集群上操作，则可以在key的前面加上{XX}，这样参数数据分片hash计算的只会是大括号里的值，<strong>这样能确保不同的key能落到同一slot里去</strong>，示例如下：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 假设name和age计算的hash slot值不一样，但是这条命令在集群下执行，redis只会用大括号里的 user1 做hash slot计算，所以算出来的slot值肯定相同，最后都能落在同一slot。</span>\n\nmset <span class="token punctuation">{</span>user1<span class="token punctuation">}</span>:1:name hzz <span class="token punctuation">{</span>user1<span class="token punctuation">}</span>:1:age <span class="token number">18</span>\n\n<span class="token comment"># 获取数据的时候也需要带上大括号</span>\nget <span class="token punctuation">{</span>user1<span class="token punctuation">}</span>:1:name\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>',21),r={},t=(0,a(66262).A)(r,[["render",function(s,e){return n}]])},66262:(s,e)=>{e.A=(s,e)=>{const a=s.__vccOpts||s;for(const[s,n]of e)a[s]=n;return a}}}]);
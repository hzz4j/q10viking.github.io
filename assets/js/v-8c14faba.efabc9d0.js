"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[63328],{18818:(s,a,n)=>{n.r(a),n.d(a,{data:()=>e});const e={key:"v-8c14faba",path:"/Redis/04%20String%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Redis/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"单值缓存",slug:"单值缓存",children:[]},{level:2,title:"对象缓存",slug:"对象缓存",children:[]},{level:2,title:"分布式锁",slug:"分布式锁",children:[]},{level:2,title:"计数器",slug:"计数器",children:[]},{level:2,title:"Web集群session共享",slug:"web集群session共享",children:[]},{level:2,title:"分布式系统全局序列号",slug:"分布式系统全局序列号",children:[]}],filePathRelative:"Redis/04 String应用场景.md"}},88838:(s,a,n)=>{n.r(a),n.d(a,{default:()=>r});const e=(0,n(20641).Fv)('<h2 id="单值缓存" tabindex="-1"><a class="header-anchor" href="#单值缓存" aria-hidden="true">#</a> 单值缓存</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>SET  key  value \t\nGET  key \n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="对象缓存" tabindex="-1"><a class="header-anchor" href="#对象缓存" aria-hidden="true">#</a> 对象缓存</h2><p><img src="/images/Redis/image-20211114045515743.png" alt=""></p><p>方式1: 直接json存储,存储简单，但是更新user字段的时候比较麻烦</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token constant">SET</span>  user<span class="token operator">:</span><span class="token number">1</span>  <span class="token function">value</span><span class="token punctuation">(</span>json格式数据<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>方式2：key设计+属性，分开存储，虽然存储麻烦，但是更新字段时比较方便</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token constant">MSET</span>  user<span class="token operator">:</span><span class="token number">1</span><span class="token operator">:</span>name  zhuge   user<span class="token operator">:</span><span class="token number">1</span><span class="token operator">:</span>balance  <span class="token number">1888</span>\n<span class="token constant">MGET</span>  user<span class="token operator">:</span><span class="token number">1</span><span class="token operator">:</span>name   user<span class="token operator">:</span><span class="token number">1</span><span class="token operator">:</span>balance \n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁" aria-hidden="true">#</a> 分布式锁</h2><p>SETNX当前仅当key不存在时，才可以设置成功</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token constant">SETNX</span>  product<span class="token operator">:</span><span class="token number">10001</span>  <span class="token boolean">true</span> \t\t\t\t\t<span class="token comment">//返回1代表获取锁成功</span>\n<span class="token constant">SETNX</span>  product<span class="token operator">:</span><span class="token number">10001</span>  <span class="token boolean">true</span> \t\t\t\t\t<span class="token comment">//返回0代表获取锁失败</span>\n。。。执行业务操作\n<span class="token constant">DEL</span>  product<span class="token operator">:</span><span class="token number">10001</span>\t\t\t   \t\t\t    <span class="token comment">//执行完业务释放锁</span>\n\n<span class="token constant">SET</span> product<span class="token operator">:</span><span class="token number">10001</span> <span class="token boolean">true</span>  ex  <span class="token number">10</span>  nx\t\t\t<span class="token comment">//防止程序意外终止导致死锁 ex 指定过期时间seconds nx SETNX的分开写法</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="计数器" tabindex="-1"><a class="header-anchor" href="#计数器" aria-hidden="true">#</a> 计数器</h2><p><img src="/images/Redis/image-20211114050136198.png" alt="image-20211114050136198"></p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>INCR article:readcount:{文章id}  \t\nGET article:readcount:{文章id} \n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="web集群session共享" tabindex="-1"><a class="header-anchor" href="#web集群session共享" aria-hidden="true">#</a> Web集群session共享</h2><p>spring session + redis实现session共享</p><h2 id="分布式系统全局序列号" tabindex="-1"><a class="header-anchor" href="#分布式系统全局序列号" aria-hidden="true">#</a> 分布式系统全局序列号</h2><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">// 相比使用incr orderId 一个个递增，对redis性能压榨比较厉害</span>\n<span class="token constant">INCRBY</span>  orderId  <span class="token number">1000</span>\t\t<span class="token comment">//redis批量生成序列号提升性能</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>',18),t={},r=(0,n(66262).A)(t,[["render",function(s,a){return e}]])},66262:(s,a)=>{a.A=(s,a)=>{const n=s.__vccOpts||s;for(const[s,e]of a)n[s]=e;return n}}}]);
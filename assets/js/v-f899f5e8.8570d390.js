"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[62432],{41090:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-f899f5e8",path:"/Ribbon/01%20Ribbon%E5%86%85%E6%A0%B8%E5%8E%9F%E7%90%86%E5%B9%B6%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Ribbon/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"内核原理",slug:"内核原理",children:[]},{level:2,title:"手动模拟实现其过程",slug:"手动模拟实现其过程",children:[{level:3,title:"前置知识",slug:"前置知识",children:[]}]},{level:2,title:"实现",slug:"实现",children:[]}],filePathRelative:"Ribbon/01 Ribbon内核原理并模拟实现.md"}},14827:(n,s,a)=>{a.r(s),a.d(s,{default:()=>r});var p=a(20641);const e=(0,p.Fv)('<h2 id="内核原理" tabindex="-1"><a class="header-anchor" href="#内核原理" aria-hidden="true">#</a> 内核原理</h2><ol><li>获取该服务对应的所有实例</li><li>拦截方法将mall-order，替换为实例的IP:PORT</li></ol><p><img src="/images/ribbon/13570.png" alt="img"></p><h2 id="手动模拟实现其过程" tabindex="-1"><a class="header-anchor" href="#手动模拟实现其过程" aria-hidden="true">#</a> 手动模拟实现其过程</h2><ol><li>先去掉RestTemplate的Ribbon(我的项目之前配置了)</li></ol><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">// 使得注入的RestTemplate不具备Ribbon的功能</span>\n<span class="token annotation punctuation">@Bean</span>\n<span class="token comment">//    @LoadBalanced  </span>\n<span class="token keyword">public</span> <span class="token class-name">RestTemplate</span> <span class="token function">restTemplate</span><span class="token punctuation">(</span><span class="token class-name">RestTemplateBuilder</span> restTemplateBuilder<span class="token punctuation">)</span><span class="token punctuation">{</span>\n\n    <span class="token keyword">return</span> restTemplateBuilder\n        <span class="token comment">//                .additionalInterceptors(new LoadBalancerInterceptor(loadBalancerClient))</span>\n        <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="前置知识" tabindex="-1"><a class="header-anchor" href="#前置知识" aria-hidden="true">#</a> 前置知识</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">// 容器中会注入一个spring cloud 的CompositeDiscoveryClient类</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CompositeDiscoveryClient</span> <span class="token keyword">implements</span> <span class="token class-name">DiscoveryClient</span> <span class="token punctuation">{</span>\n\t<span class="token comment">// NacosDiscoveryClient 也在里面</span>\n\t<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DiscoveryClient</span><span class="token punctuation">&gt;</span></span> discoveryClients<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h2>',9),t=(0,p.Lk)("li",null,[(0,p.Lk)("p",null,"通过DiscoveryClient获取到服务所有的实例")],-1),o=(0,p.Lk)("li",null,[(0,p.Lk)("p",null,"通过轮训方式的负载均衡算法，获取到其中一个实例")],-1),c=(0,p.Lk)("p",null,"替换mall-order为ip地址，然后访问",-1),l={href:"https://github.com/Q10Viking/springcloudalibaba/tree/main/03-learn-spring-cloud-alibaba",target:"_blank",rel:"noopener noreferrer"},i=(0,p.Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@RestController</span>\n<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/user&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserController</span> <span class="token punctuation">{</span>\n\n    <span class="token annotation punctuation">@Autowired</span>\n    <span class="token keyword">private</span> <span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">;</span>\n\n    <span class="token annotation punctuation">@Autowired</span>\n    <span class="token keyword">private</span> <span class="token class-name">DiscoveryClient</span> discoveryClient<span class="token punctuation">;</span>\n\n    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/findOrderByUserId/{id}&quot;</span><span class="token punctuation">)</span>\n    <span class="token keyword">public</span> <span class="token class-name">R</span> <span class="token function">findOrderByUserId</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">&quot;id&quot;</span><span class="token punctuation">)</span> <span class="token class-name">Integer</span> id<span class="token punctuation">)</span><span class="token punctuation">{</span>\n<span class="token comment">//        String orderUrl = &quot;http://localhost:8020/order/findOrderByUserId/&quot;+id;</span>\n        <span class="token class-name">String</span> orderUrl <span class="token operator">=</span> <span class="token function">getUrl</span><span class="token punctuation">(</span><span class="token string">&quot;mall-order&quot;</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot;/order/findOrderByUserId/&quot;</span><span class="token operator">+</span>id<span class="token punctuation">;</span>\n        <span class="token class-name">R</span> r <span class="token operator">=</span> restTemplate<span class="token punctuation">.</span><span class="token function">getForObject</span><span class="token punctuation">(</span>orderUrl<span class="token punctuation">,</span> <span class="token class-name">R</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> r<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AtomicInteger</span> count <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token class-name">String</span> <span class="token function">getUrl</span><span class="token punctuation">(</span><span class="token class-name">String</span> serviceName<span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">&gt;</span></span> instances <span class="token operator">=</span> discoveryClient<span class="token punctuation">.</span><span class="token function">getInstances</span><span class="token punctuation">(</span>serviceName<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token comment">// 通过负载均衡获取到其中的一个实例</span>\n        <span class="token class-name">ServiceInstance</span> serviceInstance <span class="token operator">=</span> instances<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token function">getIndex</span><span class="token punctuation">(</span>instances<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">URI</span> uri <span class="token operator">=</span> serviceInstance<span class="token punctuation">.</span><span class="token function">getUri</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> uri<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// CAS获取到洗衣歌实例的索引位置</span>\n    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">getIndex</span><span class="token punctuation">(</span><span class="token keyword">int</span> size<span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">int</span> currentIndex <span class="token operator">=</span> count<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">int</span> next <span class="token operator">=</span> <span class="token punctuation">(</span>currentIndex<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">%</span>size<span class="token punctuation">;</span>\n            <span class="token keyword">if</span><span class="token punctuation">(</span>count<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span>currentIndex<span class="token punctuation">,</span>next<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                <span class="token keyword">return</span> currentIndex<span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div>',1),u={},r=(0,a(66262).A)(u,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[e,(0,p.Lk)("ol",null,[t,o,(0,p.Lk)("li",null,[c,(0,p.Lk)("p",null,[(0,p.Lk)("a",l,[(0,p.eW)("模拟Ribbon的内核实现-github"),(0,p.bF)(a)])])])]),i],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
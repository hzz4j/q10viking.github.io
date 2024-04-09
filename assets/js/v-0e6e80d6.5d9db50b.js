"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[56512],{13549:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-0e6e80d6",path:"/concurrency/55%20%E7%94%9F%E4%BA%A7%E8%80%85%E4%B8%8E%E6%B6%88%E8%B4%B9%E8%80%85.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"案例",slug:"案例",children:[{level:3,title:"消费者",slug:"消费者",children:[]}]},{level:2,title:"生产者",slug:"生产者",children:[]},{level:2,title:"应用",slug:"应用",children:[]}],filePathRelative:"concurrency/55 生产者与消费者.md"}},62812:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var p=a(20641);const t=(0,p.Fv)('<blockquote><p>生产者消费者模式是一个十分经典的多线程协作的模式</p></blockquote><h2 id="案例" tabindex="-1"><a class="header-anchor" href="#案例" aria-hidden="true">#</a> 案例</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>消费者步骤：\n    1，判断桌子上是否有汉堡包。\n    2，如果没有就等待。\n    3，如果有就开吃\n    4，吃完之后，桌子上的汉堡包就没有了叫醒等待的生产者继续生产汉堡包的总数量减一\n====================================================================\n生产者步骤：\n    1，判断桌子上是否有汉堡包如果有就等待，如果没有才生产。\n    2，把汉堡包放在桌子上。\n    3，叫醒等待的消费者开吃。\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p><img src="/images/concurrency/image-20230304163651877.png" alt="image-20230304163651877"></p>',4),e={href:"https://github.com/Q10Viking/learncode/tree/main/concurrency/src/main/java/org/hzz/basic/consumerandproducer",target:"_blank",rel:"noopener noreferrer"},c=(0,p.Fv)('<h3 id="消费者" tabindex="-1"><a class="header-anchor" href="#消费者" aria-hidden="true">#</a> 消费者</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Consumer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">&lt;</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>count<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>flag<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s 吃掉汉堡(%d)&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n                                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token operator">++</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>flag <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">notifyAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    <span class="token punctuation">}</span>\n                <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s 离开餐厅&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="生产者" tabindex="-1"><a class="header-anchor" href="#生产者" aria-hidden="true">#</a> 生产者</h2><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Cooker</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span><span class="token punctuation">{</span>\n\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span><span class="token punctuation">{</span>\n            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">&lt;</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>count<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token class-name">Desk</span><span class="token punctuation">.</span>flag<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                        <span class="token comment">// 桌子上有汉堡，不生产</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>\n                        <span class="token comment">// 生产</span>\n                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s 生产汉堡(%d)&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n                                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token operator">++</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>flag <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n                        <span class="token class-name">Desk</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">notifyAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    <span class="token punctuation">}</span>\n                <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s 结束工作&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><blockquote><p>测试</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Desk</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>\n    <span class="token comment">// 桌子上是否有汉堡</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token keyword">boolean</span> flag <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Cooker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;厨师&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Consumer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;Q10Viking&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n * 厨师 生产汉堡(1)\n * Q10Viking 吃掉汉堡(1)\n * 厨师 生产汉堡(2)\n * Q10Viking 吃掉汉堡(2)\n * 厨师 生产汉堡(3)\n * Q10Viking 吃掉汉堡(3)\n * 厨师 生产汉堡(4)\n * Q10Viking 吃掉汉堡(4)\n * 厨师 生产汉堡(5)\n * 厨师 结束工作\n * Q10Viking 吃掉汉堡(5)\n * Q10Viking 离开餐厅\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="应用" tabindex="-1"><a class="header-anchor" href="#应用" aria-hidden="true">#</a> 应用</h2>',7),o={href:"https://q10viking.github.io/concurrency/53%20%E7%AE%80%E5%8D%95%E7%9A%84%E8%BF%9E%E6%8E%A5%E6%B1%A0%E5%AE%9E%E7%8E%B0.html",target:"_blank",rel:"noopener noreferrer"},l={},u=(0,a(66262).A)(l,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[t,(0,p.Lk)("p",null,[(0,p.Lk)("a",e,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),c,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("静默のBlog简单线程池的实现"),(0,p.bF)(a)])])],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
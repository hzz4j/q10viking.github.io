"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[45009],{44218:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-0d922af1",path:"/Algorithm/11%20%E7%9B%9B%E6%9C%80%E5%A4%9A%E6%B0%B4%E7%9A%84%E5%AE%B9%E5%99%A8.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Algorithm/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"指针碰撞",slug:"指针碰撞",children:[]}],filePathRelative:"Algorithm/11 盛最多水的容器.md"}},68136:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var p=a(20641);const t={class:"custom-container tip"},e=(0,p.Lk)("p",{class:"custom-container-title"},"TIP",-1),o={href:"https://leetcode.cn/problems/container-with-most-water/",target:"_blank",rel:"noopener noreferrer"},c=(0,p.Fv)('<p>看图和木桶理论：“一只木桶盛水的多少，并不取决于桶壁上最高的那块木块，而恰恰取决于桶壁上最短的那块。”。我们知道，由于可容纳水的高度由两板中的短板决定。而这个桶的底部的宽度自然就是j-i</p><p><img src="/images/algorithm/image-20230925085334801.png" alt="image-20230925085334801"></p><h2 id="指针碰撞" tabindex="-1"><a class="header-anchor" href="#指针碰撞" aria-hidden="true">#</a> 指针碰撞</h2><p>很自然，这个桶的的面积就是<code>min(height[i],height[j])*(i-j)</code>。现在要求是能可以容纳最多的水，所以我们需要移动指针进行尝试，怎么移动指针比较好呢？两个指针同时移动，肯定不行。一次移动一个指针比较合适，我们来分析一下：</p><ul><li>若向内移动短板，水槽的短板可能变大也可能更小，因此下个水槽的面积 可能增大也可能缩小。</li><li>若向内移动长板 ，水槽的短板不变或变小，桶的底部的宽度会减一，因此下个水槽的面积一定变小。</li></ul><p>所以，移动短板比移动长板获得最大面积的概率更大，那么这个不断移动的过程中，计算面积，并保留最大的面积就是我们需要的结果，当然要注意，短板和长板是个相对的概念，这次长板到了下次可能就是短板了</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">Solution</span> solution <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Solution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>solution<span class="token punctuation">.</span><span class="token function">maxArea</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">8</span><span class="token punctuation">,</span><span class="token number">6</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">8</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">7</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">maxArea</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> height<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> left <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>right <span class="token operator">=</span> height<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>\n        <span class="token keyword">int</span> maxArea <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n\n        <span class="token keyword">while</span><span class="token punctuation">(</span>left <span class="token operator">&lt;</span> right<span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">int</span> area <span class="token operator">=</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>height<span class="token punctuation">[</span>left<span class="token punctuation">]</span><span class="token punctuation">,</span>height<span class="token punctuation">[</span>right<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>right <span class="token operator">-</span> left<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            maxArea <span class="token operator">=</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>maxArea<span class="token punctuation">,</span>area<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token comment">// 移动短板</span>\n            <span class="token keyword">if</span><span class="token punctuation">(</span>height<span class="token punctuation">[</span>left<span class="token punctuation">]</span> <span class="token operator">&lt;</span> height<span class="token punctuation">[</span>right<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                left<span class="token operator">++</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>\n                right<span class="token operator">--</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> maxArea<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 49</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div>',7),l={},u=(0,a(66262).A)(l,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[(0,p.Lk)("div",t,[e,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("11. 盛最多水的容器"),(0,p.bF)(a)])])]),c],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
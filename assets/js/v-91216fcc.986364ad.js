"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[86408],{21634:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-91216fcc",path:"/Algorithm/14%20%E6%9C%80%E9%95%BF%E5%85%AC%E5%85%B1%E5%89%8D%E7%BC%80.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Algorithm/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"暴力解法",slug:"暴力解法",children:[]}],filePathRelative:"Algorithm/14 最长公共前缀.md"}},33149:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var p=a(20641);const t={class:"custom-container tip"},o=(0,p.Lk)("p",{class:"custom-container-title"},"TIP",-1),e={href:"https://leetcode.cn/problems/longest-common-prefix/description/",target:"_blank",rel:"noopener noreferrer"},c=(0,p.Fv)('<h2 id="暴力解法" tabindex="-1"><a class="header-anchor" href="#暴力解法" aria-hidden="true">#</a> 暴力解法</h2><blockquote><p>一个一个对比,两个对比留下相同部分，然后继续和下一个字符串对比</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">Solution</span> solution <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Solution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>solution<span class="token punctuation">.</span><span class="token function">longestCommonPrefix</span><span class="token punctuation">(</span>\n                <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span>\n                        <span class="token string">&quot;flower&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;flow&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;flight&quot;</span>\n                <span class="token punctuation">}</span>\n        <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">longestCommonPrefix</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> strs<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">String</span> ans <span class="token operator">=</span> strs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n        \n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> strs<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> ans<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> j <span class="token operator">&lt;</span> strs<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token keyword">if</span><span class="token punctuation">(</span>ans<span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span> <span class="token operator">!=</span> strs<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                    <span class="token keyword">break</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n            ans <span class="token operator">=</span> ans<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span>j<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> ans<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// fl</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div>',3),l={},u=(0,a(66262).A)(l,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[(0,p.Lk)("div",t,[o,(0,p.Lk)("p",null,[(0,p.Lk)("a",e,[(0,p.eW)("14. 最长公共前缀 - 力扣（LeetCode）"),(0,p.bF)(a)])])]),c],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[36130],{78361:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-43dc0b1c",path:"/Algorithm/338%20%E6%AF%94%E7%89%B9%E4%BD%8D%E8%AE%A1%E6%95%B0.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Algorithm/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:3,title:"二进制位运算❤️",slug:"二进制位运算❤️",children:[]},{level:3,title:"奇偶性",slug:"奇偶性",children:[]}],filePathRelative:"Algorithm/338 比特位计数.md"}},59443:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var p=a(20641);const e={class:"custom-container tip"},t=(0,p.Lk)("p",{class:"custom-container-title"},"TIP",-1),o={href:"https://leetcode.cn/problems/counting-bits/",target:"_blank",rel:"noopener noreferrer"},c={href:"https://github.com/Q10Viking/learncode/blob/main/algorithm/src/main/java/org/hzz/bit/CountingBits_338.java",target:"_blank",rel:"noopener noreferrer"},l=(0,p.Fv)('<h3 id="二进制位运算❤️" tabindex="-1"><a class="header-anchor" href="#二进制位运算❤️" aria-hidden="true">#</a> 二进制位运算❤️</h3><p>利用二进制位运算的经典题。本题可以利用**X &amp;= (X - 1)**清除最低位的1的功能来解决。</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>假设X= 21，二进制表示为  0001 0101，\n则 21 &amp; 20 = 0001 0101 &amp; 0001 0100 = 0001 0100 = 20\n20&amp;19 = 0001 0100 &amp; 0001 0011 = 0001 0000= 16\n16&amp;15 = 0001 0000 &amp; 0000 1111 = 0\n相比原来的8次，我们这里只需3次即可知道21的二进制表示中有三个1。\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>对于这个题目，我们就可以反过来思考，还是以21为例，在统计21中1的个数时，其实我们只要在20的1的个数基础上加1就是21的值，而20的值又是在16的1的个数值上加1，16的值又是0的1的个数值上加1，而我们统计的次序刚好又是0,16,20,21。那就是说</p><blockquote><p>N中1的个数 = N&amp;(N-1)中1的个数+1。</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">countBits</span><span class="token punctuation">(</span><span class="token keyword">int</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> bits<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>n<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        bits<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> bits<span class="token punctuation">[</span>i<span class="token operator">&amp;</span><span class="token punctuation">(</span>i<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> bits<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="奇偶性" tabindex="-1"><a class="header-anchor" href="#奇偶性" aria-hidden="true">#</a> 奇偶性</h3><p>对于所有的数字，只有两类：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>奇数：二进制表示中，奇数一定比前面那个偶数多一个 <span class="token number">1</span>，因为多的就是最低位的 <span class="token number">1</span>。\n举例： \n<span class="token number">0</span> <span class="token operator">=</span> <span class="token number">0</span>    <span class="token number">1</span> <span class="token operator">=</span> <span class="token number">1</span>\n<span class="token number">2</span> <span class="token operator">=</span> <span class="token number">10</span>   <span class="token number">3</span> <span class="token operator">=</span> <span class="token number">11</span>\n\n偶数：二进制表示中，偶数中 <span class="token number">1</span> 的个数一定和除以 <span class="token number">2</span> 之后的那个数一样多。因为最低位是 <span class="token number">0</span>，除以 <span class="token number">2</span> 就是右移一位，也就是把那个 <span class="token number">0</span> 抹掉而已，所以 <span class="token number">1</span> 的个数是不变的。\n举例：\n<span class="token number">2</span> <span class="token operator">=</span> <span class="token number">10</span>       <span class="token number">4</span> <span class="token operator">=</span> <span class="token number">100</span>       <span class="token number">8</span> <span class="token operator">=</span> <span class="token number">1000</span>\n<span class="token number">3</span> <span class="token operator">=</span> <span class="token number">11</span>       <span class="token number">6</span> <span class="token operator">=</span> <span class="token number">110</span>       <span class="token number">12</span> <span class="token operator">=</span> <span class="token number">1100</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">countBits</span><span class="token punctuation">(</span><span class="token keyword">int</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> bits<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>n<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        bits<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>i<span class="token operator">&amp;</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">?</span> bits<span class="token punctuation">[</span>i<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token operator">+</span><span class="token number">1</span><span class="token operator">:</span>bits<span class="token punctuation">[</span>i<span class="token operator">&gt;&gt;</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> bits<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div>',10),r={},u=(0,a(66262).A)(r,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[(0,p.Lk)("div",e,[t,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("338. 比特位计数 - 力扣（LeetCode）"),(0,p.bF)(a)])]),(0,p.Lk)("p",null,[(0,p.Lk)("a",c,[(0,p.eW)("Source Code CountingBits_338.java"),(0,p.bF)(a)])])]),l],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
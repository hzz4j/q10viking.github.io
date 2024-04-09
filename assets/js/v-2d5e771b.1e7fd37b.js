"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[89591],{81959:(n,a,s)=>{s.r(a),s.d(a,{data:()=>p});const p={key:"v-2d5e771b",path:"/Algorithm/470%20%E7%94%A8%20Rand7()%20%E5%AE%9E%E7%8E%B0%20Rand10().html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Algorithm/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[],filePathRelative:"Algorithm/470 用 Rand7() 实现 Rand10().md"}},97546:(n,a,s)=>{s.r(a),s.d(a,{default:()=>c});var p=s(20641);const t={class:"custom-container tip"},e=(0,p.Lk)("p",{class:"custom-container-title"},"TIP",-1),o={href:"https://leetcode.cn/problems/implement-rand10-using-rand7/",target:"_blank",rel:"noopener noreferrer"},l=(0,p.Fv)('<p>rand7()等概率地产生1，2，3，4，5，6，7。要想得到rand10()即等概率的生成1-10。解题思路是先构造一个randN()，这个N必须是10的整数倍，然后randN %10就可以得到rand10()了。</p><p>所以可以从rand7()先构造出rand49()，再把rand49()中大于等于40的都过滤掉，这样就得到了rand40()，在对10取余即可。</p><p>具体构造步骤，rand7() --&gt; rand49()--&gt; rand40() --&gt; rand10()：</p><ol><li><p>rand7()等概率地产生1，2，3，4，5，6，7；</p></li><li><p>rand7() - 1等概率地产生[0，1，2，3，4，5，6]；</p></li><li><p>(rand7() - 1) *7等概率地产生0，7，14，21，28，35，42；</p></li><li><p>(rand7 () - 1)*7 +(rand7() - 1)等概率地产生[0~48]这49个数字；</p></li><li><p>如果步骤4的结果大于等于40，那么就重复步骤4，直到产生的数小于40；</p></li><li><p>把步骤5的结果mod 10再加1，就会等概率的随机生成[1~10]；</p></li></ol><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token keyword">extends</span> <span class="token class-name">SolBase</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">rand10</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> num <span class="token operator">=</span> <span class="token number">40</span><span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>num <span class="token operator">&gt;=</span> <span class="token number">40</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            num <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token function">rand7</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token function">rand7</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">7</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> num <span class="token operator">%</span> <span class="token number">10</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>\n        \n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>这道题完全可以推广到生成任意数的随机数问题，用randN()实现randM()，M&gt;N。步骤如下:</p><p>1．用randN()先实现randX()，其中X≥M，X是N的整数倍。如这题中的N=7，X=49，M=10；</p><p>2．再用randX()生成randY()，其中Y是M的整数倍，如这题中Y=40，M=10；</p><p>3．将randY()的值mod M 再加1，就是我们需要的randM()的结果。</p><p>举个例子，用rand3()生成rand11()，可以先生成rand27()，然后变成以22为界限，因为22是11的倍数。具体步骤：</p><ol><li><p>rand3()等概率地产生1，2，3；</p></li><li><p>rand3() - 1等概率地产生0，1，2；</p></li><li><p>(rand3() - 1) * 3等概率地产生0，3，6；</p></li><li><p>(rand3() - 1) * 3 *3等概率地产生0，9，18；</p></li><li><p>3 * 3 * (rand3() - 1) + 3 * (rand3() - 1)+(rand3() - 1)等概率地产生[0~26]这27个数字</p></li><li><p>如果步骤5的结果大于等于22，那么就重复步骤5，直到产生的数小于22；</p></li><li><p>把步骤5的结果mod 11再加1，就会等概率的随机生成[1~11]；</p></li></ol>',11),r={},c=(0,s(66262).A)(r,[["render",function(n,a){const s=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[(0,p.Lk)("div",t,[e,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("470. 用 Rand7() 实现 Rand10()"),(0,p.bF)(s)])])]),l],64)}]])},66262:(n,a)=>{a.A=(n,a)=>{const s=n.__vccOpts||n;for(const[n,p]of a)s[n]=p;return s}}}]);
"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[16594],{50272:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-42d853ca",path:"/Algorithm/141%20%E7%8E%AF%E5%BD%A2%E5%88%97%E8%A1%A8.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Algorithm/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Hash表",slug:"hash表",children:[]},{level:2,title:"快慢指针",slug:"快慢指针",children:[]}],filePathRelative:"Algorithm/141 环形列表.md"}},88109:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var p=a(20641);const e={class:"custom-container tip"},t=(0,p.Lk)("p",{class:"custom-container-title"},"TIP",-1),o={href:"https://leetcode.cn/problems/linked-list-cycle/",target:"_blank",rel:"noopener noreferrer"},l=(0,p.Fv)('<p><img src="https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png" alt="img"></p><h2 id="hash表" tabindex="-1"><a class="header-anchor" href="#hash表" aria-hidden="true">#</a> Hash表</h2><p>可以使用Hash表来解决：</p><p>1、从表头结点开始,逐个遍历链表中的每个结点。</p><p>2、对于每个结点，检查该结点的地址是否存在于散列表中。</p><p>3、如果存在，则表明当前访问的结点已经被访问过了。出现这种情况只能是因为给定链表中存在环。</p><p>4、如果散列表中没有当前结点的地址，那么把该地址插入散列表中。重复上述过程,直至到达表尾或者找到环。</p><p>这个方法时间复杂度为O(n)，用于扫描链表。空间复杂度为O(n)，用于散列表的空间开销。</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">hasCycle</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ListNode</span><span class="token punctuation">&gt;</span></span> set <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>head <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">if</span><span class="token punctuation">(</span>set<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>head<span class="token punctuation">)</span><span class="token punctuation">)</span>\n                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n            set<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>head<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            head <span class="token operator">=</span> head<span class="token punctuation">.</span>next<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="快慢指针" tabindex="-1"><a class="header-anchor" href="#快慢指针" aria-hidden="true">#</a> 快慢指针</h2><p>对于判断是否存在环形链表，其实存在着一种通用解法，该方法称为Floyd环判定算法。该方法使用两个在链表中具有不同移动速度的指针。一旦它们进入环，就成为一个环形追及问题，两者肯定相遇，只要相遇就表示存在环。</p><p>在工程实践中，一般两个指针每次分别移动1个结点和2个结点，其他的移动速度也能解决这个问题，但是会增加算法的复杂度</p><p><img src="/images/algorithm/image-20230923190815762.png" alt="image-20230923190815762"></p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Solution2</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">hasCycle</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">ListNode</span> slow <span class="token operator">=</span> head<span class="token punctuation">,</span>fast <span class="token operator">=</span> head<span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>fast <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> fast<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            slow <span class="token operator">=</span> slow<span class="token punctuation">.</span>next<span class="token punctuation">;</span>\n            fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">.</span>next<span class="token punctuation">;</span>\n            <span class="token keyword">if</span><span class="token punctuation">(</span>slow <span class="token operator">==</span> fast<span class="token punctuation">)</span>\n                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div>',14),c={},u=(0,a(66262).A)(c,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[(0,p.Lk)("div",e,[t,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("141. 环形链表"),(0,p.bF)(a)])])]),l],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
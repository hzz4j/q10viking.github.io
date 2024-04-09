"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[93176],{7516:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-1c707cf9",path:"/typescript/06%20next%20gen%20js.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/typescript/"}},excerpt:"",headers:[{level:2,title:"Rest paramter",slug:"rest-paramter",children:[]},{level:2,title:"数组的扩展",slug:"数组的扩展",children:[]},{level:2,title:"对象复制",slug:"对象复制",children:[]},{level:2,title:"箭头函数",slug:"箭头函数",children:[]},{level:2,title:"解构",slug:"解构",children:[{level:3,title:"数组",slug:"数组",children:[]},{level:3,title:"对象",slug:"对象",children:[]}]}],filePathRelative:"typescript/06 next gen js.md"}},79729:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(20641).Fv)('<h2 id="rest-paramter" tabindex="-1"><a class="header-anchor" href="#rest-paramter" aria-hidden="true">#</a> Rest paramter</h2><p>数组Array</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">addNumbers</span><span class="token punctuation">(</span><span class="token operator">...</span>numbers<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">return</span> numbers<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>currentResult<span class="token punctuation">,</span>currentValue<span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> currentResult<span class="token operator">+</span>currentValue<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">addNumbers</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">,</span><span class="token number">3.7</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="highlight-lines"><div class="highlight-line"> </div><br><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Tuple</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">addNumbers</span><span class="token punctuation">(</span><span class="token operator">...</span>numbers<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token builtin">number</span><span class="token punctuation">,</span> <span class="token builtin">number</span><span class="token punctuation">,</span> <span class="token builtin">number</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> numbers<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>currentResult<span class="token punctuation">,</span> currentValue<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> currentResult <span class="token operator">+</span> currentValue<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n</code></pre><div class="highlight-lines"><div class="highlight-line"> </div><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="数组的扩展" tabindex="-1"><a class="header-anchor" href="#数组的扩展" aria-hidden="true">#</a> 数组的扩展</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>const hobbies <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;Sport&quot;</span>, <span class="token string">&quot;Reading&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\nconst hobbActivies <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">..</span>.hobbies<span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="对象复制" tabindex="-1"><a class="header-anchor" href="#对象复制" aria-hidden="true">#</a> 对象复制</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;静默&quot;</span><span class="token punctuation">,</span>\n  <span class="token literal-property property">developer</span><span class="token operator">:</span> <span class="token string">&quot;Java&quot;</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> Q10Viking <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>person <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="箭头函数" tabindex="-1"><a class="header-anchor" href="#箭头函数" aria-hidden="true">#</a> 箭头函数</h2><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token function-variable function">printOut1</span><span class="token operator">:</span> <span class="token punctuation">(</span>msg<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function-variable function">void</span> <span class="token operator">=</span> <span class="token punctuation">(</span>msg<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token function-variable function">printOut2</span> <span class="token operator">=</span> <span class="token punctuation">(</span>msg<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">printOut1</span><span class="token punctuation">(</span><span class="token string">&#39;Hello World&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">printOut2</span><span class="token punctuation">(</span><span class="token string">&#39;Hello World&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="highlight-lines"><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="解构" tabindex="-1"><a class="header-anchor" href="#解构" aria-hidden="true">#</a> 解构</h2><h3 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h3><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> hobbies <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;Sport&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Reading&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token punctuation">[</span>hobby1<span class="token punctuation">,</span> hobby2<span class="token punctuation">,</span> <span class="token operator">...</span>remainingHobbies<span class="token punctuation">]</span> <span class="token operator">=</span> hobbies<span class="token punctuation">;</span>\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>hobbies<span class="token punctuation">,</span> hobby1<span class="token punctuation">,</span> hobby2<span class="token punctuation">,</span> remainingHobbies<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="对象" tabindex="-1"><a class="header-anchor" href="#对象" aria-hidden="true">#</a> 对象</h3><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n  name<span class="token operator">:</span> <span class="token string">&quot;静默&quot;</span><span class="token punctuation">,</span>\n  developer<span class="token operator">:</span> <span class="token string">&quot;Java&quot;</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> nameAlias<span class="token punctuation">,</span> developer <span class="token punctuation">}</span> <span class="token operator">=</span> person<span class="token punctuation">;</span>\n</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>',16),t={},e=(0,a(66262).A)(t,[["render",function(n,s){return p}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
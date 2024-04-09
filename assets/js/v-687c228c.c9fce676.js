"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[54979],{15711:(n,s,a)=>{a.r(s),a.d(s,{data:()=>e});const e={key:"v-687c228c",path:"/golang/05%20%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/golang/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"全局变量",slug:"全局变量",children:[]},{level:2,title:"全局方法",slug:"全局方法",children:[]}],filePathRelative:"golang/05 可访问性.md"}},36536:(n,s,a)=>{a.r(s),a.d(s,{default:()=>t});const e=(0,a(20641).Fv)('<h2 id="全局变量" tabindex="-1"><a class="header-anchor" href="#全局变量" aria-hidden="true">#</a> 全局变量</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>首字符是否大写控制了访问性：大写包 外可访问；</p></div><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">// test/main.go</span>\n<span class="token keyword">package</span> main\n\n<span class="token keyword">import</span> varia <span class="token string">&quot;basic/variables&quot;</span>\n\n<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token function">println</span><span class="token punctuation">(</span>varia<span class="token punctuation">.</span>External<span class="token punctuation">)</span>\n\t<span class="token comment">// 不可访问</span>\n\t<span class="token comment">//println(varia.internal)</span>\n<span class="token punctuation">}</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><img src="/images/golang/image-20220615030704902.png" alt="image-20220615030704902"></p><h2 id="全局方法" tabindex="-1"><a class="header-anchor" href="#全局方法" aria-hidden="true">#</a> 全局方法</h2><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> main\n\n<span class="token keyword">import</span> <span class="token string">&quot;basic/variables&quot;</span>\n\n<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\tvariables<span class="token punctuation">.</span><span class="token function">Func2</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><img src="/images/golang/image-20220615031735768.png" alt="image-20220615031735768"></p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">var</span> Func2 <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;func2&quot;</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>',8),p={},t=(0,a(66262).A)(p,[["render",function(n,s){return e}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,e]of s)a[n]=e;return a}}}]);
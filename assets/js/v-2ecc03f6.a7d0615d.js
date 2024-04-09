"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[83814],{54390:(n,s,a)=>{a.r(s),a.d(s,{data:()=>t});const t={key:"v-2ecc03f6",path:"/minifrontendproject/28%20Increment%20Counter.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/minifrontendproject/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Increment Counter",slug:"increment-counter",children:[]},{level:2,title:"利用属性",slug:"利用属性",children:[]},{level:2,title:"如何并行的？",slug:"如何并行的",children:[]},{level:2,title:"响应式布局",slug:"响应式布局",children:[]},{level:2,title:"Vue3中使用ref属性",slug:"vue3中使用ref属性",children:[]}],filePathRelative:"minifrontendproject/28 Increment Counter.md"}},54326:(n,s,a)=>{a.r(s),a.d(s,{default:()=>m});var t=a(20641);const p=(0,t.Lk)("h2",{id:"increment-counter",tabindex:"-1"},[(0,t.Lk)("a",{class:"header-anchor",href:"#increment-counter","aria-hidden":"true"},"#"),(0,t.eW)(" Increment Counter")],-1),e={href:"https://q10viking.github.io/Mini-FrontEnd-project/33%20Increment%20Counter/vite-project/dist/",target:"_blank",rel:"noopener noreferrer"},o={href:"https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/33%20Increment%20Counter/vanilla",target:"_blank",rel:"noopener noreferrer"},c={href:"https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/33%20Increment%20Counter/vite-project",target:"_blank",rel:"noopener noreferrer"},l=(0,t.Fv)('<h2 id="利用属性" tabindex="-1"><a class="header-anchor" href="#利用属性" aria-hidden="true">#</a> 利用属性</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>自定义的data-target</p></div><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>item<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>i</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>fa-brands fa-tiktok<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>i</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>counter<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-target</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>23000<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>Tiktok Fans<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>在js代码中可以获取到</p><div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token keyword">const</span> target <span class="token operator">=</span> <span class="token operator">+</span>counter<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&quot;data-target&quot;</span><span class="token punctuation">)</span><span class="token operator">!</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="如何并行的" tabindex="-1"><a class="header-anchor" href="#如何并行的" aria-hidden="true">#</a> 如何并行的？</h2><p>程序不应该按顺序执行的吗？利用定时器，可以达到并发的效果。主程序主要是设置定时器。接下的程序则由定时器自己运行</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> counters <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">&quot;.counter&quot;</span><span class="token punctuation">)</span><span class="token operator">!</span>\n\ncounters<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">counter</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  counter<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token string">&quot;0&quot;</span>\n  <span class="token keyword">const</span> target <span class="token operator">=</span> <span class="token operator">+</span>counter<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&quot;data-target&quot;</span><span class="token punctuation">)</span><span class="token operator">!</span>\n  <span class="token keyword">const</span> step <span class="token operator">=</span> target <span class="token operator">/</span> <span class="token number">200</span>\n  <span class="token keyword">let</span> val <span class="token operator">=</span> <span class="token number">0</span>\n\n  <span class="token comment">// 这段函数设置在这里的意义是方便访问外边的变量</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">updateNumber</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>\n    val <span class="token operator">+=</span> step\n    <span class="token keyword">if</span><span class="token punctuation">(</span>val<span class="token operator">&lt;</span>target<span class="token punctuation">)</span><span class="token punctuation">{</span>\n      counter<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> val<span class="token operator">+</span><span class="token string">&quot;&quot;</span>\n      <span class="token comment">// 递归调用 setTimeout这里并不会第一次阻塞下一次的循环，程序设置完定时器后继续执行了</span>\n      <span class="token function">setTimeout</span><span class="token punctuation">(</span>updateNumber<span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>\n      counter<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> target<span class="token operator">+</span><span class="token string">&quot;&quot;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">updateNumber</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="响应式布局" tabindex="-1"><a class="header-anchor" href="#响应式布局" aria-hidden="true">#</a> 响应式布局</h2><div class="language-scss ext-scss line-numbers-mode"><pre class="language-scss"><code><span class="token selector">.container</span><span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>\n    <span class="token property">flex-direction</span><span class="token punctuation">:</span> row<span class="token punctuation">;</span>\n\n    @<span class="token function">media</span><span class="token punctuation">(</span><span class="token property">max-width</span><span class="token punctuation">:</span> 580px<span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token property">flex-direction</span><span class="token punctuation">:</span> column<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="vue3中使用ref属性" tabindex="-1"><a class="header-anchor" href="#vue3中使用ref属性" aria-hidden="true">#</a> Vue3中使用ref属性</h2>',11),u={href:"https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs",target:"_blank",rel:"noopener noreferrer"},r=(0,t.Fv)('<p><strong>注意：名字要相同</strong></p><p>官网的建议</p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ref<span class="token punctuation">,</span> onMounted <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>\n\n<span class="token keyword">const</span> el <span class="token operator">=</span> ref<span class="token operator">&lt;</span>HTMLInputElement <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span>\n\n<span class="token function">onMounted</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  el<span class="token punctuation">.</span>value<span class="token operator">?.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>el<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div>',3),i={href:"https://q10viking.github.io/minifrontendproject/28%20Increment%20Counter.html#increment-counter",target:"_blank",rel:"noopener noreferrer"},k=(0,t.Fv)('<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ref<span class="token punctuation">,</span> onMounted <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>\n<span class="token comment">// 定义</span>\n<span class="token keyword">const</span> tiktok <span class="token operator">=</span> ref<span class="token operator">&lt;</span>HTMLParamElement <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span>\n\n<span class="token function">onMounted</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 使用获取属性</span>\n  tiktok<span class="token punctuation">.</span>value<span class="token operator">?.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token string">&quot;data-target&quot;</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>item<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>font-awesome-icon</span> <span class="token attr-name">icon</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>fa-brands fa-tiktok<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>icon<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>counter<span class="token punctuation">&quot;</span></span> \n            <span class="token attr-name">data-target</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>23000<span class="token punctuation">&quot;</span></span>\n            <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>tiktok<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>   <span class="token comment">&lt;!-- 名字要相同 --&gt;</span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>Tiktok Fans<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div>',1),b={},m=(0,a(66262).A)(b,[["render",function(n,s){const a=(0,t.g2)("OutboundLink"),b=(0,t.g2)("common-progresson-snippet");return(0,t.uX)(),(0,t.CE)(t.FK,null,[p,(0,t.Lk)("p",null,[(0,t.Lk)("a",e,[(0,t.eW)("项目预览（Project view）"),(0,t.bF)(a)])]),(0,t.Lk)("p",null,[(0,t.Lk)("a",o,[(0,t.eW)("vanilla Source Code"),(0,t.bF)(a)])]),(0,t.Lk)("p",null,[(0,t.Lk)("a",c,[(0,t.eW)("Vue3+ts重构 Source Code"),(0,t.bF)(a)])]),(0,t.bF)(b,{src:"https://q10viking.github.io/Mini-FrontEnd-project/33%20Increment%20Counter/vite-project/dist/"}),l,(0,t.Lk)("p",null,[(0,t.Lk)("a",u,[(0,t.eW)("Template Ref"),(0,t.bF)(a)])]),r,(0,t.Lk)("p",null,[(0,t.eW)("自己的实战案例"),(0,t.Lk)("a",i,[(0,t.eW)("Increment Counter"),(0,t.bF)(a)])]),k],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,t]of s)a[n]=t;return a}}}]);
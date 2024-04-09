"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[68862],{21202:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-fd697334",path:"/vue3/01%20%E5%88%9B%E5%BB%BAtodolist.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/vue3/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"todoList",slug:"todolist",children:[]},{level:2,title:"vue应用分析",slug:"vue应用分析",children:[]}],filePathRelative:"vue3/01 创建todolist.md"}},31074:(n,s,a)=>{a.r(s),a.d(s,{default:()=>l});var p=a(20641);const t=(0,p.Fv)('<h2 id="todolist" tabindex="-1"><a class="header-anchor" href="#todolist" aria-hidden="true">#</a> todoList</h2><p>融合了一下vue的知识点</p><ol><li>vue的数据驱动</li><li>组件封装</li></ol><blockquote><p>vue引入到普通页面的方式</p></blockquote><details class="custom-container details"><summary>点击查看代码</summary><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>\n<span class="token keyword">const</span> app <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">inputValue</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue基础特性&#39;</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n    &lt;div&gt;\n      &lt;input v-model=&quot;inputValue&quot; /&gt;\n      &lt;button @click=&quot;handleAddItem&quot;&gt;增加&lt;/button&gt;\n      &lt;ul&gt;\n        &lt;todo-item v-for=&quot;(item,index) of items&quot;\n          :content=&quot;item&quot;\n          :index=&quot;index&quot;\n        /&gt;\n      &lt;/ul&gt;\n    &lt;/div&gt;\n  </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">handleAddItem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>inputValue <span class="token operator">===</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&quot;不能为空😊&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span> \n      <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>inputValue<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>inputValue <span class="token operator">=</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;todo-item&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>\n  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;content&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;index&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;li&gt;{{index}} ---  {{content}}&lt;/li&gt;</span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><br><br><br><br><div class="highlight-line"> </div></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div></details>',5),e=(0,p.Fv)('<h2 id="vue应用分析" tabindex="-1"><a class="header-anchor" href="#vue应用分析" aria-hidden="true">#</a> vue应用分析</h2><p>createApp 表示创建一个Vue应用，传入的参数表示，这个应用最外层的组件，应该如何展示，</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>app <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>采用mvvm设计模式，m-&gt;model数据，v-&gt;view视图，vm-&gt;viewModel视图数据连接层</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// vm代表的就是vue应用的根组件</span>\n<span class="token keyword">const</span> vm <span class="token operator">=</span> app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 可以通过vm.$data的方式来访问数据</span>\nvm<span class="token punctuation">.</span>$data<span class="token punctuation">.</span>inputValue\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>​</p><p><img src="/images/vue3/202111280616562.png" alt="202111280616562"></p>',7),o={},l=(0,a(66262).A)(o,[["render",function(n,s){const a=(0,p.g2)("common-codepen-snippet");return(0,p.uX)(),(0,p.CE)(p.FK,null,[t,(0,p.bF)(a,{title:"TodoList",slug:"ZEJgdzb"}),e],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
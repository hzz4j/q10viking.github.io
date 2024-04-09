"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[17248],{29389:(n,s,a)=>{a.r(s),a.d(s,{data:()=>t});const t={key:"v-b633fd44",path:"/javascript/16%20ES5%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/javascript/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"1 构造函数",slug:"_1-构造函数",children:[{level:3,title:"1.1 创建对象直接量",slug:"_1-1-创建对象直接量",children:[]},{level:3,title:"1.2 new Object()构造函数",slug:"_1-2-new-object-构造函数",children:[]},{level:3,title:"1.3 ES5 constructor function",slug:"_1-3-es5-constructor-function",children:[]},{level:3,title:"1.4 new 构造函数的过程",slug:"_1-4-new-构造函数的过程",children:[]}]},{level:2,title:"2 prototype原型",slug:"_2-prototype原型",children:[{level:3,title:"2.1 在该对象定义方法和属性",slug:"_2-1-在该对象定义方法和属性",children:[]},{level:3,title:"2.2 constructor原型",slug:"_2-2-constructor原型",children:[]},{level:3,title:"2.3 __proto__与propotype",slug:"_2-3-proto-与propotype",children:[]},{level:3,title:"2.4 原型链",slug:"_2-4-原型链",children:[]},{level:3,title:"2.5 propotype玩法",slug:"_2-5-propotype玩法",children:[]}]},{level:2,title:"3 继承",slug:"_3-继承",children:[{level:3,title:"3 .1 call方法",slug:"_3-1-call方法",children:[]},{level:3,title:"3.2 属性继承",slug:"_3-2-属性继承",children:[]},{level:3,title:"3.3. 方法继承",slug:"_3-3-方法继承",children:[]},{level:3,title:"3.5 Object.create 方法",slug:"_3-5-object-create-方法",children:[]}]}],filePathRelative:"javascript/16 ES5面向对象.md"}},4641:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const t=(0,a(20641).Fv)('<h2 id="_1-构造函数" tabindex="-1"><a class="header-anchor" href="#_1-构造函数" aria-hidden="true">#</a> 1 构造函数</h2><h3 id="_1-1-创建对象直接量" tabindex="-1"><a class="header-anchor" href="#_1-1-创建对象直接量" aria-hidden="true">#</a> 1.1 创建对象直接量</h3><h3 id="_1-2-new-object-构造函数" tabindex="-1"><a class="header-anchor" href="#_1-2-new-object-构造函数" aria-hidden="true">#</a> 1.2 new Object()构造函数</h3><h3 id="_1-3-es5-constructor-function" tabindex="-1"><a class="header-anchor" href="#_1-3-es5-constructor-function" aria-hidden="true">#</a> 1.3 ES5 constructor function</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">ObjectName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token keyword">this</span><span class="token punctuation">.</span>属性\n\t<span class="token keyword">this</span><span class="token punctuation">.</span>方法\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span>age</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">say</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Hello my name is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h4 id="_1-3-1-添加成员" tabindex="-1"><a class="header-anchor" href="#_1-3-1-添加成员" aria-hidden="true">#</a> 1.3.1 添加成员</h4><h5 id="_1-通过this添加实例成员" tabindex="-1"><a class="header-anchor" href="#_1-通过this添加实例成员" aria-hidden="true">#</a> 1 通过this添加实例成员</h5><h5 id="_2-通过构造方法添加静态成员" tabindex="-1"><a class="header-anchor" href="#_2-通过构造方法添加静态成员" aria-hidden="true">#</a> 2 通过构造方法添加静态成员</h5><h6 id="只能通过构造方法访问" tabindex="-1"><a class="header-anchor" href="#只能通过构造方法访问" aria-hidden="true">#</a> 只能通过构造方法访问</h6><h4 id="_1-3-2-添加方法" tabindex="-1"><a class="header-anchor" href="#_1-3-2-添加方法" aria-hidden="true">#</a> 1.3.2 添加方法</h4><ol><li>prototype添加方法</li></ol><h3 id="_1-4-new-构造函数的过程" tabindex="-1"><a class="header-anchor" href="#_1-4-new-构造函数的过程" aria-hidden="true">#</a> 1.4 new 构造函数的过程</h3><h4 id="_1-4-1-在内存中创建一个新的空对象" tabindex="-1"><a class="header-anchor" href="#_1-4-1-在内存中创建一个新的空对象" aria-hidden="true">#</a> 1.4.1 在内存中创建一个新的空对象{}</h4><h4 id="_1-4-2-让函数中的this指向这个空对象" tabindex="-1"><a class="header-anchor" href="#_1-4-2-让函数中的this指向这个空对象" aria-hidden="true">#</a> 1.4.2. 让函数中的this指向这个空对象</h4><h4 id="_1-4-3-开始执行函数体" tabindex="-1"><a class="header-anchor" href="#_1-4-3-开始执行函数体" aria-hidden="true">#</a> 1.4.3. 开始执行函数体</h4><h4 id="_1-4-4-返回该对象" tabindex="-1"><a class="header-anchor" href="#_1-4-4-返回该对象" aria-hidden="true">#</a> 1.4.4. 返回该对象</h4><h2 id="_2-prototype原型" tabindex="-1"><a class="header-anchor" href="#_2-prototype原型" aria-hidden="true">#</a> 2 prototype原型</h2><ol><li>每一个<strong>构造函数</strong>都有一个<strong>prototype对象</strong></li><li>Each object in Javascript has a prototype and a prototype is an object itself.</li></ol><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span>age</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">say</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Hello my name is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\nPerson<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span><span class="token string">&#39;name&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t<span class="token comment">//\ttrue;</span>\nPerson<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span><span class="token string">&#39;say&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t<span class="token comment">//\tfalse;</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="_2-1-在该对象定义方法和属性" tabindex="-1"><a class="header-anchor" href="#_2-1-在该对象定义方法和属性" aria-hidden="true">#</a> 2.1 在该对象定义方法和属性</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token class-name">ConstructorName</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 很重要，不能漏掉，否则会覆盖之前的prototype,数据丢失</span>\n\t<span class="token literal-property property">constructor</span><span class="token operator">:</span> ConstructorName<span class="token punctuation">,</span>\n\t<span class="token function-variable function">function1</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n\t<span class="token function-variable function">funciton2</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><ol><li>将来<strong>所有的实例都能共享</strong></li><li>节省了内存</li></ol><h3 id="_2-2-constructor原型" tabindex="-1"><a class="header-anchor" href="#_2-2-constructor原型" aria-hidden="true">#</a> 2.2 constructor原型</h3><ol><li>对应构造函数</li></ol><h3 id="_2-3-proto-与propotype" tabindex="-1"><a class="header-anchor" href="#_2-3-proto-与propotype" aria-hidden="true">#</a> 2.3 __proto__与propotype</h3><ol><li><strong>每一个对象</strong>都有一个 __proto__属性</li><li>实例的 __proto__指向构造函数的propotype</li></ol><p><img src="/images/javascript/image-20201018082323098.png" alt=""></p><h3 id="_2-4-原型链" tabindex="-1"><a class="header-anchor" href="#_2-4-原型链" aria-hidden="true">#</a> 2.4 原型链</h3><ol><li>new一个实例会产生一个实例对象，实例对象有__proto__属性</li></ol><p><img src="/images/javascript/image-20201018085219432.png" alt=""></p><h3 id="_2-5-propotype玩法" tabindex="-1"><a class="header-anchor" href="#_2-5-propotype玩法" aria-hidden="true">#</a> 2.5 propotype玩法</h3><h4 id="_2-5-1-vue设置对象" tabindex="-1"><a class="header-anchor" href="#_2-5-1-vue设置对象" aria-hidden="true">#</a> 2.5.1 Vue设置对象</h4><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// Vue原型上挂载axios</span>\nVue<span class="token punctuation">.</span>propotype<span class="token punctuation">.</span>$http <span class="token operator">=</span> axios\n<span class="token comment">// Vue原型上挂载elementui的Message组件</span>\nVue<span class="token punctuation">.</span>propotype<span class="token punctuation">.</span>$message <span class="token operator">=</span> Message\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="_3-继承" tabindex="-1"><a class="header-anchor" href="#_3-继承" aria-hidden="true">#</a> 3 继承</h2><h3 id="_3-1-call方法" tabindex="-1"><a class="header-anchor" href="#_3-1-call方法" aria-hidden="true">#</a> 3 .1 call方法</h3><ol><li>可以实现函数调用</li><li>可以改变函数中的this指向</li></ol><h3 id="_3-2-属性继承" tabindex="-1"><a class="header-anchor" href="#_3-2-属性继承" aria-hidden="true">#</a> 3.2 属性继承</h3><h3 id="_3-3-方法继承" tabindex="-1"><a class="header-anchor" href="#_3-3-方法继承" aria-hidden="true">#</a> 3.3. 方法继承</h3><p><img src="/images/javascript/image-20201018105907530.png" alt=""></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Father</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Father</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">getMoney</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Father money</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">Son</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//\t属性继承</span>\n    <span class="token function">Father</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">//\t方法继承</span>\n<span class="token class-name">Son</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token class-name">Father</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token class-name">Son</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor <span class="token operator">=</span> Son<span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> son <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Son</span><span class="token punctuation">(</span><span class="token string">&#39;hzz&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token doc-comment comment">/**\nSon <span class="token punctuation">{</span>name: &quot;hzz&quot;<span class="token punctuation">}</span>\nname: &quot;hzz&quot;\n__proto__: Father\n    constructor: ƒ Son(name)\n    __proto__: Object\n */</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>son<span class="token punctuation">)</span>\nson<span class="token punctuation">.</span><span class="token function">getMoney</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><hr><h3 id="_3-5-object-create-方法" tabindex="-1"><a class="header-anchor" href="#_3-5-object-create-方法" aria-hidden="true">#</a> 3.5 Object.create 方法</h3><ol><li>创建一个对象,方式1</li></ol><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> personPropotypes <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">language</span><span class="token operator">:</span> <span class="token string">&#39;js&#39;</span><span class="token punctuation">,</span>\n    <span class="token function-variable function">greeting</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Hello there </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>firstName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>lastName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> mary <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>personPropotypes<span class="token punctuation">)</span><span class="token punctuation">;</span>\nmary<span class="token punctuation">.</span>firstName <span class="token operator">=</span> <span class="token string">&#39;Mary&#39;</span><span class="token punctuation">;</span>\nmary<span class="token punctuation">.</span>lastName <span class="token operator">=</span> <span class="token string">&#39;Williams&#39;</span><span class="token punctuation">;</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mary<span class="token punctuation">.</span><span class="token function">greeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mary<span class="token punctuation">.</span>language<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><ol start="2"><li>创建一个对象，方式2</li></ol><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> personPropotypes <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">language</span><span class="token operator">:</span> <span class="token string">&#39;js&#39;</span><span class="token punctuation">,</span>\n    <span class="token function-variable function">greeting</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Hello there </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>firstName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>lastName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> mary <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>personPropotypes<span class="token punctuation">,</span><span class="token punctuation">{</span>\n    <span class="token literal-property property">firstName</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">&#39;Mary&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token literal-property property">lastName</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">&#39;Williams&#39;</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mary<span class="token punctuation">.</span><span class="token function">greeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mary<span class="token punctuation">.</span>language<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div>',47),p={},e=(0,a(66262).A)(p,[["render",function(n,s){return t}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,t]of s)a[n]=t;return a}}}]);
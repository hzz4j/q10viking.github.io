"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[22846],{82053:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-f474db36",path:"/concurrency/38%20HashMap%201.7%E5%B9%B6%E5%8F%91%E5%AE%89%E5%85%A8%E5%88%86%E6%9E%90.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Hashtable的数据结构",slug:"hashtable的数据结构",children:[{level:3,title:"JDK1.7",slug:"jdk1-7",children:[]},{level:3,title:"JDK1.8",slug:"jdk1-8",children:[]},{level:3,title:"HashMap的容量",slug:"hashmap的容量",children:[]}]},{level:2,title:"时间复杂度",slug:"时间复杂度",children:[{level:3,title:"取模之后hash碰撞",slug:"取模之后hash碰撞",children:[]}]},{level:2,title:"HashMap扩容原理",slug:"hashmap扩容原理",children:[{level:3,title:"重要成员变量",slug:"重要成员变量",children:[]},{level:3,title:"单线程扩容",slug:"单线程扩容",children:[]},{level:3,title:"❤️多线程扩容问题❤️",slug:"❤️多线程扩容问题❤️",children:[]}]},{level:2,title:"加载因子",slug:"加载因子",children:[]},{level:2,title:"循环链表案例",slug:"循环链表案例",children:[]},{level:2,title:"HashMap线程不安全的原因",slug:"hashmap线程不安全的原因",children:[]}],filePathRelative:"concurrency/38 HashMap 1.7并发安全分析.md"}},30662:(n,s,a)=>{a.r(s),a.d(s,{default:()=>t});const p=(0,a(20641).Fv)('<h2 id="hashtable的数据结构" tabindex="-1"><a class="header-anchor" href="#hashtable的数据结构" aria-hidden="true">#</a> Hashtable的数据结构</h2><h3 id="jdk1-7" tabindex="-1"><a class="header-anchor" href="#jdk1-7" aria-hidden="true">#</a> JDK1.7</h3><p>数组+链表</p><h3 id="jdk1-8" tabindex="-1"><a class="header-anchor" href="#jdk1-8" aria-hidden="true">#</a> JDK1.8</h3><p>数组+链表+红黑树</p><h3 id="hashmap的容量" tabindex="-1"><a class="header-anchor" href="#hashmap的容量" aria-hidden="true">#</a> HashMap的容量</h3><blockquote><div class="language-elm ext-elm line-numbers-mode"><pre class="language-elm"><code><span class="token constant">The</span> <span class="token hvariable">default</span> <span class="token hvariable">initial</span> <span class="token hvariable">capacity</span> <span class="token operator">-</span> <span class="token constant">MUST</span> <span class="token hvariable">be</span> <span class="token hvariable">a</span> <span class="token hvariable">power</span> <span class="token keyword">of</span> <span class="token hvariable">two</span><span class="token punctuation">.</span>\n<span class="token hvariable">static</span> <span class="token hvariable">final</span> <span class="token hvariable">int</span> <span class="token constant">DEFAULT_INITIAL_CAPACITY</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">4</span>;\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></blockquote><p>数组的大小</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> \t<span class="token comment">//\t默认大小是16 </span>\n<span class="token constant">DEFAULT_INITIAL_CAPACITY</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token operator">&lt;&lt;</span><span class="token number">4</span><span class="token punctuation">;</span>\n\n<span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> \t<span class="token comment">//\t自定义初始容量</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>如果传入进来的不是2的幂次方，那么会通过roundUpToPowerOf2(size)，转化规则</p><ol><li>必须是最接近size,11</li><li>必须大于size</li><li>是2的指数次幂</li></ol><p>为什么是2的指数次幂呢？</p><p>进行的位运算，为了让hash更加的散列</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code>  <span class="token number">264</span>       <span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">hash</span><span class="token punctuation">(</span><span class="token keyword">int</span> h<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token number">265</span>           <span class="token comment">// This function ensures that hashCodes that differ only by</span>\n  <span class="token number">266</span>           <span class="token comment">// constant multiples at each bit position have a bounded</span>\n  <span class="token number">267</span>           <span class="token comment">// number of collisions (approximately 8 at default load factor).</span>\n  <span class="token number">268</span>           h <span class="token operator">^=</span> <span class="token punctuation">(</span>h <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">20</span><span class="token punctuation">)</span> <span class="token operator">^</span> <span class="token punctuation">(</span>h <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token number">269</span>           <span class="token keyword">return</span> h <span class="token operator">^</span> <span class="token punctuation">(</span>h <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">7</span><span class="token punctuation">)</span> <span class="token operator">^</span> <span class="token punctuation">(</span>h <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token number">270</span>       <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>然后计算index索引</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">indexFor</span><span class="token punctuation">(</span><span class="token keyword">int</span> h<span class="token punctuation">,</span><span class="token keyword">int</span> length<span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token keyword">return</span> h <span class="token operator">&amp;</span> <span class="token punctuation">(</span>length<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\nh <span class="token operator">=</span> \n    <span class="token number">0001</span> <span class="token number">0101</span> <span class="token number">0110</span> <span class="token number">0010</span> <span class="token number">1101</span> \n    <span class="token number">0000</span> <span class="token number">0000</span> <span class="token number">0000</span> <span class="token number">0001</span> <span class="token number">0000</span>  <span class="token comment">// 不减一最终得出的结果不是16就是0</span>\n    \n    <span class="token number">0001</span> <span class="token number">0101</span> <span class="token number">0110</span> <span class="token number">0010</span> <span class="token number">1101</span>  <span class="token comment">// 减一的情况</span>\n    <span class="token number">0000</span> <span class="token number">0000</span> <span class="token number">0000</span> <span class="token number">0000</span> <span class="token number">1111</span>  <span class="token comment">// 能够确保后面&amp;的结果</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="时间复杂度" tabindex="-1"><a class="header-anchor" href="#时间复杂度" aria-hidden="true">#</a> 时间复杂度</h2><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code>get<span class="token punctuation">,</span>put的时间复杂度都是<span class="token class-name">O</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>key.hashCode 是不确定的，有符号的整型值</p><p>key.hashCode % 16 = [0- 15] = index = 3</p><p>hash并不是用取模计算index的，而是用位运算，因为位运算的效率高于取模</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BitAndModulus</span> <span class="token punctuation">{</span>\n\n    <span class="token annotation punctuation">@Test</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">bit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> number <span class="token operator">=</span> <span class="token number">100</span> <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">;</span><span class="token comment">//分别取值10万、100万、1000万、1亿</span>\n        <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> number<span class="token punctuation">;</span> i <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            a <span class="token operator">=</span> a <span class="token operator">&amp;</span> i<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;位运算耗时： &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n\n    <span class="token annotation punctuation">@Test</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">modulus</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> number <span class="token operator">=</span> <span class="token number">100</span> <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">;</span><span class="token comment">//分别取值10万、100万、1000万、1亿</span>\n        <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> number<span class="token punctuation">;</span> i <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            a <span class="token operator">%=</span> i<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;取模运算耗时： &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n 位运算耗时： 698\n 取模运算耗时： 15669\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><p><img src="/images/concurrency/image-20210630011054625.png" alt="image-20210630011054625"></p><h3 id="取模之后hash碰撞" tabindex="-1"><a class="header-anchor" href="#取模之后hash碰撞" aria-hidden="true">#</a> 取模之后hash碰撞</h3><p>为了解决hash冲突，引入了链表，采用头部插入法</p><p><img src="/images/concurrency/image-20210630011531634.png" alt="image-20210630011531634"></p><h2 id="hashmap扩容原理" tabindex="-1"><a class="header-anchor" href="#hashmap扩容原理" aria-hidden="true">#</a> HashMap扩容原理</h2><h3 id="重要成员变量" tabindex="-1"><a class="header-anchor" href="#重要成员变量" aria-hidden="true">#</a> 重要成员变量</h3><ul><li>DEFAULT_INITIAL_CAPACITY = 1 &lt;&lt; 4; Hash表默认初始容量</li><li>MAXIMUM_CAPACITY = 1 &lt;&lt; 30; 最大Hash表容量</li><li>DEFAULT_LOAD_FACTOR = 0.75f；默认加载因子</li><li>TREEIFY_THRESHOLD = 8；<strong>链表转红黑树阈值</strong></li><li>UNTREEIFY_THRESHOLD = 6；红黑树转链表阈值</li><li>MIN_TREEIFY_CAPACITY = 64；链表转红黑树时hash表最小容量阈值，达不到优先扩容。</li></ul><p>threshold扩容阈值 = capacity * 扩容比率 0.75 = 16 * 0.75 = 12</p><p>扩容为原来的2倍（2的指数幂）</p><p>扩容之后，transfer移动元素</p><blockquote><p>在转移的过程中，会把原来的链表顺序颠倒过来存储到新的HashMap中</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">void</span> <span class="token function">transfer</span><span class="token punctuation">(</span><span class="token class-name">Entry</span><span class="token punctuation">[</span><span class="token punctuation">]</span> newTable<span class="token punctuation">,</span> <span class="token keyword">boolean</span> rehash<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> newCapacity <span class="token operator">=</span> newTable<span class="token punctuation">.</span>length<span class="token punctuation">;</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> e <span class="token operator">:</span> table<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> next <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">;</span>\n                <span class="token keyword">if</span> <span class="token punctuation">(</span>rehash<span class="token punctuation">)</span> <span class="token punctuation">{</span> \n                    e<span class="token punctuation">.</span>hash <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token operator">==</span> e<span class="token punctuation">.</span>key <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> <span class="token function">hash</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//再一次进行hash计算？</span>\n                <span class="token punctuation">}</span>\n                <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token function">indexFor</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash<span class="token punctuation">,</span> newCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                e<span class="token punctuation">.</span>next <span class="token operator">=</span> newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\t<span class="token comment">//\t链表的头插法</span>\n                newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span>\n                e <span class="token operator">=</span> next<span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="单线程扩容" tabindex="-1"><a class="header-anchor" href="#单线程扩容" aria-hidden="true">#</a> 单线程扩容</h3><p>**假设：**hash算法就是简单的key与length(数组长度)求余。hash表长度为2，如果不扩容， 那么元素key为3,5,7按照计算(key%table.length)的话都应该碰撞到table[1]上。</p><p>**扩容：**hash表长度会扩容为4重新hash，key=3 会落到table[3]上(3%4=3)， 当前e.next为key(7), 继续while循环重新hash，key=7 会落到table[3]上(7%4=3), 产生碰撞， 这里采用的是头插入法，所以key=7的Entry会排在key=3前面(这里可以具体看while语句中代码)当前e.next为key(5), 继续while循环重新hash，key=5 会落到table[1]上(5%4=1)， 当前e.next为null, 跳出while循环，resize结束。</p><p><img src="/images/concurrency/4136singleThread.png" alt="img"></p><h3 id="❤️多线程扩容问题❤️" tabindex="-1"><a class="header-anchor" href="#❤️多线程扩容问题❤️" aria-hidden="true">#</a> ❤️多线程扩容问题❤️</h3><p><strong>如thread1,thread2同时进行扩容，next指向并不一定就是元素的next指向的元素（头插法的原因），最终在整个移动元素的过程中会出现循环链表。因为每个线程都会创建一个新的数组</strong></p><p><strong>当形成环之后，再往里面put，元素时，恰好此时插入的元素有hash碰撞，由于需要遍历整个链表是否存在该元素，但是该链表是循环链表，导致一直再循环，出不来</strong></p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> next <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">;</span><span class="token comment">//第一行，线程1执行到此被调度挂起</span>\n      <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token function">indexFor</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash<span class="token punctuation">,</span> newCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//第二行</span>\n      e<span class="token punctuation">.</span>next <span class="token operator">=</span> newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">//第三行</span>\n      newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span><span class="token comment">//第四行</span>\n      e <span class="token operator">=</span> next<span class="token punctuation">;</span><span class="token comment">//第五行</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><img src="/images/concurrency/image-20210630133258242.png" alt="image-20210630133258242"></p><h4 id="具体过程" tabindex="-1"><a class="header-anchor" href="#具体过程" aria-hidden="true">#</a> 具体过程</h4><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> next <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">;</span><span class="token comment">//第一行，线程1执行到此被调度挂起</span>\n      <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token function">indexFor</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash<span class="token punctuation">,</span> newCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//第二行</span>\n      e<span class="token punctuation">.</span>next <span class="token operator">=</span> newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">//第三行</span>\n      newTable<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span><span class="token comment">//第四行</span>\n      e <span class="token operator">=</span> next<span class="token punctuation">;</span><span class="token comment">//第五行</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>那么此时状态为</p><p><img src="/images/concurrency/4148-1.png" alt="img"></p><p>从上面的图我们可以看到，因为线程1的 e 指向了 key(3)，而 next 指向了 key(7)，在线程2 rehash 后，就指向了线程2 rehash 后的链表。</p><p>然后线程1被唤醒了：</p><ol><li>执行e.next = newTable[i]，于是 key(3)的 next 指向了线程1的新 Hash 表，因为新 Hash 表为空，所以e.next = null</li><li>执行newTable[i] = e，所以线程1的新 Hash 表第一个元素指向了线程2新 Hash 表的 key(3)。好了，e 处理完毕。</li><li>执行e = next，将 e 指向 next，所以新的 e 是 key(7)</li></ol><p>然后该执行 key(3)的 next 节点 key(7)了:</p><ol><li>现在的 e 节点是 key(7)，首先执行Entry next = e.next,那么 next 就是 key(3)了</li><li>执行e.next = newTable[i]，于是key(7) 的 next 就成了 key(3)</li><li>执行newTable[i] = e，那么线程1的新 Hash 表第一个元素变成了 key(7)</li><li>执行e = next，将 e 指向 next，所以新的 e 是 key(3)</li></ol><p>此时状态为：</p><img src="/images/concurrency/4153-1.png" alt="img" style="zoom:50%;"><p>然后又该执行 key(7)的 next 节点 key(3)了：</p><ol><li>现在的 e 节点是 key(3)，首先执行Entry next = e.next,那么 next 就是 null</li><li>执行e.next = newTable[i]，于是key(3) 的 next 就成了 key(7)</li><li>执行newTable[i] = e，那么线程1的新 Hash 表第一个元素变成了 key(3)</li><li>执行e = next，将 e 指向 next，所以新的 e 是 key(7)</li></ol><p>这时候的状态如图所示：</p><img src="/images/concurrency/4156-1.png" alt="img" style="zoom:50%;"><p>很明显，环形链表出现了。</p><h2 id="加载因子" tabindex="-1"><a class="header-anchor" href="#加载因子" aria-hidden="true">#</a> 加载因子</h2><p>loadfactor = 0.75 为什么不是0.5？</p><blockquote><p>As a general rule, the default load factor (.75) offers a good tradeoff between time and space costs</p></blockquote><h2 id="循环链表案例" tabindex="-1"><a class="header-anchor" href="#循环链表案例" aria-hidden="true">#</a> 循环链表案例</h2><blockquote><p>JDK1.7情况下,会产生循环链表，导致程序一直运行</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MapDeadLock</span> <span class="token punctuation">{</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">&lt;</span><span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MultiThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MultiThread</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">AtomicInteger</span> atomicInteger <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>atomicInteger<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">1000000</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>atomicInteger<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>atomicInteger<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            atomicInteger<span class="token punctuation">.</span><span class="token function">incrementAndGet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="hashmap线程不安全的原因" tabindex="-1"><a class="header-anchor" href="#hashmap线程不安全的原因" aria-hidden="true">#</a> HashMap线程不安全的原因</h2><ol><li>JDK1.7扩容多线程出现循环链表</li><li>JDK1.8和JDK1.7在put元素的时候，在多线程的情况下会产生数据丢失情况</li></ol><p><img src="/images/concurrency/image-20210630155701579.png" alt="image-20210630155701579"></p>',69),e={},t=(0,a(66262).A)(e,[["render",function(n,s){return p}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
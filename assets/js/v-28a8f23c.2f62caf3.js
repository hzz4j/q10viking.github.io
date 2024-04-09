"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[87947],{54549:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-28a8f23c",path:"/concurrency/48%20ThreadLocal.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"ThreadLocal",slug:"threadlocal",children:[]},{level:2,title:"实现原理",slug:"实现原理",children:[]},{level:2,title:"内存泄漏",slug:"内存泄漏",children:[{level:3,title:"分析",slug:"分析",children:[]},{level:3,title:"小结",slug:"小结",children:[]}]},{level:2,title:"initialValue的使用",slug:"initialvalue的使用",children:[]},{level:2,title:"应用",slug:"应用",children:[]}],filePathRelative:"concurrency/48 ThreadLocal.md"}},67094:(n,s,a)=>{a.r(s),a.d(s,{default:()=>m});var p=a(20641);const t=(0,p.Fv)('<h2 id="threadlocal" tabindex="-1"><a class="header-anchor" href="#threadlocal" aria-hidden="true">#</a> ThreadLocal</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>ThreadLocal是Java中所提供的线程本地存储机制，可以利⽤该机制将数据缓存在某个线程内部，该线 程可以在任意时刻、任意⽅法中获取缓存的数据。</p></div><blockquote><p>ThreadLocal为每个线程都提供了变量的副本，使得每个线程在某一时间访问到的并非同一个对象，这样就隔离了多个线程对数据的数据共享。</p></blockquote><p>ThreadLocal和Synchonized都用于解决多线程并发访问。可是ThreadLocal与synchronized有本质的差别。synchronized是利用锁的机制，使变量或代码块在某一时该仅仅能被一个线程访问，ThreadLocal则是副本机制。此时不论多少线程并发访问都是线程安全的</p><p><img src="/images/concurrency/image-20230303191241368.png" alt="image-20230303191241368"></p><blockquote><p>线程的隔离线程</p></blockquote>',6),e={href:"https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/UseThreadLocal.java",target:"_blank",rel:"noopener noreferrer"},c=(0,p.Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UseThreadLocal</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 设置为静态防止被gc回收掉，同理线程池使用也是</span>\n    <span class="token keyword">static</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> threadLocal1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">static</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> threadLocal2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">TestThread</span> <span class="token keyword">extends</span> <span class="token class-name">Thread</span><span class="token punctuation">{</span>\n        <span class="token keyword">int</span> id<span class="token punctuation">;</span>\n        <span class="token keyword">public</span> <span class="token class-name">TestThread</span><span class="token punctuation">(</span><span class="token keyword">int</span> id<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> id<span class="token punctuation">;</span><span class="token punctuation">}</span>\n        <span class="token annotation punctuation">@Override</span>\n        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> threadName <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            threadLocal1<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&quot;线程__&quot;</span><span class="token operator">+</span>threadName<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">if</span><span class="token punctuation">(</span>id <span class="token operator">==</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                threadLocal2<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>threadName<span class="token operator">+</span><span class="token string">&quot;:&quot;</span><span class="token operator">+</span>threadLocal1<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>threadName<span class="token operator">+</span><span class="token string">&quot;:&quot;</span><span class="token operator">+</span>threadLocal2<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">startThreadArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>i <span class="token operator">&lt;</span> <span class="token number">3</span> <span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">new</span> <span class="token class-name">TestThread</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">UseThreadLocal</span> useThreadLocal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">UseThreadLocal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        useThreadLocal<span class="token punctuation">.</span><span class="token function">startThreadArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n * Thread-0:线程__Thread-0\n * Thread-0:null\n * Thread-2:线程__Thread-2\n * Thread-1:线程__Thread-1\n * Thread-1:null\n * Thread-2:2\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div><h2 id="实现原理" tabindex="-1"><a class="header-anchor" href="#实现原理" aria-hidden="true">#</a> 实现原理</h2><p>ThreadLocal底层是通过ThreadLocalMap来实现的，每个Thread对象（注意不是ThreadLocal 对象）中都存在⼀个ThreadLocalMap，Map的key为ThreadLocal对象，Map的value为需要缓 存的值</p><p>get方法，其实就是拿到<strong>每个线程独有的ThreadLocalMap</strong>，然后再用ThreadLocal的当前实例，拿到Map中的相应的Entry，然后就可以拿到相应的值返回出去。当然，如果Map为空，还会先进行map的创建，初始化等工作</p><p><img src="/images/concurrency/10751" alt="img"></p><h2 id="内存泄漏" tabindex="-1"><a class="header-anchor" href="#内存泄漏" aria-hidden="true">#</a> 内存泄漏</h2><p>如果在线程池中使⽤ThreadLocal会造成内存泄漏，因为当ThreadLocal对象使⽤完之后，应该 要把设置的key，value，也就是Entry对象进⾏回收，但<strong>线程池中的线程不会回收，⽽线程对象 是通过强引⽤指向ThreadLocalMap，ThreadLocalMap也是通过强引⽤指向Entry对象，线程 不被回收，Entry对象也就不会被回收，从⽽出现内存泄漏，解决办法是，在使⽤了 ThreadLocal对象之后，⼿动调⽤ThreadLocal的remove⽅法，⼿动清楚Entry对象</strong></p>',7),o={href:"https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/leak/MemoryLeakDemo.java",target:"_blank",rel:"noopener noreferrer"},l=(0,p.Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MemoryLeakDemo</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">TASK_SIZE</span> <span class="token operator">=</span> <span class="token number">500</span><span class="token punctuation">;</span>\n    <span class="token doc-comment comment">/**线程池*/</span>\n    <span class="token keyword">final</span> <span class="token keyword">static</span> <span class="token class-name">Executor</span> excutor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span>\n            <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">,</span>\n            <span class="token keyword">new</span> <span class="token class-name">LinkedBlockingDeque</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">private</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">LocalVariable</span><span class="token punctuation">&gt;</span></span> threadLocal<span class="token punctuation">;</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">LocalVariable</span><span class="token punctuation">{</span>\n        <span class="token keyword">private</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> a <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token operator">*</span><span class="token number">1024</span><span class="token operator">*</span><span class="token number">1024</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 5M</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">&lt;</span><span class="token constant">TASK_SIZE</span><span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            excutor<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token punctuation">{</span>\n                <span class="token class-name">MemoryLeakDemo</span> oom <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MemoryLeakDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                oom<span class="token punctuation">.</span>threadLocal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                oom<span class="token punctuation">.</span>threadLocal<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">LocalVariable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token comment">// 线程池的线程不会结束，所以需要手动释放空间</span>\n                oom<span class="token punctuation">.</span>threadLocal<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><blockquote><p>没有remove的内存</p></blockquote><p><img src="/images/concurrency/image-20230304170535718.png" alt="image-20230304170535718"></p><blockquote><p>remove后的内存</p></blockquote><p><img src="/images/concurrency/image-20230304170452344.png" alt="image-20230304170452344"></p><h3 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h3><blockquote><p>ThreadLocal内存泄漏的根源是：由于ThreadLocalMap的生命周期跟Thread一样长，如果没有手动删除对应key就会导致内存泄漏</p></blockquote><p>每个Thread 维护一个 ThreadLocalMap，这个映射表的 key 是 ThreadLocal实例本身，value 是真正需要存储的 Object，也就是说 ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。仔细观察ThreadLocalMap，这个map是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。</p><p><img src="/images/concurrency/10766" alt="img"></p><p>当把threadlocal变量置为null以后，没有任何强引用指向threadlocal实例，所以threadlocal将会被gc回收。这样一来，ThreadLocalMap中就会出现key为null的Entry，就没有办法访问这些key为null的Entry的value，如果当前线程再迟迟不结束的话，这些key为null的Entry的value就会一直存在一条强引用链：Thread Ref -&gt; Thread -&gt; ThreaLocalMap -&gt; Entry -&gt; value，而这块value永远不会被访问到了，所以存在着内存泄露</p><p><img src="/images/concurrency/image-20230304170828601.png" alt="image-20230304170828601"></p><h3 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h3><ol><li>JVM利用设置ThreadLocalMap的Key为弱引用，来避免内存泄露。</li><li>JVM利用调用remove，回收弱引用。</li><li>使用<strong>线程池+</strong> ThreadLocal时要小心，因为这种情况下，线程是一直在不断的重复运行的，从而也就造成了value可能造成累积的情况。</li></ol><h2 id="initialvalue的使用" tabindex="-1"><a class="header-anchor" href="#initialvalue的使用" aria-hidden="true">#</a> initialValue的使用</h2><blockquote><p>ThreadLocal是变量的副本，但是Number是在堆上分配的，所有的引用都是一个对象</p></blockquote>',15),u={href:"https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/ThreadLocalUnsafe.java",target:"_blank",rel:"noopener noreferrer"},r=(0,p.Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ThreadLocalUnsafe</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Number</span> number <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Number</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Number</span><span class="token punctuation">&gt;</span></span> threadLocal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token punctuation">{</span>\n                <span class="token class-name">ThreadLocalRandom</span> current <span class="token operator">=</span> <span class="token class-name">ThreadLocalRandom</span><span class="token punctuation">.</span><span class="token function">current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                number<span class="token punctuation">.</span><span class="token function">setNumber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                threadLocal<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">try</span> <span class="token punctuation">{</span>\n                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token operator">*</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span>\n                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s = %s&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n                        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>threadLocal<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n * Thread-0 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n * Thread-4 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n * Thread-3 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n * Thread-1 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n * Thread-2 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div>',1),i={href:"https://github.com/Q10Viking/learncode/blob/main/concurrency/src/main/java/org/hzz/tl/ThreadLocalUnsafe1.java",target:"_blank",rel:"noopener noreferrer"},k=(0,p.Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ThreadLocalUnsafe1</span> <span class="token punctuation">{</span>\n<span class="token comment">//    private static Number number = new Number(0);</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Number</span><span class="token punctuation">&gt;</span></span> threadLocal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token comment">// 初始化</span>\n        <span class="token annotation punctuation">@Override</span>\n        <span class="token keyword">protected</span> <span class="token class-name">Object</span> <span class="token function">initialValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Number</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token punctuation">{</span>\n                <span class="token class-name">ThreadLocalRandom</span> current <span class="token operator">=</span> <span class="token class-name">ThreadLocalRandom</span><span class="token punctuation">.</span><span class="token function">current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token comment">// 初始化</span>\n                <span class="token class-name">Number</span> number <span class="token operator">=</span> threadLocal<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                number<span class="token punctuation">.</span><span class="token function">setNumber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                threadLocal<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">try</span> <span class="token punctuation">{</span>\n                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token operator">*</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span>\n                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s = %s&quot;</span><span class="token operator">+</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">lineSeparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n                        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>threadLocal<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n * Thread-1 = Number<span class="token punctuation">{</span>number=83<span class="token punctuation">}</span>\n * Thread-3 = Number<span class="token punctuation">{</span>number=76<span class="token punctuation">}</span>\n * Thread-2 = Number<span class="token punctuation">{</span>number=28<span class="token punctuation">}</span>\n * Thread-4 = Number<span class="token punctuation">{</span>number=25<span class="token punctuation">}</span>\n * Thread-0 = Number<span class="token punctuation">{</span>number=33<span class="token punctuation">}</span>\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br></div></div><h2 id="应用" tabindex="-1"><a class="header-anchor" href="#应用" aria-hidden="true">#</a> 应用</h2><p>ThreadLocal的一大应用场景就是<strong>跨方法进行参数传递</strong>，比如Web容器中，每个完整的请求周期会由一个线程来处理。结合ThreadLocal再使用Spring里的IOC和AOP，就可以很好的解决我们上面的事务的问题。只要将一个数据库连接放入ThreadLocal中，当前线程执行时只要有使用数据库连接的地方就从ThreadLocal获得就行了。</p><p>再比如，在微服务领域，链路跟踪中的traceId传递也是利用了ThreadLocal。</p><p>再比如：ThreadLocal经典的应⽤场景就是连接管理（⼀个线程持有⼀个连接，该连接对象可以在不同的⽅法之 间进⾏传递，线程之间不共享同⼀个连接）</p><p><img src="/images/concurrency/image-20230303191310260.png" alt="image-20230303191310260"></p>',6),b={},m=(0,a(66262).A)(b,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[t,(0,p.Lk)("p",null,[(0,p.Lk)("a",e,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),c,(0,p.Lk)("p",null,[(0,p.Lk)("a",o,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),l,(0,p.Lk)("p",null,[(0,p.Lk)("a",u,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),r,(0,p.Lk)("p",null,[(0,p.eW)("使用initialValue来解决"),(0,p.Lk)("a",i,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),k],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
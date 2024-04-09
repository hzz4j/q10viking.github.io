"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[22964],{73161:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-5850806b",path:"/concurrency/18%20CAS%E6%97%A0%E9%94%81%E7%AE%97%E6%B3%95.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"CAS算法",slug:"cas算法",children:[{level:3,title:"CAS的过程举例",slug:"cas的过程举例",children:[]}]},{level:2,title:"CAS的实现Unsafe支持",slug:"cas的实现unsafe支持",children:[{level:3,title:"Unsafe实现CAS",slug:"unsafe实现cas",children:[]}]}],filePathRelative:"concurrency/18 CAS无锁算法.md"}},28283:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(20641).Fv)('<h2 id="cas算法" tabindex="-1"><a class="header-anchor" href="#cas算法" aria-hidden="true">#</a> CAS算法</h2><p>为了保证共享的资源在并发访问时的数据安全。除了对共享资源进行加锁以外，还可以使用CAS无锁算法。</p><p>CAS（Compare And Swap）<strong>是一种乐观的并发控制机制</strong>，它的核心原理是基于硬件层面的原子性保证。CAS操作包含三个操作数——内存位置（V）、预期原值（A）和新值（B）。它的<strong>工作原理</strong>是：</p><ol><li>在将新值写入内存之前，CAS操作会先比较内存位置的值是否与预期原值相匹配。</li><li>如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置的值更新为新值。</li><li>如果内存位置的值与预期原值不匹配，则CAS操作失败，不会修改内存值。</li></ol><p><strong>CAS的优势在于它没有阻塞状态，不会引起线程上下文的切换和调度问题。<strong>然而，CAS也存在一些缺点，例如</strong>ABA问题和开销问题</strong>。ABA问题是指一个值原来是A，变成了B，又变成了A，那么使用CAS进行检查时会发现它的值没有发生变化，但是实际上却变化了。开销问题则是因为CAS自旋操作需要不断轮询内存位置，直到成功为止，这会消耗大量的CPU资源。</p><p><strong>CAS 比较和交换是一个原子操作</strong></p><h3 id="cas的过程举例" tabindex="-1"><a class="header-anchor" href="#cas的过程举例" aria-hidden="true">#</a> CAS的过程举例</h3><p>两个线程读取一个变量，然后同时进行修改</p><ol><li>此时threadB进行修改，将值变成了1</li></ol><p><img src="/images/concurrency/image-20210621003240611.png" alt="image-20210621003240611"></p><ol start="2"><li>此时threadA准备去修改为2，但是expect的值已经不是当初threadA读取的值了，被threadB修改过，发生了变化。则放弃此次修改。</li></ol><p><img src="/images/concurrency/image-20210621003625624.png" alt="image-20210621003625624"></p><ol start="3"><li>threadA需要重新读取主内存的值，然后计算，刷新会主存中 <img src="/images/concurrency/image-20210621003940765.png" alt="image-20210621003940765"></li></ol><hr><h2 id="cas的实现unsafe支持" tabindex="-1"><a class="header-anchor" href="#cas的实现unsafe支持" aria-hidden="true">#</a> CAS的实现Unsafe支持</h2><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">//\t对象，偏移量，oldValue,newValue   </span>\n<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">boolean</span> <span class="token function">compareAndSwapObject</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">,</span> <span class="token class-name">Object</span> var4<span class="token punctuation">,</span> <span class="token class-name">Object</span> var5<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">boolean</span> <span class="token function">compareAndSwapInt</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">,</span> <span class="token keyword">int</span> var4<span class="token punctuation">,</span> <span class="token keyword">int</span> var5<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">boolean</span> <span class="token function">compareAndSwapLong</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">,</span> <span class="token keyword">long</span> var4<span class="token punctuation">,</span> <span class="token keyword">long</span> var6<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>底层是需要汇编指令cmpxchg</p><h3 id="unsafe实现cas" tabindex="-1"><a class="header-anchor" href="#unsafe实现cas" aria-hidden="true">#</a> Unsafe实现CAS</h3><p>可以看到5个线程的并发执行，最终只有一个线程抢到了锁</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UnsafeInstance</span> <span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Unsafe</span> <span class="token function">reflectGetUnsafe</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n            <span class="token class-name">Field</span> field <span class="token operator">=</span> <span class="token class-name">Unsafe</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;theUnsafe&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            field<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Unsafe</span><span class="token punctuation">)</span> field<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Juc04_Thread_Cas</span> <span class="token punctuation">{</span>\n    <span class="token doc-comment comment">/**\n     * 当前加锁状态,记录加锁的次数\n     */</span>\n    <span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span> state <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">CyclicBarrier</span> cyclicBarrier <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CyclicBarrier</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Juc04_Thread_Cas</span> cas <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Juc04_Thread_Cas</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Unsafe</span> unsafe <span class="token operator">=</span> <span class="token class-name">UnsafeInstance</span><span class="token punctuation">.</span><span class="token function">reflectGetUnsafe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">//  偏移量</span>\n    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> stateOffset<span class="token punctuation">;</span>\n\n    <span class="token keyword">static</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n            <span class="token comment">//  获取到偏移量</span>\n            stateOffset <span class="token operator">=</span> unsafe<span class="token punctuation">.</span><span class="token function">objectFieldOffset</span><span class="token punctuation">(</span><span class="token class-name">Juc04_Thread_Cas</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;state&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    \n    <span class="token doc-comment comment">/**\n     * 原子操作\n     * <span class="token keyword">@param</span> <span class="token parameter">oldValue</span>\n     *        oldvalue:线程工作内存当中的值\n     * <span class="token keyword">@param</span>\n     *        newValue:要替换的新值\n     * <span class="token keyword">@return</span>\n     */</span>\n    <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">compareAndSwapState</span><span class="token punctuation">(</span><span class="token keyword">int</span> oldValue<span class="token punctuation">,</span><span class="token keyword">int</span> newValue<span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> unsafe<span class="token punctuation">.</span><span class="token function">compareAndSwapInt</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span>stateOffset<span class="token punctuation">,</span>oldValue<span class="token punctuation">,</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;t-0&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;t-1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;t-2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;t-3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;t-4&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Worker</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span><span class="token punctuation">{</span>\n        <span class="token annotation punctuation">@Override</span>\n        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;请求:{}到达预定点,准备开始抢state:)&quot;</span><span class="token punctuation">,</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">try</span> <span class="token punctuation">{</span>\n                <span class="token comment">//  线程栅栏，使得线程同时运行</span>\n                cyclicBarrier<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">if</span><span class="token punctuation">(</span>cas<span class="token punctuation">.</span><span class="token function">compareAndSwapState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n                    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;当前请求:{},抢到锁!&quot;</span><span class="token punctuation">,</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>\n                    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;当前请求:{},抢锁失败!&quot;</span><span class="token punctuation">,</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span><span class="token operator">|</span><span class="token class-name">BrokenBarrierException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n 00:48:42.271 [t-3] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-3到达预定点,准备开始抢state:)\n 00:48:42.271 [t-4] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-4到达预定点,准备开始抢state:)\n 00:48:42.271 [t-0] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-0到达预定点,准备开始抢state:)\n 00:48:42.271 [t-2] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-2到达预定点,准备开始抢state:)\n 00:48:42.271 [t-1] INFO com.yg.edu.lock.Juc04_Thread_Cas - 请求:t-1到达预定点,准备开始抢state:)\n 00:48:42.276 [t-1] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-1,抢到锁!\n 00:48:42.277 [t-4] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-4,抢锁失败!\n 00:48:42.277 [t-3] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-3,抢锁失败!\n 00:48:42.277 [t-0] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-0,抢锁失败!\n 00:48:42.277 [t-2] INFO com.yg.edu.lock.Juc04_Thread_Cas - 当前请求:t-2,抢锁失败!\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br></div></div>',21),t={},e=(0,a(66262).A)(t,[["render",function(n,s){return p}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[11117],{21862:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-2c9db48e",path:"/concurrency/17%20AQS%E8%AF%A6%E8%A7%A32.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Node",slug:"node",children:[{level:3,title:"waitStatus",slug:"waitstatus",children:[]},{level:3,title:"CAS在Node入队CLH时的操作",slug:"cas在node入队clh时的操作",children:[]}]},{level:2,title:"阻塞入队后的线程",slug:"阻塞入队后的线程",children:[{level:3,title:"首先尝试去获取锁",slug:"首先尝试去获取锁",children:[]},{level:3,title:"阻塞线程",slug:"阻塞线程",children:[]}]},{level:2,title:"释放锁",slug:"释放锁",children:[]},{level:2,title:"多线程AQS流程图",slug:"多线程aqs流程图",children:[]}],filePathRelative:"concurrency/17 AQS详解2.md"}},16848:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(20641).Fv)('<div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Juc04_Thread_ReentrantLock</span> <span class="token punctuation">{</span>\n    <span class="token doc-comment comment">/**\n     * 可重入锁，怎么实现类似于synchronized的功能\n     */</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ReentrantLock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">boolean</span> flag <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">&lt;</span><span class="token number">10</span><span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token punctuation">{</span>\n                lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">//  没有抢到锁的就会在AQS的队列中进行排队</span>\n                <span class="token comment">//  抢到锁的线程就执行下面的代码</span>\n                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot;get lock&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>flag<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                        <span class="token keyword">if</span><span class="token punctuation">(</span>flag<span class="token punctuation">)</span><span class="token punctuation">{</span>\n                            <span class="token keyword">break</span><span class="token punctuation">;</span>\n                        <span class="token punctuation">}</span>\n                    <span class="token punctuation">}</span>\n                lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token string">&quot;t-&quot;</span><span class="token operator">+</span>i<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><hr><h2 id="node" tabindex="-1"><a class="header-anchor" href="#node" aria-hidden="true">#</a> Node</h2><p><img src="/images/concurrency/image-20210621145309617.png" alt="image-20210621145309617"></p><h3 id="waitstatus" tabindex="-1"><a class="header-anchor" href="#waitstatus" aria-hidden="true">#</a> waitStatus</h3><ol><li>waitStatus 节点的生命状态：信号量 <ol><li>SIGNAL = -1 代表可被唤醒</li><li>CANCELLED = 1 代表异常，如中断，错误等，需要被废弃</li><li>CONDITION = -2 代表条件等待</li><li>PROPAGATE = -3 代表传播</li><li>默认为0 初始状态</li></ol></li></ol><h3 id="cas在node入队clh时的操作" tabindex="-1"><a class="header-anchor" href="#cas在node入队clh时的操作" aria-hidden="true">#</a> CAS在Node入队CLH时的操作</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">Node</span> <span class="token function">enq</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>        \n    <span class="token comment">//  自旋  确保入队成功        </span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>            \n        <span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span>            \n        <span class="token keyword">if</span> <span class="token punctuation">(</span>t <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// Must initialize               </span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetHead</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>                    \n                tail <span class="token operator">=</span> head<span class="token punctuation">;</span>            \n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>               \n            <span class="token comment">// 在已有的队列中加入到末尾 </span>\n            node<span class="token punctuation">.</span>prev <span class="token operator">=</span> t<span class="token punctuation">;</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                t<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span>\n                <span class="token keyword">return</span> t<span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p><img src="/images/concurrency/image-20210621152029460.png" alt="image-20210621152029460"></p><h2 id="阻塞入队后的线程" tabindex="-1"><a class="header-anchor" href="#阻塞入队后的线程" aria-hidden="true">#</a> 阻塞入队后的线程</h2><h3 id="首先尝试去获取锁" tabindex="-1"><a class="header-anchor" href="#首先尝试去获取锁" aria-hidden="true">#</a> 首先尝试去获取锁</h3><p>线程入队列之后，传递包含入队列的线程的Node到这个方法，此时arg = 1</p><ol><li><p>节点加入队列之后，不会马上就进行阻塞</p><ol><li>会尝试去获取锁，如果获取到则不会阻塞,head往后挪一个节点</li><li>否则进行阻塞</li></ol></li></ol><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">acquireQueued</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">,</span> <span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">boolean</span> failed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n            <span class="token keyword">boolean</span> interrupted <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token keyword">final</span> <span class="token class-name">Node</span> p <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token function">predecessor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token comment">//\t如果入队的Node的前一个节点是head节点，那么入队的这个线程再次尝试获取锁</span>\n                <span class="token comment">//\t避免其不必要的阻塞（因为会从用户态切换到内核态）</span>\n                <span class="token keyword">if</span> <span class="token punctuation">(</span>p <span class="token operator">==</span> head <span class="token operator">&amp;&amp;</span> <span class="token function">tryAcquire</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\t\n                    <span class="token function">setHead</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                    p<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// help GC</span>\n                    failed <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n                    <span class="token keyword">return</span> interrupted<span class="token punctuation">;</span>\n                <span class="token punctuation">}</span>\n                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">shouldParkAfterFailedAcquire</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>\n                    <span class="token function">parkAndCheckInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n                    interrupted <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>failed<span class="token punctuation">)</span>\n                <span class="token function">cancelAcquire</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code>    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">setHead</span><span class="token punctuation">(</span><span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        head <span class="token operator">=</span> node<span class="token punctuation">;</span>\n        node<span class="token punctuation">.</span>thread <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\t<span class="token comment">//\t置为了空</span>\n        node<span class="token punctuation">.</span>prev <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><img src="/images/concurrency/image-20210621153747265.png" alt="image-20210621153747265"></p><h3 id="阻塞线程" tabindex="-1"><a class="header-anchor" href="#阻塞线程" aria-hidden="true">#</a> 阻塞线程</h3><p>在第一轮循环中将前驱节点waitStatus置为SINGAL</p><h4 id="判断前驱结点的waitstatus" tabindex="-1"><a class="header-anchor" href="#判断前驱结点的waitstatus" aria-hidden="true">#</a> 判断前驱结点的waitStatus</h4><p>因为在CLH队列中第一个head Node节点是空的，所以有效的节点是第二个节点，但是第一个节点利用waitStatus,即下一个节点的waitStatus生命状态记录在上一个节点</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">shouldParkAfterFailedAcquire</span><span class="token punctuation">(</span><span class="token class-name">Node</span> pred<span class="token punctuation">,</span> <span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">int</span> ws <span class="token operator">=</span> pred<span class="token punctuation">.</span>waitStatus<span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">==</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span><span class="token punctuation">)</span>\t<span class="token comment">//\t前驱节点的waitStatus是可唤醒的，（代表的是next Node 线程可唤醒）</span>\n            <span class="token comment">/*\n             * This node has already set status asking a release\n             * to signal it, so it can safely park.\n             */</span>\n            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">/*\n             * Predecessor was cancelled. Skip over predecessors and\n             * indicate retry.\n             */</span>\n            <span class="token keyword">do</span> <span class="token punctuation">{</span>\n                node<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred <span class="token operator">=</span> pred<span class="token punctuation">.</span>prev<span class="token punctuation">;</span>\t<span class="token comment">// 出现异常，进行剔除</span>\n            <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>pred<span class="token punctuation">.</span>waitStatus <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            pred<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            <span class="token comment">/*\n             * waitStatus must be 0 or PROPAGATE.  Indicate that we\n             * need a signal, but don&#39;t park yet.  Caller will need to\n             * retry to make sure it cannot acquire before parking.\n             */</span>\n            <span class="token function">compareAndSetWaitStatus</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> ws<span class="token punctuation">,</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t<span class="token comment">//\t修改前驱节点的waitStatus为SIGNAL,代表下一个节点可唤醒的</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p><img src="/images/concurrency/image-20210621160437377.png" alt="image-20210621160437377"></p><h4 id="阻塞线程-1" tabindex="-1"><a class="header-anchor" href="#阻塞线程-1" aria-hidden="true">#</a> 阻塞线程</h4><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code>    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">parkAndCheckInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">park</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t\t\t<span class="token comment">//\t线程此时 被阻塞在这里，线程的parkBlocker设置为ReentrantLock</span>\n        <span class="token keyword">return</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">interrupted</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="释放锁" tabindex="-1"><a class="header-anchor" href="#释放锁" aria-hidden="true">#</a> 释放锁</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>ReentrantLock.unlock\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">release</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">tryRelease</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">Node</span> h <span class="token operator">=</span> head<span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>h <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> h<span class="token punctuation">.</span>waitStatus <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span>\t<span class="token comment">//\t由于前驱节点在阻塞的时候已经把waitStatus设置为-1 SIGNAL</span>\n            <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span>h<span class="token punctuation">)</span><span class="token punctuation">;</span>\t<span class="token comment">//\t传递的是前驱节点</span>\n        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">protected</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">tryRelease</span><span class="token punctuation">(</span><span class="token keyword">int</span> releases<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token function">getState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> releases<span class="token punctuation">;</span>\t<span class="token comment">//\t同步状态减少</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token function">getExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\t<span class="token comment">//\t必须当前线程</span>\n        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalMonitorStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">boolean</span> free <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\t<span class="token comment">//\t判断同步状态是否为0，线程释放锁，不再独占</span>\n        free <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token function">setExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t<span class="token comment">//\t占据锁的线程，设置为null，表示没有线程拥有</span>\n    <span class="token punctuation">}</span>\n    <span class="token function">setState</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> free<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span><span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> ws <span class="token operator">=</span> node<span class="token punctuation">.</span>waitStatus<span class="token punctuation">;</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>\n        <span class="token comment">// 设置waitStatus为初始状态,主要是为了应对非公平锁</span>\n        <span class="token function">compareAndSetWaitStatus</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> ws<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\t\n    <span class="token class-name">Node</span> s <span class="token operator">=</span> node<span class="token punctuation">.</span>next<span class="token punctuation">;</span>\t\t<span class="token comment">//\t下一个节点</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>s <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> s<span class="token punctuation">.</span>waitStatus <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        s <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span> t <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> t <span class="token operator">!=</span> node<span class="token punctuation">;</span> t <span class="token operator">=</span> t<span class="token punctuation">.</span>prev<span class="token punctuation">)</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>t<span class="token punctuation">.</span>waitStatus <span class="token operator">&lt;=</span> <span class="token number">0</span><span class="token punctuation">)</span>\n                s <span class="token operator">=</span> t<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>s <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>\n        <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">unpark</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>thread<span class="token punctuation">)</span><span class="token punctuation">;</span>\t\t<span class="token comment">// 唤醒线程</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="多线程aqs流程图" tabindex="-1"><a class="header-anchor" href="#多线程aqs流程图" aria-hidden="true">#</a> 多线程AQS流程图</h2><p><img src="/images/concurrency/ReentrantLock源码.png" alt="ReentrantLock源码"></p>',31),t={},e=(0,a(66262).A)(t,[["render",function(n,s){return p}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
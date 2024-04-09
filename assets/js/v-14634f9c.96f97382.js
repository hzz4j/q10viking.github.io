"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[42484],{81535:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-14634f9c",path:"/concurrency/68%20%E5%A6%82%E4%BD%95%E5%94%A4%E9%86%92%E4%B8%80%E4%B8%AA%E7%BA%BF%E7%A8%8B.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[],filePathRelative:"concurrency/68 如何唤醒一个线程.md"}},75061:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(20641).Fv)('<p>在Java中，可以使用Thread类的interrupt()方法来唤醒一个阻塞的线程。</p><p>首先，需要获取到该线程的对象，然后调用interrupt()方法。例如：</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  \n    <span class="token annotation punctuation">@Override</span>  \n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  \n        <span class="token comment">// 线程执行代码  </span>\n    <span class="token punctuation">}</span>  \n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  \nthread<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 启动线程  </span>\n  \n<span class="token comment">// 线程阻塞的情况下，调用interrupt()方法  </span>\nthread<span class="token punctuation">.</span><span class="token function">interrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>线程被中断后，会设置线程的中断状态为true。在代码中可以通过Thread.currentThread().isInterrupted()方法来检查线程的中断状态。如果线程检测到自己被中断，那么可以根据中断状态做出相应的处理。</p><p>在Java中，被中断的线程需要自己编写代码去响应中断，否则线程仍然会一直阻塞。因此，在实际应用中，需要根据具体的业务逻辑编写相应的中断处理代码。</p>',5),t={},e=(0,a(66262).A)(t,[["render",function(n,s){return p}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
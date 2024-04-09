"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[9009],{69031:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-bb518a24",path:"/css/07%20responsive.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/css/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Tools",slug:"tools",children:[]}],filePathRelative:"css/07 responsive.md"}},62358:(s,n,a)=>{a.r(n),a.d(n,{default:()=>p});const e=(0,a(20641).Fv)('<div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Let browser is able to identify the actual device</p></div><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code>1400px 1000px 900px 700px 550px\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token comment">&lt;!-- viewport meta tag --&gt;</span>\n<span class="token comment">&lt;!-- harddevice and software px --&gt;</span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>如果没有viewport meta，在手机上看到的将会是缩小版</p><p><img src="/images/css/202112110723090.jpg" alt="202112110723090"></p><h2 id="tools" tabindex="-1"><a class="header-anchor" href="#tools" aria-hidden="true">#</a> Tools</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>need both to create responsive website</p></div><p><img src="/images/css/202112110713621.jpg" alt="202112110713621"></p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* If statement*/</span>\n<span class="token atrule"><span class="token rule">@media</span> <span class="token punctuation">(</span><span class="token property">min-width</span><span class="token punctuation">:</span> 40rem<span class="token punctuation">)</span></span><span class="token punctuation">{</span>\n    <span class="token comment">/*选择器*/</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* 可以设置多个*/</span>\n<span class="token atrule"><span class="token rule">@media</span> <span class="token punctuation">(</span><span class="token property">min-width</span><span class="token punctuation">:</span> 6 0rem<span class="token punctuation">)</span></span><span class="token punctuation">{</span>\n    <span class="token comment">/*选择器*/</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* ipad旋转的时候 */</span>\n<span class="token atrule"><span class="token rule">@media</span> <span class="token punctuation">(</span><span class="token property">min-width</span><span class="token punctuation">:</span> 40rem<span class="token punctuation">)</span> <span class="token keyword">and</span> <span class="token punctuation">(</span><span class="token property">orientation</span><span class="token punctuation">:</span> landscape<span class="token punctuation">)</span></span> <span class="token punctuation">{</span>\n    <span class="token comment">/*选择器*/</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div>',9),t={},p=(0,a(66262).A)(t,[["render",function(s,n){return e}]])},66262:(s,n)=>{n.A=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}}}]);
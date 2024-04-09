"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[85711],{46641:(n,a,s)=>{s.r(a),s.d(a,{data:()=>e});const e={key:"v-9a051eb0",path:"/css/05%20images.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/css/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"background-size",slug:"background-size",children:[]},{level:2,title:"background-position",slug:"background-position",children:[]},{level:2,title:"linear-gradient",slug:"linear-gradient",children:[]},{level:2,title:"radial-gradient",slug:"radial-gradient",children:[]},{level:2,title:"fileter",slug:"fileter",children:[]},{level:2,title:"背景图片设置",slug:"背景图片设置",children:[]},{level:2,title:"img标签的图片设置object-fit",slug:"img标签的图片设置object-fit",children:[{level:3,title:"Random Image Feed Demo",slug:"random-image-feed-demo",children:[]}]}],filePathRelative:"css/05 images.md"}},32212:(n,a,s)=>{s.r(a),s.d(a,{default:()=>b});var e=s(20641);const t=(0,e.Fv)('<div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Because a Picture says more than a Thousand Words.</p></div><p><img src="/images/css/202112100957450.jpg" alt="202112100957450"></p><h2 id="background-size" tabindex="-1"><a class="header-anchor" href="#background-size" aria-hidden="true">#</a> background-size</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/*width,height */</span>\n<span class="token property">background-size</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>\n<span class="token property">background-size</span><span class="token punctuation">:</span> 100% auto<span class="token punctuation">;</span>\n<span class="token property">background-size</span><span class="token punctuation">:</span> 100% 100%<span class="token punctuation">;</span>\n<span class="token comment">/*内置关键字*/</span>\n<span class="token property">background-size</span><span class="token punctuation">:</span> cover<span class="token punctuation">;</span>  ⭐\n<span class="token property">background-size</span><span class="token punctuation">:</span> contain<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="background-position" tabindex="-1"><a class="header-anchor" href="#background-position" aria-hidden="true">#</a> background-position</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>1️⃣ x-axis</p><p>2️⃣ y-axis</p></div><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token property">background-position</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span> ⭐ \n<span class="token property">background-position</span><span class="token punctuation">:</span> left 10% bottom 20%<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="linear-gradient" tabindex="-1"><a class="header-anchor" href="#linear-gradient" aria-hidden="true">#</a> linear-gradient</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* 角度，start color */</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>100deg<span class="token punctuation">,</span>red<span class="token punctuation">,</span>trasparent<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>100deg<span class="token punctuation">,</span>red 70%<span class="token punctuation">,</span>blue 80%<span class="token punctuation">,</span><span class="token function">rgba</span><span class="token punctuation">(</span>0<span class="token punctuation">,</span>0<span class="token punctuation">,</span>0<span class="token punctuation">,</span>0.5<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="radial-gradient" tabindex="-1"><a class="header-anchor" href="#radial-gradient" aria-hidden="true">#</a> radial-gradient</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* shape position，start color */</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>circle<span class="token punctuation">,</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>circle at top<span class="token punctuation">,</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>circle at top left<span class="token punctuation">,</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>circle at 20% 50%<span class="token punctuation">,</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n<span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">radial-gradient</span><span class="token punctuation">(</span>circle 20px at 20% 50% <span class="token punctuation">,</span>red<span class="token punctuation">,</span>blue<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="fileter" tabindex="-1"><a class="header-anchor" href="#fileter" aria-hidden="true">#</a> fileter</h2>',12),p={class:"custom-container tip"},o=(0,e.Lk)("p",{class:"custom-container-title"},"TIP",-1),c={href:"https://developer.mozilla.org/en-US/docs/Web/CSS/filter",target:"_blank",rel:"noopener noreferrer"},i=(0,e.Fv)('<p><img src="/images/css/202112101250200.jpg" alt="202112101250200"></p><h2 id="背景图片设置" tabindex="-1"><a class="header-anchor" href="#背景图片设置" aria-hidden="true">#</a> 背景图片设置</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">&#39;./sun-night.jpg&#39;</span><span class="token punctuation">)</span></span><span class="token punctuation">;</span>\n<span class="token property">background-size</span><span class="token punctuation">:</span> cover<span class="token punctuation">;</span>\n<span class="token property">background-repeat</span><span class="token punctuation">:</span> no-repeat<span class="token punctuation">;</span>\n<span class="token property">background-position</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>',3),r={href:"https://q10viking.github.io/Mini-FrontEnd-project/10%20Simple%20Typing%20animation/",target:"_blank",rel:"noopener noreferrer"},l={href:"https://q10viking.github.io/minifrontendproject/06%20Simple%20Typing%20Animation.html#%E7%AC%94%E8%AE%B0",target:"_blank",rel:"noopener noreferrer"},u=(0,e.Lk)("h2",{id:"img标签的图片设置object-fit",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#img标签的图片设置object-fit","aria-hidden":"true"},"#"),(0,e.eW)(" img标签的图片设置object-fit")],-1),d=(0,e.Lk)("h3",{id:"random-image-feed-demo",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#random-image-feed-demo","aria-hidden":"true"},"#"),(0,e.eW)(" Random Image Feed Demo")],-1),k={href:"https://q10viking.github.io/minifrontendproject/10%20Random%20Image%20Feed.html",target:"_blank",rel:"noopener noreferrer"},g={},b=(0,s(66262).A)(g,[["render",function(n,a){const s=(0,e.g2)("OutboundLink"),g=(0,e.g2)("common-progresson-snippet");return(0,e.uX)(),(0,e.CE)(e.FK,null,[t,(0,e.Lk)("div",p,[o,(0,e.Lk)("p",null,[(0,e.Lk)("a",c,[(0,e.eW)("filter - CSS: Cascading Style Sheets | MDN (mozilla.org)"),(0,e.bF)(s)])])]),i,(0,e.Lk)("p",null,[(0,e.Lk)("a",r,[(0,e.eW)("项目预览（Project view）"),(0,e.bF)(s)])]),(0,e.Lk)("p",null,[(0,e.Lk)("a",l,[(0,e.eW)("相关笔记"),(0,e.bF)(s)])]),(0,e.bF)(g,{src:"https://q10viking.github.io/Mini-FrontEnd-project/10%20Simple%20Typing%20animation/"}),u,d,(0,e.Lk)("p",null,[(0,e.Lk)("a",k,[(0,e.eW)("相关笔记"),(0,e.bF)(s)])]),(0,e.bF)(g,{src:"https://q10viking.github.io/Mini-FrontEnd-project/14%20Random%20Image%20Feed/"})],64)}]])},66262:(n,a)=>{a.A=(n,a)=>{const s=n.__vccOpts||n;for(const[n,e]of a)s[n]=e;return s}}}]);
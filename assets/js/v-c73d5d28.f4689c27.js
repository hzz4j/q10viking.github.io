"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[92798],{49958:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-c73d5d28",path:"/minifrontendproject/05%20Magic%20Navigation%20Menu%20Indication.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/minifrontendproject/"}},excerpt:"",headers:[{level:2,title:"Magic Navigation Menu Indicator",slug:"magic-navigation-menu-indicator",children:[]},{level:2,title:"笔记",slug:"笔记",children:[{level:3,title:"素材",slug:"素材",children:[]},{level:3,title:"中文字体",slug:"中文字体",children:[]},{level:3,title:"icon居中",slug:"icon居中",children:[]},{level:3,title:"凹形转的设计",slug:"凹形转的设计",children:[]},{level:3,title:"通过计算移动圆圈",slug:"通过计算移动圆圈",children:[]}]}],filePathRelative:"minifrontendproject/05 Magic Navigation Menu Indication.md"}},67546:(n,s,a)=>{a.r(s),a.d(s,{default:()=>m});var p=a(20641);const t=(0,p.Lk)("h2",{id:"magic-navigation-menu-indicator",tabindex:"-1"},[(0,p.Lk)("a",{class:"header-anchor",href:"#magic-navigation-menu-indicator","aria-hidden":"true"},"#"),(0,p.eW)(" Magic Navigation Menu Indicator")],-1),e={href:"https://q10viking.github.io/Mini-FrontEnd-project/09%20Magic%20Navigation%20Menu%20Indicator/",target:"_blank",rel:"noopener noreferrer"},c={href:"https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/09%20Magic%20Navigation%20Menu%20Indicator",target:"_blank",rel:"noopener noreferrer"},o=(0,p.Lk)("h2",{id:"笔记",tabindex:"-1"},[(0,p.Lk)("a",{class:"header-anchor",href:"#笔记","aria-hidden":"true"},"#"),(0,p.eW)(" 笔记")],-1),l=(0,p.Lk)("h3",{id:"素材",tabindex:"-1"},[(0,p.Lk)("a",{class:"header-anchor",href:"#素材","aria-hidden":"true"},"#"),(0,p.eW)(" 素材")],-1),i={href:"https://ionic.io/ionicons",target:"_blank",rel:"noopener noreferrer"},r=(0,p.Lk)("h3",{id:"中文字体",tabindex:"-1"},[(0,p.Lk)("a",{class:"header-anchor",href:"#中文字体","aria-hidden":"true"},"#"),(0,p.eW)(" 中文字体")],-1),u={href:"https://fonts.google.com/specimen/Zhi+Mang+Xing?subset=chinese-simplified",target:"_blank",rel:"noopener noreferrer"},k=(0,p.Fv)('<div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token atrule"><span class="token rule">@import</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">&#39;https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@1,600&amp;family=Meow+Script&amp;family=Zhi+Mang+Xing&amp;display=swap&#39;</span><span class="token punctuation">)</span></span><span class="token punctuation">;</span></span>\n<span class="token property">font-family</span><span class="token punctuation">:</span> <span class="token string">&#39;Zhi Mang Xing&#39;</span><span class="token punctuation">,</span> cursive<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>下载ttg字体在css中使用</p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token atrule"><span class="token rule">@font-face</span></span> <span class="token punctuation">{</span> \n    <span class="token property">font-family</span><span class="token punctuation">:</span> <span class="token string">&#39;Zhi Mang Xing&#39;</span><span class="token punctuation">;</span> \n    <span class="token property">src</span><span class="token punctuation">:</span><span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">&#39;./ZhiMangXing-Regular.ttf&#39;</span><span class="token punctuation">)</span></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> \n\n<span class="token property">font-family</span><span class="token punctuation">:</span> <span class="token string">&#39;Zhi Mang Xing&#39;</span><span class="token punctuation">,</span> cursive<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="icon居中" tabindex="-1"><a class="header-anchor" href="#icon居中" aria-hidden="true">#</a> icon居中</h3><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.navigation ul li a .icon</span> <span class="token punctuation">{</span>\n    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>\n    <span class="token property">line-height</span><span class="token punctuation">:</span> 70px<span class="token punctuation">;</span>   <span class="token comment">/*居中与容器navigation的高度一样*/</span>\n    <span class="token property">font-size</span><span class="token punctuation">:</span> 1.5em<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="凹形转的设计" tabindex="-1"><a class="header-anchor" href="#凹形转的设计" aria-hidden="true">#</a> 凹形转的设计</h3><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* 圆圈设计 */</span>\n<span class="token selector">.indicator</span><span class="token punctuation">{</span>\n    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>\n    <span class="token property">top</span><span class="token punctuation">:</span> -50%<span class="token punctuation">;</span>\n    <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--second-color<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 70px<span class="token punctuation">;</span>\n    <span class="token property">height</span><span class="token punctuation">:</span> 70px<span class="token punctuation">;</span>\n    <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>\n    <span class="token property">border</span><span class="token punctuation">:</span> 6px solid <span class="token function">var</span><span class="token punctuation">(</span>--primary-color<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token property">transition</span><span class="token punctuation">:</span> 0.5s ease<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">.indicator::before</span><span class="token punctuation">{</span>\n    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>\n    <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>\n    <span class="token property">left</span><span class="token punctuation">:</span> -22px<span class="token punctuation">;</span>\n    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">&quot; &quot;</span><span class="token punctuation">;</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token property">height</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token comment">/* background: transparent; */</span>\n    <span class="token property">border-top-right-radius</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token property">box-shadow</span><span class="token punctuation">:</span> 1px -10px 0 0 <span class="token function">var</span><span class="token punctuation">(</span>--primary-color<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">.indicator::after</span><span class="token punctuation">{</span>\n    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>\n    <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>\n    <span class="token property">right</span><span class="token punctuation">:</span> -22px<span class="token punctuation">;</span>\n    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">&quot; &quot;</span><span class="token punctuation">;</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token property">height</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token comment">/* background-color: red; */</span>\n    <span class="token comment">/* background: transparent; */</span>\n    <span class="token property">border-top-left-radius</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>\n    <span class="token property">box-shadow</span><span class="token punctuation">:</span> -1px -10px 0 0 <span class="token function">var</span><span class="token punctuation">(</span>--primary-color<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><h3 id="通过计算移动圆圈" tabindex="-1"><a class="header-anchor" href="#通过计算移动圆圈" aria-hidden="true">#</a> 通过计算移动圆圈</h3><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* Indicator Transitions */</span>\n<span class="token selector">.navigation ul li:nth-child(1).active ~ .indicator</span> <span class="token punctuation">{</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token function">calc</span><span class="token punctuation">(</span>70px * -2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* Indicator Transitions */</span>\n<span class="token selector">.navigation ul li:nth-child(2).active ~ .indicator</span> <span class="token punctuation">{</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token function">calc</span><span class="token punctuation">(</span>70px * -1<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* Indicator Transitions */</span>\n<span class="token selector">.navigation ul li:nth-child(3).active ~ .indicator</span> <span class="token punctuation">{</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token function">calc</span><span class="token punctuation">(</span>70px * 0<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* Indicator Transitions */</span>\n<span class="token selector">.navigation ul li:nth-child(4).active ~ .indicator</span> <span class="token punctuation">{</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token function">calc</span><span class="token punctuation">(</span>70px * 1<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">/* Indicator Transitions */</span>\n<span class="token selector">.navigation ul li:nth-child(5).active ~ .indicator</span> <span class="token punctuation">{</span>\n    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token function">calc</span><span class="token punctuation">(</span>70px * 2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div>',9),b={},m=(0,a(66262).A)(b,[["render",function(n,s){const a=(0,p.g2)("OutboundLink"),b=(0,p.g2)("common-progresson-snippet");return(0,p.uX)(),(0,p.CE)(p.FK,null,[t,(0,p.Lk)("p",null,[(0,p.Lk)("a",e,[(0,p.eW)("项目预览（Project view）"),(0,p.bF)(a)])]),(0,p.Lk)("p",null,[(0,p.Lk)("a",c,[(0,p.eW)("Source Code"),(0,p.bF)(a)])]),(0,p.bF)(b,{src:"https://q10viking.github.io/Mini-FrontEnd-project/09%20Magic%20Navigation%20Menu%20Indicator/"}),o,l,(0,p.Lk)("p",null,[(0,p.Lk)("a",i,[(0,p.eW)("Ionicons Usage Guide: Tips for installing and using the Ionicons free icon library"),(0,p.bF)(a)])]),r,(0,p.Lk)("p",null,[(0,p.Lk)("a",u,[(0,p.eW)("Zhi Mang Xing - Google Fonts"),(0,p.bF)(a)])]),k],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
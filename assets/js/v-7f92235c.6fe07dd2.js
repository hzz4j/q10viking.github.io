"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[66591],{724:(n,s,a)=>{a.r(s),a.d(s,{data:()=>e});const e={key:"v-7f92235c",path:"/Linux/07%20%E9%98%B2%E7%81%AB%E5%A2%99.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Linux/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"正确关闭防火墙方式",slug:"正确关闭防火墙方式",children:[{level:3,title:"开放某个端口",slug:"开放某个端口",children:[]}]}],filePathRelative:"Linux/07 防火墙.md"}},62579:(n,s,a)=>{a.r(s),a.d(s,{default:()=>c});var e=a(20641);const l=(0,e.Lk)("h2",{id:"正确关闭防火墙方式",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#正确关闭防火墙方式","aria-hidden":"true"},"#"),(0,e.eW)(" 正确关闭防火墙方式")],-1),t={href:"https://blog.csdn.net/qq_39497015/article/details/81905620",target:"_blank",rel:"noopener noreferrer"},r=(0,e.Fv)('<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>firewall-cmd <span class="token parameter variable">--state</span>\t<span class="token comment">#\t查看是否打开：（not running是未打开，running是打开）</span>\n    <span class="token function">service</span> firewalld stop\t<span class="token comment">#\t关闭防火墙\tcentos6</span>\nsystemctl stop firewalld.service\t<span class="token comment">#\t关闭防火墙\tcentos7</span>\nsystemctl disable firewalld\t<span class="token comment">#\t关闭防火墙的开机自启：（前提要先关闭防火墙）</span>\nsystemctl <span class="token builtin class-name">enable</span> firewalld\t<span class="token comment">#\t开启防火墙的开机自启</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="开放某个端口" tabindex="-1"><a class="header-anchor" href="#开放某个端口" aria-hidden="true">#</a> 开放某个端口</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 查询端口是否开放</span>\nfirewall-cmd --query-port<span class="token operator">=</span><span class="token number">3306</span>/tcp\n<span class="token comment">#\t开放某个端口（这里开放了3306端口）</span>\nfirewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">3306</span>/tcp <span class="token parameter variable">--permanent</span>\n<span class="token comment"># 重新加载防火墙</span>\nfirewall-cmd <span class="token parameter variable">--reload</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>',3),p={},c=(0,a(66262).A)(p,[["render",function(n,s){const a=(0,e.g2)("OutboundLink");return(0,e.uX)(),(0,e.CE)(e.FK,null,[l,(0,e.Lk)("p",null,[(0,e.Lk)("a",t,[(0,e.eW)("CSDN Linux防护墙关闭方法"),(0,e.bF)(a)])]),r],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,e]of s)a[n]=e;return a}}}]);
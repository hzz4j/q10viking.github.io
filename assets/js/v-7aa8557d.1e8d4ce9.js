"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[336],{42102:(n,s,a)=>{a.r(s),a.d(s,{data:()=>e});const e={key:"v-7aa8557d",path:"/springsecurity/11%20%E6%9B%B4%E6%96%B0%E4%BB%A4%E7%89%8C.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/springsecurity/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"更新令牌",slug:"更新令牌",children:[]},{level:2,title:"项目配置",slug:"项目配置",children:[]},{level:2,title:"项目测试",slug:"项目测试",children:[]}],filePathRelative:"springsecurity/11 更新令牌.md"}},82665:(n,s,a)=>{a.r(s),a.d(s,{default:()=>b});var e=a(20641);const t=(0,e.Lk)("h2",{id:"更新令牌",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#更新令牌","aria-hidden":"true"},"#"),(0,e.eW)(" 更新令牌")],-1),p=(0,e.Lk)("p",null,"颁发令牌的时候，一次性颁发两个令牌，一个用于获取数据，另一个用于获取新的令牌（refresh token 字段）。令牌到期前，用户使用 refresh token 发一个请求，去更新令牌。",-1),o=(0,e.Lk)("h2",{id:"项目配置",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#项目配置","aria-hidden":"true"},"#"),(0,e.eW)(" 项目配置")],-1),c={href:"https://github.com/Q10Viking/springcloudalibaba/tree/main/oauth2/oauth2-password-update-token",target:"_blank",rel:"noopener noreferrer"},l=(0,e.Fv)('<p>授权配置</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">AuthorizationServerEndpointsConfigurer</span> endpoints<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 密码模式必须配置</span>\n        endpoints<span class="token punctuation">.</span><span class="token function">authenticationManager</span><span class="token punctuation">(</span>authenticationManager<span class="token punctuation">)</span>\n                <span class="token punctuation">.</span><span class="token function">reuseRefreshTokens</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token comment">// refresh_token是否重复使用</span>\n                <span class="token punctuation">.</span><span class="token function">userDetailsService</span><span class="token punctuation">(</span>userService<span class="token punctuation">)</span> <span class="token comment">// 刷新令牌授权包含对用户信息的检查</span>\n                <span class="token punctuation">.</span><span class="token function">allowedTokenEndpointRequestMethods</span><span class="token punctuation">(</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span><span class="token class-name">HttpMethod</span><span class="token punctuation">.</span><span class="token constant">POST</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 支持的方法</span>\n    <span class="token punctuation">}</span>\n\n<span class="token comment">//...</span>\n<span class="token comment">//配置grant_type，表示授权类型</span>\n<span class="token punctuation">.</span><span class="token function">authorizedGrantTypes</span><span class="token punctuation">(</span><span class="token string">&quot;password&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;refresh_token&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="项目测试" tabindex="-1"><a class="header-anchor" href="#项目测试" aria-hidden="true">#</a> 项目测试</h2><blockquote><p>基于密码模式</p></blockquote>',4),r={href:"http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all",target:"_blank",rel:"noopener noreferrer"},i=(0,e.Lk)("p",null,[(0,e.Lk)("img",{src:"/images/springsecurity/image-20230313211504373.png",alt:"image-20230313211504373"})],-1),u=(0,e.Lk)("blockquote",null,[(0,e.Lk)("p",null,"使用上面的refresh_token重新获取token")],-1),k={href:"http://localhost:8080/oauth/token?grant_type=refresh_token&client_id=client&client_secret=123123&refresh_token=943e9223-261d-4a02-be65-87bb2fd1e04a",target:"_blank",rel:"noopener noreferrer"},h=(0,e.Lk)("p",null,[(0,e.Lk)("img",{src:"/images/springsecurity/image-20230313211835469.png",alt:"image-20230313211835469"})],-1),d={},b=(0,a(66262).A)(d,[["render",function(n,s){const a=(0,e.g2)("OutboundLink");return(0,e.uX)(),(0,e.CE)(e.FK,null,[t,p,o,(0,e.Lk)("p",null,[(0,e.Lk)("a",c,[(0,e.eW)("Source Code"),(0,e.bF)(a)])]),l,(0,e.Lk)("p",null,[(0,e.Lk)("a",r,[(0,e.eW)("http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all"),(0,e.bF)(a)])]),i,u,(0,e.Lk)("p",null,[(0,e.Lk)("a",k,[(0,e.eW)("http://localhost:8080/oauth/token?grant_type=refresh_token&client_id=client&client_secret=123123&refresh_token=943e9223-261d-4a02-be65-87bb2fd1e04a"),(0,e.bF)(a)])]),h],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,e]of s)a[n]=e;return a}}}]);
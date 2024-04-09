"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[94574],{44480:(s,e,a)=>{a.r(e),a.d(e,{data:()=>n});const n={key:"v-df835808",path:"/springsecurity/03%20%E7%94%A8%E6%88%B7%E8%AE%A4%E8%AF%81%E5%8E%9F%E7%90%86.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/springsecurity/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"前端访问的链接跳转分析",slug:"前端访问的链接跳转分析",children:[]},{level:2,title:"未认证访问资源源码分析",slug:"未认证访问资源源码分析",children:[]},{level:2,title:"登录成功自动跳转到原来访问资源的链接源码分析",slug:"登录成功自动跳转到原来访问资源的链接源码分析",children:[]},{level:2,title:"认证登录逻辑与认证后访问资源",slug:"认证登录逻辑与认证后访问资源",children:[]},{level:2,title:"枚举",slug:"枚举",children:[]}],filePathRelative:"springsecurity/03 用户认证原理.md"}},14520:(s,e,a)=>{a.r(e),a.d(e,{default:()=>l});const n=(0,a(20641).Fv)('<p>分析当浏览器访问 http://localhost:8080/admin/demo，怎么知道需要登录，登录之后是知道调到我之前访问的链接的。</p><h2 id="前端访问的链接跳转分析" tabindex="-1"><a class="header-anchor" href="#前端访问的链接跳转分析" aria-hidden="true">#</a> 前端访问的链接跳转分析</h2><ol><li><p>访问http://localhost:8080/admin/demo，系统发现没有认证，响应状态码（302）返回重定向地址：http://localhost:8080/login</p></li><li><p>用户进行登录：http://localhost:8080/login，登录成功之后，响应状态码（302）返回重定向地址：http://localhost:8080/admin/demo</p></li></ol><p>先分析未登录的情况下访问</p><p>如何判断是否需要认证</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token class-name">AntPathMatcher</span>  <span class="token comment">// spring 提供的工具类，星号匹配</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="未认证访问资源源码分析" tabindex="-1"><a class="header-anchor" href="#未认证访问资源源码分析" aria-hidden="true">#</a> 未认证访问资源源码分析</h2><blockquote><p>当访问系统资源时，如果没有经过放行的配置，默认所有的资源都是需要经过认证的。</p></blockquote><ol><li>当我们的请求，在走到最后一个过滤器链的时候，会系统会通过投票决定我们的请求是否允许放行</li><li>当不同意的时候，会抛出一个异常。异常过滤器会捕获到这个异常</li><li>然后进行重定向，跳转到我们的登录页面。</li></ol><p>https://www.processon.com/view/link/627be4340e3e7413eecd8dad</p><h2 id="登录成功自动跳转到原来访问资源的链接源码分析" tabindex="-1"><a class="header-anchor" href="#登录成功自动跳转到原来访问资源的链接源码分析" aria-hidden="true">#</a> 登录成功自动跳转到原来访问资源的链接源码分析</h2><p><strong>跳转回来登录页面后，进行了认证登录，系统怎么知道跳转到原来的资源访问的</strong>。</p><ol><li>在第一次未认证访问系统时，会创建一个session，保存当前请求的资源地址</li><li>当login登录的时候，认证通过之后，从session中取出之前存放的数据（访问资源的地址），然后从定向返回之前访问资源。</li></ol><p>https://www.processon.com/view/link/627bee7e5653bb45ea5dfd90</p><h2 id="认证登录逻辑与认证后访问资源" tabindex="-1"><a class="header-anchor" href="#认证登录逻辑与认证后访问资源" aria-hidden="true">#</a> 认证登录逻辑与认证后访问资源</h2><ol><li>用户login，提交密码后，会获取到用户的信息，与提交的信息对比，看看信息是否一致</li><li>封装成将认证通过的信息封装到一个对象UsernamePasswordAuthenticationToken，存储到session中</li><li>当用户访问资源的时候，首先从session中拿出认证的信息UsernamePasswordAuthenticationToken，然后经过spring security的过滤器链，在最后一个过滤器中进行投票决定是否能够访问资源。</li></ol><p>https://www.processon.com/view/link/627c1044e0b34d0758721090</p><hr><p>UserDetailService什么时候赋值的？</p><p>passwordEncode是什么时候设置进去的？</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token class-name">UserDetailsService</span> userDetailsService <span class="token operator">=</span> <span class="token function">getBeanOrNull</span><span class="token punctuation">(</span><span class="token class-name">UserDetailsService</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>\n<span class="token class-name">PasswordEncoder</span> passwordEncoder <span class="token operator">=</span> <span class="token function">getBeanOrNull</span><span class="token punctuation">(</span><span class="token class-name">PasswordEncoder</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nprovider<span class="token punctuation">.</span><span class="token function">setUserDetailsService</span><span class="token punctuation">(</span>userDetailsService<span class="token punctuation">)</span>\nprovider<span class="token punctuation">.</span><span class="token function">setUserDetailsService</span><span class="token punctuation">(</span>userDetailsService<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="枚举" tabindex="-1"><a class="header-anchor" href="#枚举" aria-hidden="true">#</a> 枚举</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>HttpMethod  默认enum方法 .value\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div>',23),t={},l=(0,a(66262).A)(t,[["render",function(s,e){return n}]])},66262:(s,e)=>{e.A=(s,e)=>{const a=s.__vccOpts||s;for(const[s,n]of e)a[s]=n;return a}}}]);
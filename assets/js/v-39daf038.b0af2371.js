"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[79674],{29388:(n,a,s)=>{s.r(a),s.d(a,{data:()=>e});const e={key:"v-39daf038",path:"/SpringCloud/08%20Nacos%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/SpringCloud/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"引入依赖",slug:"引入依赖",children:[]},{level:2,title:"创建bootstrap.yml文件",slug:"创建bootstrap-yml文件",children:[]},{level:2,title:"优先级",slug:"优先级",children:[]}],filePathRelative:"SpringCloud/08 Nacos配置中心.md"}},40433:(n,a,s)=>{s.r(a),s.d(a,{default:()=>c});var e=s(20641);const t={href:"https://github.com/Q10Viking/springcloudalibaba/tree/main/05-learn-spring-cloud-alibaba",target:"_blank",rel:"noopener noreferrer"},p=(0,e.Fv)('<h2 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖" aria-hidden="true">#</a> 引入依赖</h2><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token comment">&lt;!--    引入配置中心    --&gt;</span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.alibaba.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-alibaba-nacos-config<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="创建bootstrap-yml文件" tabindex="-1"><a class="header-anchor" href="#创建bootstrap-yml文件" aria-hidden="true">#</a> 创建bootstrap.yml文件</h2><p>配置中心的配置</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>\n  <span class="token key atrule">application</span><span class="token punctuation">:</span>\n    <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>config\n  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>\n    <span class="token key atrule">nacos</span><span class="token punctuation">:</span>\n      <span class="token key atrule">config</span><span class="token punctuation">:</span>\n        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//192.168.88.1<span class="token punctuation">:</span><span class="token number">8848</span>\n        <span class="token comment"># `${spring.application.name}.${file-extension:properties}`</span>\n        <span class="token key atrule">file-extension</span><span class="token punctuation">:</span> yml    <span class="token comment"># 代表使用配置中心中使用配置的文件格式</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><img src="/images/springcloud/image-20210822171735784.png" alt="image-20210822171735784" style="zoom:67%;"><p><img src="/images/springcloud/image-20210822171644538.png" alt="image-20210822171644538"></p><h2 id="优先级" tabindex="-1"><a class="header-anchor" href="#优先级" aria-hidden="true">#</a> 优先级</h2><p>配置中心&gt;本地IDEA</p>',9),l={},c=(0,s(66262).A)(l,[["render",function(n,a){const s=(0,e.g2)("OutboundLink");return(0,e.uX)(),(0,e.CE)(e.FK,null,[(0,e.Lk)("p",null,[(0,e.Lk)("a",t,[(0,e.eW)("Nacos配置中心实战-github"),(0,e.bF)(s)])]),p],64)}]])},66262:(n,a)=>{a.A=(n,a)=>{const s=n.__vccOpts||n;for(const[n,e]of a)s[n]=e;return s}}}]);
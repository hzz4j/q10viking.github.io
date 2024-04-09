"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[55228],{33603:(e,s,r)=>{r.r(s),r.d(s,{data:()=>n});const n={key:"v-d0116d88",path:"/Linux/10%20Docker%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/Linux/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:3,title:"服务器重启后，Docker安装的mysql怎么重启？",slug:"服务器重启后-docker安装的mysql怎么重启",children:[]},{level:3,title:"mysql is blocked because of many connection errors;问题",slug:"mysql-is-blocked-because-of-many-connection-errors-问题",children:[]}],filePathRelative:"Linux/10 Docker相关问题.md"}},21775:(e,s,r)=>{r.r(s),r.d(s,{default:()=>l});const n=(0,r(20641).Fv)('<ul><li><p>启动docker</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>systemctl start docker\nservice docker start\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></li></ul><h3 id="服务器重启后-docker安装的mysql怎么重启" tabindex="-1"><a class="header-anchor" href="#服务器重启后-docker安装的mysql怎么重启" aria-hidden="true">#</a> 服务器重启后，Docker安装的mysql怎么重启？</h3><ul><li><p>列出Docker中创建的容器</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>docker ps -a\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><img src="/images/linux/image-20210927113953340.png" alt="image-20210927113953340"></p></li><li><p>启动mysql</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>docker restart ecf6a94a11d4\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div></li><li><p>查看是否启动成功</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>docker ps\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div></li></ul><h3 id="mysql-is-blocked-because-of-many-connection-errors-问题" tabindex="-1"><a class="header-anchor" href="#mysql-is-blocked-because-of-many-connection-errors-问题" aria-hidden="true">#</a> mysql is blocked because of many connection errors;问题</h3><p>修改默认的max_connect_errors连接数（mysql 5.6以上默认是100）</p><p>显示默认连接数：show variables like &#39;%max_connect_errors%&#39;;</p><p>修改连接数为500：<strong>set global max_connect_errors = 500; （基本上同一IP不可能超过500）</strong></p><p><strong>flush privileges;</strong></p><p><strong>service mysql restart</strong></p>',9),a={},l=(0,r(66262).A)(a,[["render",function(e,s){return n}]])},66262:(e,s)=>{s.A=(e,s)=>{const r=e.__vccOpts||e;for(const[e,n]of s)r[e]=n;return r}}}]);
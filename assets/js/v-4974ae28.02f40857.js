"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[29328],{42908:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-4974ae28",path:"/vuepress/11%20win11%E9%85%8D%E7%BD%AEgithub%E5%92%8Cgitee.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/vuepress/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"取消全局用户配置",slug:"取消全局用户配置",children:[]},{level:2,title:"生成SSH key",slug:"生成ssh-key",children:[]},{level:2,title:"配置SSH Key到Github和Gitee",slug:"配置ssh-key到github和gitee",children:[{level:3,title:"配置config文件",slug:"配置config文件",children:[]}]},{level:2,title:"SSH key测试",slug:"ssh-key测试",children:[{level:3,title:"github ping不通",slug:"github-ping不通",children:[]}]},{level:2,title:"设置用户全局信息",slug:"设置用户全局信息",children:[]},{level:2,title:"gitee常用操作",slug:"gitee常用操作",children:[]},{level:2,title:"参考",slug:"参考",children:[]}],filePathRelative:"vuepress/11 win11配置github和gitee.md"}},66967:(s,n,a)=>{a.r(n),a.d(n,{default:()=>r});var e=a(20641);const t=(0,e.Fv)('<h2 id="取消全局用户配置" tabindex="-1"><a class="header-anchor" href="#取消全局用户配置" aria-hidden="true">#</a> 取消全局用户配置</h2><p>查看当前是否使用了全局用户配置</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>PS C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">11930</span><span class="token punctuation">\\</span>Desktop<span class="token operator">&gt;</span> <span class="token function">git</span> config user.name\nzhuangzhuang-huang\nPS C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">11930</span><span class="token punctuation">\\</span>Desktop<span class="token operator">&gt;</span> <span class="token function">git</span> config user.email\ncau1403090523@gmail.com\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>取消全局用户配置</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> user.name <span class="token string">&quot;zhuangzhuang-huang&quot;</span>\n<span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> user.email <span class="token string">&quot;cau1403090523@gmail.com&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="生成ssh-key" tabindex="-1"><a class="header-anchor" href="#生成ssh-key" aria-hidden="true">#</a> 生成SSH key</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># ssh-keygen 参数说明</span>\n-t:\t\t指定要创建的密钥类型。可以使用：<span class="token string">&quot;rsa1&quot;</span><span class="token punctuation">(</span>SSH-1<span class="token punctuation">)</span> <span class="token string">&quot;rsa&quot;</span><span class="token punctuation">(</span>SSH-2<span class="token punctuation">)</span> <span class="token string">&quot;dsa&quot;</span><span class="token punctuation">(</span>SSH-2<span class="token punctuation">)</span>\n-f:\t\t指定密钥文件名。\n-C:\t\t提供一个新注释\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 进入到目录</span>\n<span class="token builtin class-name">cd</span> C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">11930</span><span class="token punctuation">\\</span>.ssh\n<span class="token comment"># 在C:\\Users\\11930\\.ssh创建文件 </span>\n<span class="token function">touch</span> id_rsa.github\n<span class="token comment"># Github 注册的邮箱</span>\nssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-f</span> id_rsa.github <span class="token parameter variable">-C</span> <span class="token string">&quot;cau1403090523@gmail.com&quot;</span>\n<span class="token comment"># Gitee 注册的邮箱</span>\n<span class="token function">touch</span> id_rsa.gitee\nssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-f</span> id_rsa.gitee <span class="token parameter variable">-C</span> <span class="token string">&quot;1193094618@qq.com&quot;</span> \n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p><img src="/images/vuepress/202111271126733.png" alt="202111271126733"></p><h2 id="配置ssh-key到github和gitee" tabindex="-1"><a class="header-anchor" href="#配置ssh-key到github和gitee" aria-hidden="true">#</a> 配置SSH Key到Github和Gitee</h2><p><strong>id_rsa.gitee.pub</strong>和 <strong>id_rsa.github.pub</strong>的内容分别配置到gitee和github</p><p><img src="/images/vuepress/202111271126276.png" alt="202111271126276"></p><h3 id="配置config文件" tabindex="-1"><a class="header-anchor" href="#配置config文件" aria-hidden="true">#</a> 配置config文件</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 进入到目录</span>\n<span class="token builtin class-name">cd</span> C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">11930</span><span class="token punctuation">\\</span>.ssh\n<span class="token comment"># 在C:\\Users\\11930\\.ssh创建文件 </span>\n<span class="token function">touch</span> config\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>添加以下内容：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># gitee</span>\nHost gitee.com\nHostName gitee.com\nPreferredAuthentications publickey\nIdentityFile ~/.ssh/id_rsa.gitee\n\n<span class="token comment"># github</span>\nHost github.com\nHostName github.com\nPreferredAuthentications publickey\nIdentityFile ~/.ssh/id_rsa.github\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="ssh-key测试" tabindex="-1"><a class="header-anchor" href="#ssh-key测试" aria-hidden="true">#</a> SSH key测试</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@gitee.com\n<span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@github.com\n\n<span class="token comment"># 输入如</span>\nHi Q10Viking<span class="token operator">!</span> You&#39;ve successfully authenticated, but GitHub does not provide shell access.\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="github-ping不通" tabindex="-1"><a class="header-anchor" href="#github-ping不通" aria-hidden="true">#</a> github ping不通</h3><p>在使用ssh key测试的时候，会识别不了github.com,在hosts文件添加如下内容</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">140.82</span>.113.3 github.com\n<span class="token number">199.232</span>.5.194 github.global.ssl.fastly.net\n<span class="token number">54.231</span>.114.219 github-cloud.s3.amazonaws.com\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="设置用户全局信息" tabindex="-1"><a class="header-anchor" href="#设置用户全局信息" aria-hidden="true">#</a> 设置用户全局信息</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span>  user.name <span class="token string">&quot;静默&quot;</span>\n<span class="token function">git</span> config <span class="token parameter variable">--global</span>  user.email <span class="token string">&quot;cau1403090523@gmail.com&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="gitee常用操作" tabindex="-1"><a class="header-anchor" href="#gitee常用操作" aria-hidden="true">#</a> gitee常用操作</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> hello-gitee              <span class="token comment">#定位到 hello-gitee 文件夹</span>\n<span class="token function">touch</span> 记录.doc               <span class="token comment">#新建一个记录.doc文件</span>\n<span class="token function">git</span> <span class="token function">add</span> 记录.doc             <span class="token comment">#新增“记录.doc”至暂存区</span>\n<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;新纪录&quot;</span>       <span class="token comment">#确认新增“记录.doc”至数据目录</span>\n<span class="token function">git</span> push <span class="token parameter variable">-u</span> origin master\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>',26),l={href:"https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys",target:"_blank",rel:"noopener noreferrer"},p={href:"https://gitee.com/mvphp/gitee_yes",target:"_blank",rel:"noopener noreferrer"},i={},r=(0,a(66262).A)(i,[["render",function(s,n){const a=(0,e.g2)("OutboundLink");return(0,e.uX)(),(0,e.CE)(e.FK,null,[t,(0,e.Lk)("p",null,[(0,e.Lk)("a",l,[(0,e.eW)("connecting to github with-ssh"),(0,e.bF)(a)])]),(0,e.Lk)("p",null,[(0,e.Lk)("a",p,[(0,e.eW)("Gitee操作极速上手指南: 使用 Git 进行本地与远程之间的推送，拉取，修改，删除等操作"),(0,e.bF)(a)])])],64)}]])},66262:(s,n)=>{n.A=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}}}]);
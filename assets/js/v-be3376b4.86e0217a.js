"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[69016],{6997:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-be3376b4",path:"/win11/11-Centos%E5%AD%90%E7%B3%BB%E7%BB%9FGolang%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/win11/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"wsl安装centos",slug:"wsl安装centos",children:[]},{level:2,title:"进入centos❤️",slug:"进入centos❤️",children:[]},{level:2,title:"停止",slug:"停止",children:[]},{level:2,title:"配置工作",slug:"配置工作",children:[{level:3,title:"DNS配置",slug:"dns配置",children:[]},{level:3,title:"安装网络工具",slug:"安装网络工具",children:[]}]},{level:2,title:"git",slug:"git",children:[]},{level:2,title:"golang开发环境搭建",slug:"golang开发环境搭建",children:[{level:3,title:"vscode配置golang",slug:"vscode配置golang",children:[]}]},{level:2,title:"参考",slug:"参考",children:[]}],filePathRelative:"win11/11-Centos子系统Golang开发环境.md"}},9027:(s,n,a)=>{a.r(n),a.d(n,{default:()=>v});var e=a(20641);const t=(0,e.Fv)('<div class="custom-container tip"><p class="custom-container-title">TIP</p><p>win11下安装了DockerDesktop来通过docker导出centos的版本，从而通过wsl来安装</p></div><h2 id="wsl安装centos" tabindex="-1"><a class="header-anchor" href="#wsl安装centos" aria-hidden="true">#</a> wsl安装centos</h2><p>首先启动DockerDesktop</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">docker</span> pull centos:centos7.9.2009\n\nC:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">1193</span><span class="token operator"><span class="token file-descriptor important">0</span>&gt;</span>docker images\nREPOSITORY   TAG              IMAGE ID       CREATED         SIZE\nmysql        <span class="token number">8.0</span>.32           cdf3aa69f5f0   <span class="token number">33</span> hours ago    517MB\nredis        latest           7614ae9453d1   <span class="token number">13</span> months ago   113MB\ncentos       centos7.9.2009   eeb6ee3f44bd   <span class="token number">16</span> months ago   204MB\n\n<span class="token comment"># 创建并启动容器</span>\nC:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">1193</span><span class="token operator"><span class="token file-descriptor important">0</span>&gt;</span>docker run <span class="token parameter variable">-d</span> <span class="token parameter variable">-i</span> <span class="token parameter variable">-t</span> eeb6ee3f44bd /bin/bash\n8ef3409d696fe20bff062ddf082929c4882bf2148f6cfe71f57daa47e5383617\n<span class="token comment"># ===========================到这里就可以到进入容器centos中了========================</span>\nC:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token number">1193</span><span class="token operator"><span class="token file-descriptor important">0</span>&gt;</span>docker <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> 8ef3409d696 <span class="token function">bash</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>现在已经启动了centos容器了，接下来到处这个容器</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 到处容器到当前文件夹中 docker export containerID -o 文件名</span>\nE:<span class="token punctuation">\\</span>wsl<span class="token punctuation">\\</span>centos7<span class="token punctuation">\\</span>first<span class="token operator">&gt;</span>docker <span class="token builtin class-name">export</span> 8ef3409d696fe20bff062ddf082929c4882bf2148f6cfe71f57daa47e5383617 <span class="token parameter variable">-o</span> centos.tar\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>以上部分就是从docker中导出centos容器，接下使用wsl导入这个centos子系统</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>E:<span class="token punctuation">\\</span>wsl<span class="token punctuation">\\</span>centos7<span class="token punctuation">\\</span>first<span class="token operator">&gt;</span>wsl <span class="token parameter variable">--import</span> centos7.9.2009 <span class="token string">&quot;E:\\wsl<span class="token entity" title="\\c">\\c</span>entos7<span class="token entity" title="\\f">\\f</span>irst&quot;</span> <span class="token string">&quot;E:\\wsl<span class="token entity" title="\\c">\\c</span>entos7<span class="token entity" title="\\f">\\f</span>irst<span class="token entity" title="\\c">\\c</span>entos.tar&quot;</span> <span class="token parameter variable">--version</span> <span class="token number">2</span>\n正在导入，这可能需要几分钟时间。\n操作成功完成。\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>查看导入成功</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>E:<span class="token punctuation">\\</span>wsl<span class="token punctuation">\\</span>centos7<span class="token punctuation">\\</span>first<span class="token operator">&gt;</span>wsl <span class="token parameter variable">-l</span> <span class="token parameter variable">-v</span>\n  NAME                   STATE           VERSION\n* docker-desktop         Running         <span class="token number">2</span>\n  docker-desktop-data    Running         <span class="token number">2</span>\n  centos7.9.2009         Stopped         <span class="token number">2</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="进入centos❤️" tabindex="-1"><a class="header-anchor" href="#进入centos❤️" aria-hidden="true">#</a> 进入centos❤️</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>wsl -d centos7.9.2009\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><blockquote><p>查看版本</p></blockquote><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span>root@LAPTOP-PJLAUUSP ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/os-release</span>\n<span class="token assign-left variable">NAME</span><span class="token operator">=</span><span class="token string">&quot;CentOS Linux&quot;</span>\n<span class="token assign-left variable">VERSION</span><span class="token operator">=</span><span class="token string">&quot;7 (Core)&quot;</span>\n<span class="token assign-left variable">ID</span><span class="token operator">=</span><span class="token string">&quot;centos&quot;</span>\n<span class="token assign-left variable">ID_LIKE</span><span class="token operator">=</span><span class="token string">&quot;rhel fedora&quot;</span>\n<span class="token assign-left variable">VERSION_ID</span><span class="token operator">=</span><span class="token string">&quot;7&quot;</span>\n<span class="token assign-left variable">PRETTY_NAME</span><span class="token operator">=</span><span class="token string">&quot;CentOS Linux 7 (Core)&quot;</span>\n<span class="token assign-left variable">ANSI_COLOR</span><span class="token operator">=</span><span class="token string">&quot;0;31&quot;</span>\n<span class="token assign-left variable">CPE_NAME</span><span class="token operator">=</span><span class="token string">&quot;cpe:/o:centos:centos:7&quot;</span>\n<span class="token assign-left variable">HOME_URL</span><span class="token operator">=</span><span class="token string">&quot;https://www.centos.org/&quot;</span>\n<span class="token assign-left variable">BUG_REPORT_URL</span><span class="token operator">=</span><span class="token string">&quot;https://bugs.centos.org/&quot;</span>\n\n<span class="token assign-left variable">CENTOS_MANTISBT_PROJECT</span><span class="token operator">=</span><span class="token string">&quot;CentOS-7&quot;</span>\n<span class="token assign-left variable">CENTOS_MANTISBT_PROJECT_VERSION</span><span class="token operator">=</span><span class="token string">&quot;7&quot;</span>\n<span class="token assign-left variable">REDHAT_SUPPORT_PRODUCT</span><span class="token operator">=</span><span class="token string">&quot;centos&quot;</span>\n<span class="token assign-left variable">REDHAT_SUPPORT_PRODUCT_VERSION</span><span class="token operator">=</span><span class="token string">&quot;7&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h2 id="停止" tabindex="-1"><a class="header-anchor" href="#停止" aria-hidden="true">#</a> 停止</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>wsl <span class="token parameter variable">--terminate</span> centos7.9.2009\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="配置工作" tabindex="-1"><a class="header-anchor" href="#配置工作" aria-hidden="true">#</a> 配置工作</h2><h3 id="dns配置" tabindex="-1"><a class="header-anchor" href="#dns配置" aria-hidden="true">#</a> DNS配置</h3><ol><li>ping www.baidu.com域名不通，但是ping 183.232.231.174 IP地址是通的。</li></ol>',19),p={href:"https://www.jianshu.com/p/ba2cf239ebe0",target:"_blank",rel:"noopener noreferrer"},l=(0,e.Fv)('<p>创建/etc/wsl.conf文件</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span>network<span class="token punctuation">]</span>\ngenerateResolvConf <span class="token operator">=</span> <span class="token boolean">false</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>删除/etc/resolv.conf文件（这是一个软连接）</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span>root@hzz etc<span class="token punctuation">]</span><span class="token comment"># rm resolv.conf</span>\nrm: remove symbolic <span class="token function">link</span> ‘resolv.conf’? y\n<span class="token punctuation">[</span>root@hzz etc<span class="token punctuation">]</span><span class="token comment"># touch resolv.conf</span>\n<span class="token punctuation">[</span>root@hzz etc<span class="token punctuation">]</span><span class="token comment"># vi resolv.conf</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>nameserver 114.114.114.114\nnameserver 223.5.5.5\nnameserver 8.8.8.8\nnameserver 8.8.4.4\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>测试：成功</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span>root@hzz etc<span class="token punctuation">]</span><span class="token comment"># ping www.baidu.com</span>\nPING www.baidu.com <span class="token punctuation">(</span><span class="token number">183.232</span>.231.174<span class="token punctuation">)</span> <span class="token number">56</span><span class="token punctuation">(</span><span class="token number">84</span><span class="token punctuation">)</span> bytes of data.\n<span class="token number">64</span> bytes from <span class="token number">183.232</span>.231.174 <span class="token punctuation">(</span><span class="token number">183.232</span>.231.174<span class="token punctuation">)</span>: <span class="token assign-left variable">icmp_seq</span><span class="token operator">=</span><span class="token number">1</span> <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token number">54</span> <span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token number">26.2</span> ms\n<span class="token number">64</span> bytes from <span class="token number">183.232</span>.231.174 <span class="token punctuation">(</span><span class="token number">183.232</span>.231.174<span class="token punctuation">)</span>: <span class="token assign-left variable">icmp_seq</span><span class="token operator">=</span><span class="token number">2</span> <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token number">54</span> <span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token number">25.3</span> ms\n<span class="token number">64</span> bytes from <span class="token number">183.232</span>.231.174 <span class="token punctuation">(</span><span class="token number">183.232</span>.231.174<span class="token punctuation">)</span>: <span class="token assign-left variable">icmp_seq</span><span class="token operator">=</span><span class="token number">3</span> <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token number">54</span> <span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token number">26.1</span> ms\n<span class="token number">64</span> bytes from <span class="token number">183.232</span>.231.174 <span class="token punctuation">(</span><span class="token number">183.232</span>.231.174<span class="token punctuation">)</span>: <span class="token assign-left variable">icmp_seq</span><span class="token operator">=</span><span class="token number">4</span> <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token number">54</span> <span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token number">25.9</span> ms\n^C\n--- www.baidu.com <span class="token function">ping</span> statistics ---\n<span class="token number">4</span> packets transmitted, <span class="token number">4</span> received, <span class="token number">0</span>% packet loss, <span class="token function">time</span> 7075ms\nrtt min/avg/max/mdev <span class="token operator">=</span> <span class="token number">25.385</span>/25.941/26.288/0.356 ms\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="安装网络工具" tabindex="-1"><a class="header-anchor" href="#安装网络工具" aria-hidden="true">#</a> 安装网络工具</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 更新</span>\nyum update <span class="token parameter variable">-y</span>\n<span class="token comment"># 安装工具</span>\nyum <span class="token parameter variable">-y</span> <span class="token function">install</span> net-tools\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="git" tabindex="-1"><a class="header-anchor" href="#git" aria-hidden="true">#</a> git</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token function">git</span>\n<span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;q10viking&quot;</span>\n<span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;cau1403090523@gmail.com&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>按照上面安装的只能是1.8.3.1</p>',12),o={href:"https://techglimpse.com/update-git-latest-version-centos/",target:"_blank",rel:"noopener noreferrer"},r=(0,e.Lk)("h2",{id:"golang开发环境搭建",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#golang开发环境搭建","aria-hidden":"true"},"#"),(0,e.eW)(" golang开发环境搭建")],-1),c={href:"https://go.dev/doc/install",target:"_blank",rel:"noopener noreferrer"},i=(0,e.Fv)('<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>go version\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="vscode配置golang" tabindex="-1"><a class="header-anchor" href="#vscode配置golang" aria-hidden="true">#</a> vscode配置golang</h3>',2),u={href:"https://learn.microsoft.com/zh-cn/azure/developer/go/configure-visual-studio-code",target:"_blank",rel:"noopener noreferrer"},b={href:"https://code.visualstudio.com/docs/languages/go",target:"_blank",rel:"noopener noreferrer"},k={href:"https://www.youtube.com/watch?v=1MXIGYrMk80",target:"_blank",rel:"noopener noreferrer"},m=(0,e.Lk)("h2",{id:"参考",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#参考","aria-hidden":"true"},"#"),(0,e.eW)(" 参考")],-1),d={href:"https://learn.microsoft.com/zh-cn/windows/wsl/use-custom-distro",target:"_blank",rel:"noopener noreferrer"},g={href:"https://learn.microsoft.com/zh-cn/windows/wsl/networking",target:"_blank",rel:"noopener noreferrer"},h={},v=(0,a(66262).A)(h,[["render",function(s,n){const a=(0,e.g2)("OutboundLink");return(0,e.uX)(),(0,e.CE)(e.FK,null,[t,(0,e.Lk)("p",null,[(0,e.Lk)("a",p,[(0,e.eW)("WSL2 网络异常排查 ping 不通、网络地址异常、缺少默认路由、被宿主机防火墙拦截 "),(0,e.bF)(a)])]),l,(0,e.Lk)("p",null,[(0,e.eW)("参照"),(0,e.Lk)("a",o,[(0,e.eW)("How to upgrade git to latest version on CentOS - Techglimpse"),(0,e.bF)(a)]),(0,e.eW)("升级到版本2")]),r,(0,e.Lk)("p",null,[(0,e.Lk)("a",c,[(0,e.eW)("Download and install - The Go Programming Language"),(0,e.bF)(a)])]),i,(0,e.Lk)("p",null,[(0,e.Lk)("a",u,[(0,e.eW)("为 Go 开发配置Visual Studio Code | Microsoft Learn"),(0,e.bF)(a)])]),(0,e.Lk)("p",null,[(0,e.Lk)("a",b,[(0,e.eW)("Go with Visual Studio Code"),(0,e.bF)(a)])]),(0,e.Lk)("p",null,[(0,e.eW)("很好的一个综合视频"),(0,e.Lk)("a",k,[(0,e.eW)("Getting started with VS Code Go - YouTube"),(0,e.bF)(a)])]),m,(0,e.Lk)("p",null,[(0,e.Lk)("a",d,[(0,e.eW)("导入要与 WSL 一起使用的任何 Linux 发行版 | Microsoft Learn"),(0,e.bF)(a)])]),(0,e.Lk)("p",null,[(0,e.Lk)("a",g,[(0,e.eW)("使用 WSL 访问网络应用程序 | Microsoft Learn"),(0,e.bF)(a)])])],64)}]])},66262:(s,n)=>{n.A=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}}}]);
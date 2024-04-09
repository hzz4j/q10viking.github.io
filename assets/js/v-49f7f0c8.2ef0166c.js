"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[78439],{35391:(n,a,s)=>{s.r(a),s.d(a,{data:()=>t});const t={key:"v-49f7f0c8",path:"/skywalking/04%20%E9%9B%86%E6%88%90%E6%97%A5%E5%BF%97%E6%A1%86%E6%9E%B6.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/skywalking/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Skywalking集成日志框架",slug:"skywalking集成日志框架",children:[]}],filePathRelative:"skywalking/04 集成日志框架.md"}},64305:(n,a,s)=>{s.r(a),s.d(a,{default:()=>r});var t=s(20641);const p=(0,t.Lk)("h2",{id:"skywalking集成日志框架",tabindex:"-1"},[(0,t.Lk)("a",{class:"header-anchor",href:"#skywalking集成日志框架","aria-hidden":"true"},"#"),(0,t.eW)(" Skywalking集成日志框架")],-1),e={class:"custom-container tip"},l=(0,t.Lk)("p",{class:"custom-container-title"},"TIP",-1),o={href:"https://github.com/Q10Viking/springcloudalibaba/tree/main/skywalking/02-skywalking-log",target:"_blank",rel:"noopener noreferrer"},c=(0,t.Lk)("p",null,"上报日志以及一个关键的tid(追踪ID)",-1),u={href:"https://skywalking.apache.org/docs/skywalking-java/next/en/setup/service-agent/java-agent/application-toolkit-logback-1.x/",target:"_blank",rel:"noopener noreferrer"},k=(0,t.Fv)('<div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.apache.skywalking<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>apm-toolkit-logback-1.x<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>8.11.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>每个微服务添加logback-spring.xml文件，并配置 %tid 占位符</p><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token prolog">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>appender</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>console<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ch.qos.logback.core.ConsoleAppender<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token comment">&lt;!-- 日志的格式化 --&gt;</span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>encoder</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ch.qos.logback.core.encoder.LayoutWrappingEncoder<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>layout</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Pattern</span><span class="token punctuation">&gt;</span></span>%d{yyyy-MM-dd HH:mm:ss.SSS} [%tid] [%thread] %-5level %logger{36} -%msg%n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Pattern</span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>layout</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>encoder</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>appender</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token comment">&lt;!-- https://skywalking.apache.org/docs/skywalking-java/latest/en/setup/service-agent/java-agent/application-toolkit-logback-1.x/  --&gt;</span>\n    <span class="token comment">&lt;!-- 通过grpc上报日志到skywalking oap--&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>appender</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>grpc-log<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>org.apache.skywalking.apm.toolkit.log.logback.v1.x.log.GRPCLogClientAppender<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>encoder</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ch.qos.logback.core.encoder.LayoutWrappingEncoder<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>layout</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Pattern</span><span class="token punctuation">&gt;</span></span>%d{yyyy-MM-dd HH:mm:ss.SSS} [%tid] [%thread] %-5level %logger{36} -%msg%n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Pattern</span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>layout</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>encoder</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>appender</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token comment">&lt;!-- 设置 Appender --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>root</span> <span class="token attr-name">level</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>INFO<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>appender-ref</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>console<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>appender-ref</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>grpc-log<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>root</span><span class="token punctuation">&gt;</span></span>\n\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><blockquote><p>测试,可以看到tid的出现</p></blockquote><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">2023</span>-03-08 <span class="token number">21</span>:57:54.796 <span class="token punctuation">[</span>TID:cfc2f6b96ab742039b51558583eae738.132.16782838719830001<span class="token punctuation">]</span> <span class="token punctuation">[</span>http-nio-8020-exec-1<span class="token punctuation">]</span> INFO  o.a.c.c.C.<span class="token punctuation">[</span>Tomcat<span class="token punctuation">]</span>.<span class="token punctuation">[</span>localhost<span class="token punctuation">]</span>.<span class="token punctuation">[</span>/<span class="token punctuation">]</span> <span class="token parameter variable">-Initializing</span> Spring DispatcherServlet <span class="token string">&#39;dispatcherServlet&#39;</span>\n<span class="token number">2023</span>-03-08 <span class="token number">21</span>:57:54.800 <span class="token punctuation">[</span>TID:cfc2f6b96ab742039b51558583eae738.132.16782838719830001<span class="token punctuation">]</span> <span class="token punctuation">[</span>http-nio-8020-exec-1<span class="token punctuation">]</span> INFO  o.s.web.servlet.DispatcherServlet <span class="token parameter variable">-Initializing</span> Servlet <span class="token string">&#39;dispatcherServlet&#39;</span>\n<span class="token number">2023</span>-03-08 <span class="token number">21</span>:57:54.811 <span class="token punctuation">[</span>TID:cfc2f6b96ab742039b51558583eae738.132.16782838719830001<span class="token punctuation">]</span> <span class="token punctuation">[</span>http-nio-8020-exec-1<span class="token punctuation">]</span> INFO  o.s.web.servlet.DispatcherServlet <span class="token parameter variable">-Completed</span> initialization <span class="token keyword">in</span> <span class="token number">11</span> ms\n<span class="token number">2023</span>-03-08 <span class="token number">21</span>:57:54.890 <span class="token punctuation">[</span>TID:cfc2f6b96ab742039b51558583eae738.132.16782838719830001<span class="token punctuation">]</span> <span class="token punctuation">[</span>http-nio-8020-exec-1<span class="token punctuation">]</span> INFO  org.hzz.controller.OrderController <span class="token parameter variable">-current</span> mall-order <span class="token function">service</span> port: <span class="token number">8020</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>同时也通过grpc上报到了skywalking的oap服务</p><p><img src="/images/skywalking/image-20230308220342269.png" alt="image-20230308220342269"></p><p><img src="/images/skywalking/image-20230308220258866.png" alt="image-20230308220258866"></p>',8),i={},r=(0,s(66262).A)(i,[["render",function(n,a){const s=(0,t.g2)("OutboundLink");return(0,t.uX)(),(0,t.CE)(t.FK,null,[p,(0,t.Lk)("div",e,[l,(0,t.Lk)("p",null,[(0,t.Lk)("a",o,[(0,t.eW)("Source Code"),(0,t.bF)(s)])]),c]),(0,t.Lk)("p",null,[(0,t.Lk)("a",u,[(0,t.eW)("logback plugin | Apache SkyWalking"),(0,t.bF)(s)])]),k],64)}]])},66262:(n,a)=>{a.A=(n,a)=>{const s=n.__vccOpts||n;for(const[n,t]of a)s[n]=t;return s}}}]);
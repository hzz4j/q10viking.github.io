"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[96342],{15232:(n,s,a)=>{a.r(s),a.d(s,{data:()=>t});const t={key:"v-224b61ad",path:"/tomcat/05%20Servlet%E8%A7%84%E8%8C%83ServletContext%E8%A7%A3%E8%AF%BB.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/tomcat/"}},excerpt:"",headers:[{level:2,title:"ServletContext",slug:"servletcontext",children:[{level:3,title:"ServletConfig",slug:"servletconfig",children:[]}]},{level:2,title:"Initialization Parameters",slug:"initialization-parameters",children:[]},{level:2,title:"Configuration methods",slug:"configuration-methods",children:[]},{level:2,title:"Context Attributes",slug:"context-attributes",children:[]},{level:2,title:"Resources",slug:"resources",children:[{level:3,title:"资源所处于的位置",slug:"资源所处于的位置",children:[]},{level:3,title:"MIME",slug:"mime",children:[]}]}],filePathRelative:"tomcat/05 Servlet规范ServletContext解读.md"}},83856:(n,s,a)=>{a.r(s),a.d(s,{default:()=>p});const t=(0,a(20641).Fv)('<h2 id="servletcontext" tabindex="-1"><a class="header-anchor" href="#servletcontext" aria-hidden="true">#</a> ServletContext</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>The ServletContext interface defines a servlet’s view of the Web application within which the servlet is running.</p><p>服务器容器在启动时会为每个项目创建唯一的一个ServletContext对象，用于实现多个Servlet之间 的信息共享和通信</p><p>One ServletContext per web app. (They should have named it AppContext.)</p></div><p><img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202112060918834.jpg" alt="image (1)"></p><h3 id="servletconfig" tabindex="-1"><a class="header-anchor" href="#servletconfig" aria-hidden="true">#</a> ServletConfig</h3><ul><li>One ServletConfig object per servlet.</li><li>Use it to pass deploy-time information to the servlet (a database or enterprise bean lookup name, for example) that you don’t want to hard-code into the servlet (servlet init parameters)</li></ul><h2 id="initialization-parameters" tabindex="-1"><a class="header-anchor" href="#initialization-parameters" aria-hidden="true">#</a> Initialization Parameters</h2><p><code>web.xml</code></p><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>context-param</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-name</span><span class="token punctuation">&gt;</span></span>userName<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-name</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-value</span><span class="token punctuation">&gt;</span></span>静默<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-value</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>context-param</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>context-param</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-name</span><span class="token punctuation">&gt;</span></span>description<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-name</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-value</span><span class="token punctuation">&gt;</span></span>Learning tomcat<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-value</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>context-param</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@WebServlet</span><span class="token punctuation">(</span><span class="token string">&quot;/servletContext/test1&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ServletContextTest1</span> <span class="token keyword">extends</span> <span class="token class-name">HttpServlet</span> <span class="token punctuation">{</span>\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">doGet</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> req<span class="token punctuation">,</span> <span class="token class-name">HttpServletResponse</span> resp<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ServletException</span><span class="token punctuation">,</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>\n        <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> req<span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">Enumeration</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> initParameterNames <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getInitParameterNames</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>initParameterNames<span class="token punctuation">.</span><span class="token function">hasMoreElements</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token class-name">String</span> name <span class="token operator">=</span> initParameterNames<span class="token punctuation">.</span><span class="token function">nextElement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token string">&quot; = &quot;</span> <span class="token operator">+</span> servletContext<span class="token punctuation">.</span><span class="token function">getInitParameter</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>description = Learning tomcat\nuserName = 静默\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="configuration-methods" tabindex="-1"><a class="header-anchor" href="#configuration-methods" aria-hidden="true">#</a> Configuration methods</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>1️⃣adding and configuring Servlets</p><p>2️⃣ adding and configuring Filters</p><p>3️⃣ adding and configuring Listeners</p></div><h2 id="context-attributes" tabindex="-1"><a class="header-anchor" href="#context-attributes" aria-hidden="true">#</a> Context Attributes</h2><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@WebServlet</span><span class="token punctuation">(</span><span class="token string">&quot;/servletContext/test2&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ServletContextTest2</span> <span class="token keyword">extends</span> <span class="token class-name">HttpServlet</span> <span class="token punctuation">{</span>\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">doGet</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> req<span class="token punctuation">,</span> <span class="token class-name">HttpServletResponse</span> resp<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ServletException</span><span class="token punctuation">,</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>\n        <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> req<span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">Enumeration</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> attributeNames <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getAttributeNames</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span>attributeNames<span class="token punctuation">.</span><span class="token function">hasMoreElements</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n            <span class="token class-name">String</span> name <span class="token operator">=</span> attributeNames<span class="token punctuation">.</span><span class="token function">nextElement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token string">&quot; = &quot;</span> <span class="token operator">+</span> servletContext<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="resources" tabindex="-1"><a class="header-anchor" href="#resources" aria-hidden="true">#</a> Resources</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>1️⃣ 代表web应用的根目录</p><p>用一个文件下载的例子来理解</p></div><blockquote><p>http://localhost:8888/servlet_specification/servletContext/fileDown/bookCode.jar</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@WebServlet</span><span class="token punctuation">(</span><span class="token string">&quot;/servletContext/fileDown/*&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">FileDownload</span> <span class="token keyword">extends</span> <span class="token class-name">HttpServlet</span> <span class="token punctuation">{</span>\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">doGet</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> req<span class="token punctuation">,</span> <span class="token class-name">HttpServletResponse</span> resp<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ServletException</span><span class="token punctuation">,</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>\n        <span class="token comment">// pathInfo 是 /bookCode.jar</span>\n        <span class="token class-name">String</span> filename <span class="token operator">=</span> req<span class="token punctuation">.</span><span class="token function">getPathInfo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token class-name">String</span> mimeType <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getMimeType</span><span class="token punctuation">(</span>filename<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token comment">// We want the browser to recognize that this is a JAR, not HTML, so we set the</span>\n        <span class="token comment">//content type to “application/java-archive”.</span>\n        resp<span class="token punctuation">.</span><span class="token function">setContentType</span><span class="token punctuation">(</span>mimeType<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token comment">// This just says, “give me an input stream for the resource named tomcat-i18n-zh-CN.jar”.</span>\n        <span class="token class-name">InputStream</span> resourceAsStream <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getResourceAsStream</span><span class="token punctuation">(</span><span class="token string">&quot;/&quot;</span><span class="token operator">+</span>filename<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token keyword">int</span> read <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n        <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> bytes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">1024</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token class-name">OutputStream</span> outputStream <span class="token operator">=</span> resp<span class="token punctuation">.</span><span class="token function">getOutputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token punctuation">(</span>read <span class="token operator">=</span> resourceAsStream<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            outputStream<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span>bytes<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> read<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        outputStream<span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        outputStream<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="highlight-lines"><div class="highlight-line"> </div><br><br><br><br><div class="highlight-line"> </div><br><br><br><br><br><div class="highlight-line"> </div><br><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h3 id="资源所处于的位置" tabindex="-1"><a class="header-anchor" href="#资源所处于的位置" aria-hidden="true">#</a> 资源所处于的位置</h3><p>The getResourceAsStream() requires you to start with a forward slash (“/”) , which <strong>represents the root of your web app.</strong></p><p><img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061151532.jpg" alt="image (8)"></p><p><img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061115307.jpg" alt="image (7)"></p><h3 id="mime" tabindex="-1"><a class="header-anchor" href="#mime" aria-hidden="true">#</a> MIME</h3><p>You have to tell the browser what you’re sending back, so the browser can do the right thing: launch a “helper” app like a PDF viewer or video player, render the HTML, save the bytes of the response as a downloaded file, etc. And since you’re wondering, yes when we say content type we mean the same thing as MIME type.</p><p><img src="https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061155723.jpg" alt="image (9)"></p>',25),e={},p=(0,a(66262).A)(e,[["render",function(n,s){return t}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,t]of s)a[n]=t;return a}}}]);
"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[74578],{32393:(a,s,n)=>{n.r(s),n.d(s,{data:()=>t});const t={key:"v-5a122fab",path:"/JVM/05%20JVM%E5%86%85%E5%AD%98%E5%8F%82%E6%95%B0.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/JVM/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"1. JVM内存参数设置",slug:"_1-jvm内存参数设置",children:[{level:3,title:"1.1 堆相关JVM参数",slug:"_1-1-堆相关jvm参数",children:[]},{level:3,title:"1.2 栈JVM参数",slug:"_1-2-栈jvm参数",children:[]},{level:3,title:"1.3 元空间的JVM参数",slug:"_1-3-元空间的jvm参数",children:[]},{level:3,title:"seata的配置❤️",slug:"seata的配置❤️",children:[]}]},{level:2,title:"2. StackOverflow演示",slug:"_2-stackoverflow演示",children:[]},{level:2,title:"疑问",slug:"疑问",children:[]},{level:2,title:"JVM启动参数",slug:"jvm启动参数",children:[]}],filePathRelative:"JVM/05 JVM内存参数.md"}},43181:(a,s,n)=>{n.r(s),n.d(s,{default:()=>r});const t=(0,n(20641).Fv)('<h2 id="_1-jvm内存参数设置" tabindex="-1"><a class="header-anchor" href="#_1-jvm内存参数设置" aria-hidden="true">#</a> 1. JVM内存参数设置</h2><img src="/images/jvm/image-202103260018046911" alt="image-20210326001804691"><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">java</span> <span class="token parameter variable">-Xms2048M</span> <span class="token parameter variable">-Xmx2048M</span> <span class="token parameter variable">-Xmn1024M</span> <span class="token parameter variable">-Xss512K</span> <span class="token parameter variable">-XX:MetaspaceSize</span><span class="token operator">=</span>256M <span class="token parameter variable">-XX:MaxMetaspaceSize</span><span class="token operator">=</span>256M <span class="token parameter variable">-jar</span> microservice-eureka-server.jar\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="_1-1-堆相关jvm参数" tabindex="-1"><a class="header-anchor" href="#_1-1-堆相关jvm参数" aria-hidden="true">#</a> 1.1 堆相关JVM参数</h3><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>-Xms</td><td>初始堆大小，默认物理内存的1/64</td></tr><tr><td>-Xmx</td><td>最大堆大小，默认物理内存的1/4</td></tr><tr><td>-Xmn</td><td>新生代大小</td></tr><tr><td>-XX:NewRatio</td><td>默认2表示新生代占年老代的1/2，占整个堆内存的1/3</td></tr><tr><td>-XX:NewSize</td><td>设置新生代初始大小</td></tr><tr><td>-XX:SurvivorRatio</td><td>默认8表示一个survivor区占用1/8的Eden内存，即1/10的新生代内存</td></tr></tbody></table><h4 id="堆内存xmx设置注意事项" tabindex="-1"><a class="header-anchor" href="#堆内存xmx设置注意事项" aria-hidden="true">#</a> 堆内存xmx设置注意事项</h4><ol><li><strong>垃圾回收的开销</strong>：堆内存越大，垃圾回收的开销通常也会增加。大堆内存可能需要更长的垃圾回收暂停时间。因此，要权衡内存大小和垃圾回收开销。</li><li><strong>JVM版本和垃圾回收器</strong>：不同的JVM版本和垃圾回收器可能对内存需求有不同的影响。某些垃圾回收器可能更适合大堆内存，而某些适用于小堆内存。</li><li><strong>应用程序的内存需求</strong>：首先要了解应用程序的内存需求。这包括应用程序的数据量、并发用户数、对象创建频率等。不同的应用程序可能需要不同大小的堆内存。</li><li><strong>监控和调整</strong>：监控应用程序的内存使用情况，使用工具如JVisualVM、JConsole等来观察堆内存的使用情况。根据监控数据进行动态调整-Xmx参数。</li><li><strong>并发性需求</strong>：多线程应用程序通常需要更多的堆内存，因为每个线程都需要一定的内存空间来存储栈帧和局部变量。</li></ol><h3 id="_1-2-栈jvm参数" tabindex="-1"><a class="header-anchor" href="#_1-2-栈jvm参数" aria-hidden="true">#</a> 1.2 栈JVM参数</h3><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>-Xss</td><td>每个线程的栈大小，默认是1M</td></tr></tbody></table><h3 id="_1-3-元空间的jvm参数" tabindex="-1"><a class="header-anchor" href="#_1-3-元空间的jvm参数" aria-hidden="true">#</a> 1.3 元空间的JVM参数</h3><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><strong>-XX：MaxMetaspaceSize</strong></td><td>设置元空间最大值， 默认是-1， 即不限制， 或者说只受限于本地内存大小</td></tr><tr><td><strong>-XX：MetaspaceSize</strong></td><td>指定元空间触发Fullgc的初始阈值(元空间无固定初始大小)， 以字节为单位，默认是21M左右，达到该值就会触发full gc进行类型卸载， 同时收集器会对该值进行调整： 如果释放了大量的空间， 就适当降低该值； 如果释放了很少的空间， 那么在不超过-XX：MaxMetaspaceSize（如果设置了的话） 的情况下， 适当提高该值</td></tr></tbody></table><blockquote><p>由于调整元空间的大小需要Full GC，这是非常昂贵的操作，如果应用在启动的时候（项目非常大）发生大量Full GC，通常都是由于<strong>永久代</strong>或**（方法区）元空间**发生了大小调整，基于这种情况，一般建议在JVM参数中将MetaspaceSize和MaxMetaspaceSize设置成一样的值，并设置得比初始值要大，对于8G物理内存的机器来说，一般我会将这两个值都设置为256M</p></blockquote><h3 id="seata的配置❤️" tabindex="-1"><a class="header-anchor" href="#seata的配置❤️" aria-hidden="true">#</a> seata的配置❤️</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token assign-left variable">JAVA_OPT</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">${JAVA_OPT}</span> -server -Xmx${JVM_XMX:=&quot;</span>1024m<span class="token string">&quot;} -Xms${JVM_XMS:=&quot;</span>1024m<span class="token string">&quot;} -Xmn${JVM_XMN:=&quot;</span>512m<span class="token string">&quot;} -Xss${JVM_XSS:=&quot;</span>512k<span class="token string">&quot;} -XX:SurvivorRatio=10 -XX:MetaspaceSize=${JVM_MetaspaceSize:=&quot;</span>128m<span class="token string">&quot;} -XX:MaxMetaspaceSize=${JVM_MaxMetaspaceSize:=&quot;</span>256m<span class="token string">&quot;} -XX:MaxDirectMemorySize=<span class="token variable">${JVM_MaxDirectMemorySize<span class="token operator">:=</span>1024m}</span> -XX:-OmitStackTraceInFastThrow -XX:-UseAdaptiveSizePolicy&quot;</span>\n<span class="token assign-left variable">JAVA_OPT</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">${JAVA_OPT}</span> -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=<span class="token variable">${BASEDIR}</span>/logs/java_heapdump.hprof -XX:+DisableExplicitGC -XX:+CMSParallelRemarkEnabled -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=75&quot;</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="_2-stackoverflow演示" tabindex="-1"><a class="header-anchor" href="#_2-stackoverflow演示" aria-hidden="true">#</a> 2. StackOverflow演示</h2><blockquote><p>-Xss设置越小count值越小，说明一个线程栈里能分配的栈帧就越少，但是对JVM整体来说能开启的线程数会更多</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">// JVM设置 -Xss128k(默认1M)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">StackOverflowTest</span> <span class="token punctuation">{</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">redo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        count<span class="token operator">++</span><span class="token punctuation">;</span>\n        <span class="token function">redo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n            <span class="token function">redo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> t<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            t<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>count<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token doc-comment comment">/**\n * 默认情况 在本地机器中 23300左右\n * 设置 -Xss128k后 1084 左右\n */</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="疑问" tabindex="-1"><a class="header-anchor" href="#疑问" aria-hidden="true">#</a> 疑问</h2><ol><li><p>什么是永久代？</p><p>在Java1.7叫永久代，1.8后改为元空间</p></li></ol><h2 id="jvm启动参数" tabindex="-1"><a class="header-anchor" href="#jvm启动参数" aria-hidden="true">#</a> JVM启动参数</h2><p>JVM（Java虚拟机）的启动参数用于配置和调整Java应用程序的运行时行为。以下是一些常用的JVM启动参数：</p><ol><li><strong>-Xmx</strong>：指定Java堆内存的最大限制。例如，<strong>-Xmx512m</strong> 表示最大堆内存为512兆字节。</li><li><strong>-Xms</strong>：指定Java堆内存的初始大小。例如，<strong>-Xms256m</strong> 表示初始堆内存为256兆字节。</li><li><strong>-Xss</strong>：指定每个线程的堆栈大小。例如，<strong>-Xss256k</strong> 表示每个线程的堆栈大小为256千字节。</li><li><strong>-XX:MaxPermSize</strong>（对于Java 7及之前的版本）或 <strong>-XX:MaxMetaspaceSize</strong>（对于Java 8及以后的版本）：指定永久代（Java 7及之前）或元空间（Java 8及以后）的最大大小。</li><li><strong>-XX:PermSize</strong>（对于Java 7及之前的版本）或 <strong>-XX:MetaspaceSize</strong>（对于Java 8及以后的版本）：指定永久代（Java 7及之前）或元空间（Java 8及以后）的初始大小。</li><li><strong>-Xmn</strong>：指定年轻代的大小。例如，<strong>-Xmn256m</strong> 表示年轻代大小为256兆字节。</li><li><strong>-XX:SurvivorRatio</strong>：指定年轻代中Eden区与Survivor区的大小比例。例如，<strong>-XX:SurvivorRatio=8</strong> 表示Eden区与每个Survivor区的大小比例为8:1。</li><li><strong>-XX:NewRatio</strong>：指定年轻代与老年代的大小比例。例如，<strong>-XX:NewRatio=2</strong> 表示年轻代和老年代的比例为1:2。</li><li><strong>-XX:MaxGCPauseMillis</strong>：设置垃圾回收的最大暂停时间目标。例如，<strong>-XX:MaxGCPauseMillis=100</strong> 表示垃圾回收的最大暂停时间目标为100毫秒。</li><li><strong>-XX:ParallelGCThreads</strong>：指定并行垃圾回收线程的数量。例如，<strong>-XX:ParallelGCThreads=4</strong> 表示使用4个线程进行并行垃圾回收。</li><li><strong>-XX:+UseConcMarkSweepGC</strong>：启用并发标记清除垃圾回收器。</li><li><strong>-XX:+UseG1GC</strong>：启用G1（Garbage First）垃圾回收器。</li><li><strong>-Dproperty=value</strong>：设置Java系统属性，可以在应用程序中使用 <strong>System.getProperty(&quot;property&quot;)</strong> 来获取这些属性的值。</li></ol>',22),e={},r=(0,n(66262).A)(e,[["render",function(a,s){return t}]])},66262:(a,s)=>{s.A=(a,s)=>{const n=a.__vccOpts||a;for(const[a,t]of s)n[a]=t;return n}}}]);
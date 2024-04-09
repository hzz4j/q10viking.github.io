"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[73883],{4984:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-3b21c9cf",path:"/spring/06%20%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/spring/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"Spring中到底有几种依赖注入的方式？",slug:"spring中到底有几种依赖注入的方式",children:[]},{level:2,title:"手动注入",slug:"手动注入",children:[]},{level:2,title:"自动注入",slug:"自动注入",children:[{level:3,title:"XML的autowire自动注入",slug:"xml的autowire自动注入",children:[]}]},{level:2,title:"@Autowired注解的自动注入",slug:"autowired注解的自动注入",children:[{level:3,title:"寻找注入点",slug:"寻找注入点",children:[]},{level:3,title:"static的字段或方法为什么不支持",slug:"static的字段或方法为什么不支持",children:[]},{level:3,title:"桥接方法",slug:"桥接方法",children:[]},{level:3,title:"注入点进行注入",slug:"注入点进行注入",children:[]}]}],filePathRelative:"spring/06 依赖注入.md"}},98488:(s,n,a)=>{a.r(n),a.d(n,{default:()=>i});var e=a(20641);const p=(0,e.Lk)("h2",{id:"spring中到底有几种依赖注入的方式",tabindex:"-1"},[(0,e.Lk)("a",{class:"header-anchor",href:"#spring中到底有几种依赖注入的方式","aria-hidden":"true"},"#"),(0,e.eW)(" Spring中到底有几种依赖注入的方式？")],-1),t=(0,e.Lk)("p",null,"首先分两种：",-1),o=(0,e.Lk)("ol",null,[(0,e.Lk)("li",null,"手动注入"),(0,e.Lk)("li",null,"自动注入")],-1),r={href:"https://www.processon.com/view/link/5f899fa5f346fb06e1d8f570",target:"_blank",rel:"noopener noreferrer"},c=(0,e.Fv)('<h2 id="手动注入" tabindex="-1"><a class="header-anchor" href="#手动注入" aria-hidden="true">#</a> 手动注入</h2><p>在XML中定义Bean时，就是手动注入，因为是<strong>程序员手动给某个属性指定了值</strong>。</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token operator">&lt;</span>bean name<span class="token operator">=</span><span class="token string">&quot;userService&quot;</span> <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;com.luban.service.UserService&quot;</span><span class="token operator">&gt;</span>\n <span class="token operator">&lt;</span>property name<span class="token operator">=</span><span class="token string">&quot;orderService&quot;</span> ref<span class="token operator">=</span><span class="token string">&quot;orderService&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>\n<span class="token operator">&lt;</span><span class="token operator">/</span>bean<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>上面这种底层是通过<strong>set方法</strong>进行注入。</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token operator">&lt;</span>bean name<span class="token operator">=</span><span class="token string">&quot;userService&quot;</span> <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;com.luban.service.UserService&quot;</span><span class="token operator">&gt;</span>\n <span class="token operator">&lt;</span>constructor<span class="token operator">-</span>arg index<span class="token operator">=</span><span class="token string">&quot;0&quot;</span> ref<span class="token operator">=</span><span class="token string">&quot;orderService&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>\n<span class="token operator">&lt;</span><span class="token operator">/</span>bean<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>上面这种底层是通过<strong>构造方法</strong>进行注入。</p><p>所以手动注入的底层也就是分为两种：</p><ol><li>set方法注入</li><li>构造方法注入</li></ol><h2 id="自动注入" tabindex="-1"><a class="header-anchor" href="#自动注入" aria-hidden="true">#</a> 自动注入</h2><p>自动注入又分为两种：</p><ol><li>XML的autowire自动注入</li><li>@Autowired注解的自动注入</li></ol><h3 id="xml的autowire自动注入" tabindex="-1"><a class="header-anchor" href="#xml的autowire自动注入" aria-hidden="true">#</a> XML的autowire自动注入</h3><p>在XML中，我们可以在定义一个Bean时去指定这个Bean的自动注入模式：</p><ol><li>byType</li><li>byName</li><li>constructor</li><li>default</li><li>no</li></ol><p>比如：</p><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>bean</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>userService<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.luban.service.UserService<span class="token punctuation">&quot;</span></span> <span class="token attr-name">autowire</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>byType<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>这么写，表示Spring会自动的给userService中所有的属性自动赋值（<strong>不需要</strong>这个属性上有@Autowired注解，但需要这个属性有对应的<strong>set方法</strong>）。</p><p>在创建Bean的过程中，在填充属性时，Spring会去解析当前类，把<strong>当前类的所有方法</strong>都解析出来，Spring会去解析每个方法得到对应的PropertyDescriptor对象，PropertyDescriptor中有几个属性：</p><ol><li>name：这个name并不是方法的名字，而是拿方法名字进过处理后的名字 <ol><li><strong>如果方法名字以“get”开头，比如“getXXX”,那么name=XXX</strong></li><li><strong>如果方法名字以“is”开头，比如“isXXX”,那么name=XXX</strong></li><li><strong>如果方法名字以“set”开头，比如“setXXX”,那么name=XXX</strong></li></ol></li><li><strong>readMethodRef：表示get方法的Method对象的引用</strong></li><li><strong>readMethodName：表示get方法的名字</strong></li><li><strong>writeMethodRef：表示set方法的Method对象的引用</strong></li><li><strong>writeMethodName：表示set方法的名字</strong></li><li><strong>propertyTypeRef：如果有get方法那么对应的就是返回值的类型，如果是set方法那么对应的就是set方法中唯一参数的类型</strong></li></ol><p><strong>get方法的定义是</strong>: 方法参数个数为0个，并且 （方法名字以&quot;get&quot;开头 或者 方法名字以&quot;is&quot;开头并且方法的返回类型为boolean）</p><p><strong>set方法的定义是</strong>: 方法参数个数为1个，并且 （方法名字以&quot;set&quot;开头并且方法返回类型为void）</p><blockquote><p>所以，Spring在通过byName的自动填充属性时流程是：</p></blockquote><ol><li>找到所有set方法所对应的XXX部分的名字</li><li>根据XXX部分的名字去获取bean</li></ol><blockquote><p>Spring在通过byType的自动填充属性时流程是：</p></blockquote><ol><li>获取到set方法中的唯一参数的参数类型，并且根据该类型去容器中获取bean</li><li>如果找到多个，会报错。</li></ol><p>以上，分析了autowire的byType和byName情况，那么接下来分析constructor，constructor表示通过构造方法注入，其实这种情况就比较简单了，没有byType和byName那么复杂。</p><p>如果是constructor，那么就可以不写set方法了，当某个bean是通过构造方法来注入时，spring利用构造方法的参数信息从Spring容器中去找bean，找到bean之后作为参数传给构造方法，从而实例化得到一个bean对象，并完成属性赋值（属性赋值的代码得程序员来写）。</p><p>我们这里先不考虑一个类有多个构造方法的情况，后面单独讲<strong>推断构造方法</strong>。我们这里只考虑只有一个有参构造方法。</p><p>其实构造方法注入相当于byType+byName，普通的byType是根据set方法中的参数类型去找bean，找到多个会报错，而constructor就是通过构造方法中的参数类型去找bean，如果找到多个会根据参数名确定。</p><p>另外两个：</p><ol><li>no，表示关闭autowire</li><li>default，表示默认值，我们一直演示的某个bean的autowire，而也可以直接在<code>&lt;beans&gt;</code>标签中设置autowire，如果设置了，那么<code>&lt;bean&gt;</code>标签中设置的autowire如果为default，那么则会用<code>&lt;beans&gt;</code>标签中设置的autowire。</li></ol><p>可以发现XML中的自动注入是挺强大的，那么问题来了，<strong>为什么我们平时都是用的@Autowired注解呢？而没有用上文说的这种自动注入方式呢？</strong></p><p>@Autowired注解相当于XML中的autowire属性的<strong>注解方式的替代</strong>。这是在官网上有提到的。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>Essentially, the @Autowired annotation provides the same capabilities as described <span class="token keyword">in</span> Autowiring Collaborators but with <span class="token function">more</span> fine-grained control and wider applicability\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>翻译一下： 从本质上讲，@Autowired注解提供了与autowire相同的功能，但是拥有更细粒度的控制和更广泛的适用性。</p><blockquote><p>注意：<strong>更细粒度的控制</strong>。</p></blockquote><p>XML中的autowire控制的是整个bean的所有属性，而@Autowired注解是直接写在某个属性、某个set方法、某个构造方法上的。</p><p>再举个例子，如果一个类有多个构造方法，那么如果用XML的autowire=constructor，你无法控制到底用哪个构造方法，而你可以用@Autowired注解来直接指定你想用哪个构造方法。</p><p>同时，用@Autowired注解，还可以控制，哪些属性想被自动注入，哪些属性不想，这也是细粒度的控制。</p><p>但是@Autowired无法区分byType和byName，@Autowired是先byType，如果找到多个则byName。</p><p>那么XML的自动注入底层其实也就是:</p><ol><li>set方法注入</li><li>构造方法注入</li></ol><h2 id="autowired注解的自动注入" tabindex="-1"><a class="header-anchor" href="#autowired注解的自动注入" aria-hidden="true">#</a> @Autowired注解的自动注入</h2><p>上文说了@Autowired注解，是byType和byName的结合。</p><p>@Autowired注解可以写在：</p><ol><li>属性上：先根据<strong>属性类型</strong>去找Bean，如果找到多个再根据<strong>属性名</strong>确定一个</li><li>构造方法上：先根据方法<strong>参数类型</strong>去找Bean，如果找到多个再根据<strong>参数名</strong>确定一个</li><li>set方法上：先根据方法<strong>参数类型</strong>去找Bean，如果找到多个再根据<strong>参数名</strong>确定一个</li></ol><p>而这种底层到了：</p><ol><li>属性注入</li><li>set方法注入</li><li>构造方法注入</li></ol><h3 id="寻找注入点" tabindex="-1"><a class="header-anchor" href="#寻找注入点" aria-hidden="true">#</a> 寻找注入点</h3><p>在创建一个Bean的过程中，Spring会利用AutowiredAnnotationBeanPostProcessor的**postProcessMergedBeanDefinition()**找出注入点并缓存，找注入点的流程为：</p><ol><li>遍历当前类的所有的属性字段Field</li><li>查看字段上是否存在@Autowired、@Value、@Inject中的其中任意一个，存在则认为该字段是一个注入点</li><li>如果字段是static的，则不进行注入</li><li>获取@Autowired中的required属性的值</li><li>将字段信息构造成一个<strong>AutowiredFieldElement对象</strong>，作为一个<strong>注入点对象</strong>添加到currElements集合中。</li><li>遍历当前类的所有方法Method</li><li>判断当前Method是否是<strong>桥接方法</strong>，如果是找到原方法</li><li>查看方法上是否存在@Autowired、@Value、@Inject中的其中任意一个，存在则认为该方法是一个注入点</li><li>如果方法是static的，则不进行注入</li><li>获取@Autowired中的required属性的值</li><li>将方法信息构造成一个<strong>AutowiredMethodElement对象</strong>，作为一个<strong>注入点对象</strong>添加到currElements集合中。</li><li>遍历完当前类的字段和方法后，将<strong>遍历父类</strong>的，直到没有父类。</li><li>最后将currElements集合封装成一个InjectionMetadata对象，作为当前Bean对于的注入点集合对象，并缓存。</li></ol><h3 id="static的字段或方法为什么不支持" tabindex="-1"><a class="header-anchor" href="#static的字段或方法为什么不支持" aria-hidden="true">#</a> static的字段或方法为什么不支持</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>\n<span class="token annotation punctuation">@Scope</span><span class="token punctuation">(</span><span class="token string">&quot;prototype&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderService</span> <span class="token punctuation">{</span>\n\n\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>\n<span class="token annotation punctuation">@Scope</span><span class="token punctuation">(</span><span class="token string">&quot;prototype&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span>  <span class="token punctuation">{</span>\n\n <span class="token annotation punctuation">@Autowired</span>\n <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">OrderService</span> orderService<span class="token punctuation">;</span>\n\n <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;test123&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>看上面代码，UserService和OrderService都是原型Bean，假设Spring支持static字段进行自动注入，那么现在调用两次</p><ol><li>UserService userService1 = context.getBean(&quot;userService&quot;)</li><li>UserService userService2 = context.getBean(&quot;userService&quot;)</li></ol><p>问此时，userService1的orderService值是什么？还是它自己注入的值吗？</p><p>答案是不是，一旦userService2 创建好了之后，static orderService字段的值就发生了修改了，从而出现bug</p><h3 id="桥接方法" tabindex="-1"><a class="header-anchor" href="#桥接方法" aria-hidden="true">#</a> 桥接方法</h3><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">UserInterface</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>\n    <span class="token keyword">void</span> <span class="token function">setOrderService</span><span class="token punctuation">(</span><span class="token class-name">T</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token annotation punctuation">@Component</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token keyword">implements</span> <span class="token class-name">UserInterface</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">OrderService</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>\n\n    <span class="token keyword">private</span> <span class="token class-name">OrderService</span> orderService<span class="token punctuation">;</span>\n\n    <span class="token annotation punctuation">@Override</span>\n    <span class="token annotation punctuation">@Autowired</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setOrderService</span><span class="token punctuation">(</span><span class="token class-name">OrderService</span> orderService<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>orderService <span class="token operator">=</span> orderService<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;test123&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>UserService对应的字节码为：</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">// class version 52.0 (52)</span>\n<span class="token comment">// access flags 0x21</span>\n<span class="token comment">// signature Ljava/lang/Object;Lcom/zhouyu/service/UserInterface&lt;Lcom/zhouyu/service/OrderService;&gt;;</span>\n<span class="token comment">// declaration: com/zhouyu/service/UserService implements com.zhouyu.service.UserInterface&lt;com.zhouyu.service.OrderService&gt;</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> com<span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span> <span class="token keyword">implements</span> com<span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserInterface</span> <span class="token punctuation">{</span>\n\n  <span class="token comment">// compiled from: UserService.java</span>\n\n  <span class="token annotation punctuation">@Lorg</span><span class="token operator">/</span>springframework<span class="token operator">/</span>stereotype<span class="token operator">/</span><span class="token class-name">Component</span><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// access flags 0x2</span>\n  <span class="token keyword">private</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span><span class="token punctuation">;</span> orderService\n\n  <span class="token comment">// access flags 0x1</span>\n  <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span>init<span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n   <span class="token constant">L0</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">12</span> <span class="token constant">L0</span>\n    <span class="token constant">ALOAD</span> <span class="token number">0</span>\n    <span class="token constant">INVOKESPECIAL</span> java<span class="token operator">/</span>lang<span class="token operator">/</span><span class="token class-name">Object</span><span class="token punctuation">.</span><span class="token generics"><span class="token punctuation">&lt;</span>init<span class="token punctuation">&gt;</span></span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n    <span class="token constant">RETURN</span>\n   <span class="token constant">L1</span>\n    <span class="token constant">LOCALVARIABLE</span> <span class="token keyword">this</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">;</span> <span class="token constant">L0</span> <span class="token constant">L1</span> <span class="token number">0</span>\n    <span class="token constant">MAXSTACK</span> <span class="token operator">=</span> <span class="token number">1</span>\n    <span class="token constant">MAXLOCALS</span> <span class="token operator">=</span> <span class="token number">1</span>\n\n  <span class="token comment">// access flags 0x1</span>\n  <span class="token keyword">public</span> <span class="token function">setOrderService</span><span class="token punctuation">(</span><span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n  <span class="token annotation punctuation">@Lorg</span><span class="token operator">/</span>springframework<span class="token operator">/</span>beans<span class="token operator">/</span>factory<span class="token operator">/</span>annotation<span class="token operator">/</span><span class="token class-name">Autowired</span><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n   <span class="token constant">L0</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">19</span> <span class="token constant">L0</span>\n    <span class="token constant">ALOAD</span> <span class="token number">0</span>\n    <span class="token constant">ALOAD</span> <span class="token number">1</span>\n    <span class="token constant">PUTFIELD</span> com<span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">.</span>orderService <span class="token operator">:</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span><span class="token punctuation">;</span>\n   <span class="token constant">L1</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">20</span> <span class="token constant">L1</span>\n    <span class="token constant">RETURN</span>\n   <span class="token constant">L2</span>\n    <span class="token constant">LOCALVARIABLE</span> <span class="token keyword">this</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">;</span> <span class="token constant">L0</span> <span class="token constant">L2</span> <span class="token number">0</span>\n    <span class="token constant">LOCALVARIABLE</span> orderService <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span><span class="token punctuation">;</span> <span class="token constant">L0</span> <span class="token constant">L2</span> <span class="token number">1</span>\n    <span class="token constant">MAXSTACK</span> <span class="token operator">=</span> <span class="token number">2</span>\n    <span class="token constant">MAXLOCALS</span> <span class="token operator">=</span> <span class="token number">2</span>\n\n  <span class="token comment">// access flags 0x1</span>\n  <span class="token keyword">public</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n   <span class="token constant">L0</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">23</span> <span class="token constant">L0</span>\n    <span class="token constant">GETSTATIC</span> java<span class="token operator">/</span>lang<span class="token operator">/</span><span class="token class-name">System</span><span class="token punctuation">.</span>out <span class="token operator">:</span> <span class="token class-name">Ljava</span><span class="token operator">/</span>io<span class="token operator">/</span><span class="token class-name">PrintStream</span><span class="token punctuation">;</span>\n    <span class="token constant">LDC</span> <span class="token string">&quot;test123&quot;</span>\n    <span class="token constant">INVOKEVIRTUAL</span> java<span class="token operator">/</span>io<span class="token operator">/</span><span class="token class-name">PrintStream</span><span class="token punctuation">.</span>println <span class="token punctuation">(</span><span class="token class-name">Ljava</span><span class="token operator">/</span>lang<span class="token operator">/</span><span class="token class-name">String</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n   <span class="token constant">L1</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">24</span> <span class="token constant">L1</span>\n    <span class="token constant">RETURN</span>\n   <span class="token constant">L2</span>\n    <span class="token constant">LOCALVARIABLE</span> <span class="token keyword">this</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">;</span> <span class="token constant">L0</span> <span class="token constant">L2</span> <span class="token number">0</span>\n    <span class="token constant">MAXSTACK</span> <span class="token operator">=</span> <span class="token number">2</span>\n    <span class="token constant">MAXLOCALS</span> <span class="token operator">=</span> <span class="token number">1</span>\n\n  <span class="token comment">// access flags 0x1041</span>\n  <span class="token keyword">public</span> synthetic bridge <span class="token function">setOrderService</span><span class="token punctuation">(</span><span class="token class-name">Ljava</span><span class="token operator">/</span>lang<span class="token operator">/</span><span class="token class-name">Object</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n  <span class="token annotation punctuation">@Lorg</span><span class="token operator">/</span>springframework<span class="token operator">/</span>beans<span class="token operator">/</span>factory<span class="token operator">/</span>annotation<span class="token operator">/</span><span class="token class-name">Autowired</span><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n   <span class="token constant">L0</span>\n    <span class="token constant">LINENUMBER</span> <span class="token number">11</span> <span class="token constant">L0</span>\n    <span class="token constant">ALOAD</span> <span class="token number">0</span>\n    <span class="token constant">ALOAD</span> <span class="token number">1</span>\n    <span class="token constant">CHECKCAST</span> com<span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span>\n    <span class="token constant">INVOKEVIRTUAL</span> com<span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">.</span>setOrderService <span class="token punctuation">(</span><span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">OrderService</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token class-name">V</span>\n    <span class="token constant">RETURN</span>\n   <span class="token constant">L1</span>\n    <span class="token constant">LOCALVARIABLE</span> <span class="token keyword">this</span> <span class="token class-name">Lcom</span><span class="token operator">/</span>zhouyu<span class="token operator">/</span>service<span class="token operator">/</span><span class="token class-name">UserService</span><span class="token punctuation">;</span> <span class="token constant">L0</span> <span class="token constant">L1</span> <span class="token number">0</span>\n    <span class="token constant">MAXSTACK</span> <span class="token operator">=</span> <span class="token number">2</span>\n    <span class="token constant">MAXLOCALS</span> <span class="token operator">=</span> <span class="token number">2</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br></div></div><p>可以看到在UserSerivce的字节码中有两个setOrderService方法：</p><ol><li>public setOrderService(Lcom/zhouyu/service/OrderService;)V</li><li>public synthetic bridge setOrderService(Ljava/lang/Object;)V</li></ol><p>并且都是存在@Autowired注解的。</p><p>所以在Spring中需要处理这种情况，当遍历到桥接方法时，得找到原方法</p><h3 id="注入点进行注入" tabindex="-1"><a class="header-anchor" href="#注入点进行注入" aria-hidden="true">#</a> 注入点进行注入</h3><p>Spring在AutowiredAnnotationBeanPostProcessor的**postProcessProperties()**方法中，会遍历所找到的注入点依次进行注入。</p><h4 id="字段注入" tabindex="-1"><a class="header-anchor" href="#字段注入" aria-hidden="true">#</a> 字段注入</h4><ol><li>遍历所有的<strong>AutowiredFieldElement对象。</strong></li><li>将对应的字段封装为<strong>DependencyDescriptor对象</strong>。</li><li>调用BeanFactory的resolveDependency()方法，传入<strong>DependencyDescriptor对象</strong>，进行依赖查找，找到当前字段所匹配的Bean对象。</li><li>将<strong>DependencyDescriptor对象</strong>和所找到的<strong>结果对象beanName</strong>封装成一个<strong>ShortcutDependencyDescriptor对象</strong>作为缓存，比如如果当前Bean是原型Bean，那么下次再来创建该Bean时，就可以直接拿缓存的结果对象beanName去BeanFactory中去那bean对象了，不用再次进行查找了</li><li>利用反射将结果对象赋值给字段。</li></ol><h4 id="set方法注入" tabindex="-1"><a class="header-anchor" href="#set方法注入" aria-hidden="true">#</a> Set方法注入</h4><ol><li>遍历所有的<strong>AutowiredMethodElement对象</strong></li><li>遍历将对应的方法的参数，将每个参数封装成<strong>MethodParameter对象</strong></li><li>将<strong>MethodParameter对象</strong>封装为<strong>DependencyDescriptor对象</strong></li><li>调用BeanFactory的resolveDependency()方法，传入<strong>DependencyDescriptor对象</strong>，进行依赖查找，找到当前方法参数所匹配的Bean对象。</li><li>将<strong>DependencyDescriptor对象</strong>和所找到的<strong>结果对象beanName</strong>封装成一个<strong>ShortcutDependencyDescriptor对象</strong>作为缓存，比如如果当前Bean是原型Bean，那么下次再来创建该Bean时，就可以直接拿缓存的结果对象beanName去BeanFactory中去那bean对象了，不用再次进行查找了</li><li>利用反射将找到的所有结果对象传给当前方法，并执行。</li></ol>',72),l={},i=(0,a(66262).A)(l,[["render",function(s,n){const a=(0,e.g2)("OutboundLink"),l=(0,e.g2)("common-progresson-snippet");return(0,e.uX)(),(0,e.CE)(e.FK,null,[p,t,o,(0,e.Lk)("p",null,[(0,e.Lk)("a",r,[(0,e.eW)("Link"),(0,e.bF)(a)])]),(0,e.bF)(l,{src:"https://www.processon.com/view/link/5f899fa5f346fb06e1d8f570"}),c],64)}]])},66262:(s,n)=>{n.A=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}}}]);
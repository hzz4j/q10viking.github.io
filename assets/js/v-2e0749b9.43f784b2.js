"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[74894],{8159:(n,a,s)=>{s.r(a),s.d(a,{data:()=>t});const t={key:"v-2e0749b9",path:"/rabbitmq/15%20%E6%AD%BB%E4%BF%A1%E9%98%9F%E5%88%97.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/rabbitmq/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"死信队列",slug:"死信队列",children:[]},{level:2,title:"消息成为死信的三种情况",slug:"消息成为死信的三种情况",children:[]},{level:2,title:"**队列绑定死信交换机：**⭐",slug:"队列绑定死信交换机-⭐",children:[]},{level:2,title:"死信队列小结",slug:"死信队列小结",children:[]}],filePathRelative:"rabbitmq/15 死信队列.md"}},19475:(n,a,s)=>{s.r(a),s.d(a,{default:()=>e});const t=(0,s(20641).Fv)('<p>​</p><h2 id="死信队列" tabindex="-1"><a class="header-anchor" href="#死信队列" aria-hidden="true">#</a> 死信队列</h2><p>死信队列，英文缩写：DLX 。Dead Letter Exchange（死信交换机），<strong>当消息成为Dead message后，可以被重新发送到另一个交换机，这个交换机就是DLX。</strong></p><p><img src="/images/RabbitMQ/image-20211031081314275.png" alt="image-20211031081314275"></p><h2 id="消息成为死信的三种情况" tabindex="-1"><a class="header-anchor" href="#消息成为死信的三种情况" aria-hidden="true">#</a> <strong>消息成为死信的三种情况</strong></h2><ol><li>队列消息长度到达限制（按队列的先进先出的方式淘汰）；</li><li>消费者拒接消费消息，basicNack/basicReject,<strong>并且不把消息重新放入原目标队列,requeue=false；</strong><ol><li>如接到的消息存在在业务处理过程中出现bug,可以将这个消息变成死信</li></ol></li><li><strong>原队列存在消息过期设置，消息到达超时时间未被消费；</strong></li></ol><h2 id="队列绑定死信交换机-⭐" tabindex="-1"><a class="header-anchor" href="#队列绑定死信交换机-⭐" aria-hidden="true">#</a> **队列绑定死信交换机：**⭐</h2><p>给队列设置参数： x-dead-letter-exchange 和 x-dead-letter-routing-key</p><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token comment">&lt;!--\n        死信队列：\n            1. 声明正常的队列(test_queue_dlx)和交换机(test_exchange_dlx)\n            2. 声明死信队列(queue_dlx)和死信交换机(exchange_dlx)\n            3. 正常队列绑定死信交换机\n                设置两个参数：\n                    * x-dead-letter-exchange：死信交换机名称\n                    * x-dead-letter-routing-key：发送给死信交换机的routingkey\n    --&gt;</span>\n\n    <span class="token comment">&lt;!--\n        1. 声明正常的队列(test_queue_dlx)和交换机(test_exchange_dlx)\n    --&gt;</span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>queue</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>test_queue_dlx<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>test_queue_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n<span class="token comment">&lt;!--        3. 正常队列绑定死信交换机--&gt;</span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>queue-arguments</span><span class="token punctuation">&gt;</span></span>\n<span class="token comment">&lt;!--            3.1 x-dead-letter-exchange：死信交换机名称--&gt;</span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>entry</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>x-dead-letter-exchange<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>exchange_dlx<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n\n<span class="token comment">&lt;!--            3.2 x-dead-letter-routing-key：发送给死信交换机的routingkey--&gt;</span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>entry</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>x-dead-letter-routing-key<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dlx.anthor.for.learn.test.xxx<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n\n<span class="token comment">&lt;!--            4.1 设置队列的过期时间 ttl--&gt;</span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>entry</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>x-message-ttl<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>10000<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value-type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>java.lang.Integer<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n<span class="token comment">&lt;!--            4.2 设置队列的长度限制 max-length --&gt;</span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>entry</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>x-max-length<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>10<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value-type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>java.lang.Integer<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>queue-arguments</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>queue</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>topic-exchange</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>test_exchange_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>bindings</span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>binding</span> <span class="token attr-name">pattern</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>test.dlx.#<span class="token punctuation">&quot;</span></span> <span class="token attr-name">queue</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>test_queue_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>binding</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>bindings</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>topic-exchange</span><span class="token punctuation">&gt;</span></span>\n\n\n    <span class="token comment">&lt;!--\n       2. 声明死信队列(queue_dlx)和死信交换机(exchange_dlx)\n   --&gt;</span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>queue</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queue_dlx<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queue_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>queue</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>topic-exchange</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>exchange_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>bindings</span><span class="token punctuation">&gt;</span></span>\n            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">rabbit:</span>binding</span> <span class="token attr-name">pattern</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dlx.#<span class="token punctuation">&quot;</span></span> <span class="token attr-name">queue</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queue_dlx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>binding</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>bindings</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">rabbit:</span>topic-exchange</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br></div></div><h2 id="死信队列小结" tabindex="-1"><a class="header-anchor" href="#死信队列小结" aria-hidden="true">#</a> <strong>死信队列小结</strong></h2><ol><li>死信交换机和死信队列和普通的没有区别</li><li>当消息成为死信后，如果该队列绑定了死信交换机，则消息会被死信交换机重新路由到死信队列 <ol><li>他们的关联点在于设置该队列的x-dead-letter-exchange 和 x-dead-letter-routing-key</li></ol></li></ol>',11),p={},e=(0,s(66262).A)(p,[["render",function(n,a){return t}]])},66262:(n,a)=>{a.A=(n,a)=>{const s=n.__vccOpts||n;for(const[n,t]of a)s[n]=t;return s}}}]);
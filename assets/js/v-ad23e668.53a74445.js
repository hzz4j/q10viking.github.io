"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[29169],{15790:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-ad23e668",path:"/kafka/09%20%E4%BC%98%E5%8C%96.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/kafka/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"处理消息丢失情况",slug:"处理消息丢失情况",children:[{level:3,title:"消息发送端",slug:"消息发送端",children:[]},{level:3,title:"消息接收端",slug:"消息接收端",children:[]}]},{level:2,title:"消息重复消费",slug:"消息重复消费",children:[{level:3,title:"消息发送端",slug:"消息发送端-1",children:[]},{level:3,title:"消息消费端",slug:"消息消费端",children:[]}]},{level:2,title:"消息乱序",slug:"消息乱序",children:[]},{level:2,title:"消息积压",slug:"消息积压",children:[]},{level:2,title:"延时队列",slug:"延时队列",children:[]},{level:2,title:"消息回溯",slug:"消息回溯",children:[]},{level:2,title:"分区数越多吞吐量越高吗",slug:"分区数越多吞吐量越高吗",children:[]},{level:2,title:"消息传递保障",slug:"消息传递保障",children:[]},{level:2,title:"kafka事务",slug:"kafka事务",children:[]}],filePathRelative:"kafka/09 优化.md"}},87810:(n,s,a)=>{a.r(s),a.d(s,{default:()=>l});var p=a(20641);const t=(0,p.Fv)('<h2 id="处理消息丢失情况" tabindex="-1"><a class="header-anchor" href="#处理消息丢失情况" aria-hidden="true">#</a> 处理消息丢失情况</h2><h3 id="消息发送端" tabindex="-1"><a class="header-anchor" href="#消息发送端" aria-hidden="true">#</a> <strong>消息发送端</strong></h3><ol><li><p>acks=0： 表示producer不需要等待任何broker确认收到消息的回复，就可以继续发送下一条消息。性能最高，但是最容易丢消息。大数据统计报表场景，对性能要求很高，对数据丢失不敏感的情况可以用这种。</p></li><li><p>acks=1： 至少要等待leader已经成功将数据写入本地log，但是不需要等待所有follower是否成功写入。就可以继续发送下一条消息。这种情况下，如果follower没有成功备份数据，而此时leader又挂掉，则消息会丢失。</p></li><li><p>acks=-1或all： 这意味着leader需要等待所有备份(min.insync.replicas配置的备份个数)都成功写入日志，这种策略会保证只要有一个备份存活就不会丢失数据。这是最强的数据保证。一般除非是金融级别，或跟钱打交道的场景才会使用这种配置。当然如果min.insync.replicas配置的是1则也可能丢消息，跟acks=1情况类似。</p></li></ol><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>\n  <span class="token key atrule">kafka</span><span class="token punctuation">:</span>\n    <span class="token key atrule">bootstrap-servers</span><span class="token punctuation">:</span> 172.29.96.105<span class="token punctuation">:</span><span class="token number">9092</span><span class="token punctuation">,</span>172.29.96.105<span class="token punctuation">:</span><span class="token number">9093</span><span class="token punctuation">,</span>172.29.96.105<span class="token punctuation">:</span><span class="token number">9094</span>\n    <span class="token key atrule">producer</span><span class="token punctuation">:</span>\n      <span class="token key atrule">key-serializer</span><span class="token punctuation">:</span> org.apache.kafka.common.serialization.StringSerializer\n      <span class="token key atrule">value-serializer</span><span class="token punctuation">:</span> org.apache.kafka.common.serialization.StringSerializer\n      <span class="token key atrule">acks</span><span class="token punctuation">:</span> <span class="token number">1</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="消息接收端" tabindex="-1"><a class="header-anchor" href="#消息接收端" aria-hidden="true">#</a> 消息接收端</h3><p>如果消费这边配置的是自动提交，万一消费到数据还没处理完，就自动提交offset了，但是此时你consumer直接宕机了，未处理完的数据丢失了，下次也消费不到了</p><blockquote><p>配置为手动提交offset</p></blockquote><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>\n  <span class="token key atrule">kafka</span><span class="token punctuation">:</span>\n    <span class="token key atrule">listener</span><span class="token punctuation">:</span>\n      <span class="token comment"># 当每一条记录被消费者监听器（ListenerConsumer）处理之后提交</span>\n      <span class="token comment"># RECORD</span>\n      <span class="token comment"># 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后提交</span>\n      <span class="token comment"># BATCH</span>\n      <span class="token comment"># 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后，距离上次提交时间大于TIME时提交</span>\n      <span class="token comment"># TIME</span>\n      <span class="token comment"># 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后，被处理record数量大于等于COUNT时提交</span>\n      <span class="token comment"># COUNT</span>\n      <span class="token comment"># TIME |　COUNT　有一个条件满足时提交</span>\n      <span class="token comment"># COUNT_TIME</span>\n      <span class="token comment"># 当每一批poll()的数据被消费者监听器（ListenerConsumer）处理之后, 手动调用Acknowledgment.acknowledge()后提交</span>\n      <span class="token comment"># MANUAL</span>\n      <span class="token comment"># 手动调用Acknowledgment.acknowledge()后立即提交</span>\n      <span class="token comment"># MANUAL_IMMEDIATE</span>\n      <span class="token key atrule">ack-mode</span><span class="token punctuation">:</span> manual_immediate\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@KafkaListener</span><span class="token punctuation">(</span>topics <span class="token operator">=</span> <span class="token class-name">KafkaConsts</span><span class="token punctuation">.</span><span class="token constant">TOPIC</span><span class="token punctuation">,</span> groupId <span class="token operator">=</span> <span class="token string">&quot;q10viking-group&quot;</span><span class="token punctuation">,</span>concurrency <span class="token operator">=</span> <span class="token string">&quot;3&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">listenJavaCLusterTopic</span><span class="token punctuation">(</span><span class="token class-name">ConsumerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> record<span class="token punctuation">,</span> <span class="token class-name">Acknowledgment</span> ack<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;listenJavaCLusterTopic receive message: partition={} offset={} key={} - value={}&quot;</span><span class="token punctuation">,</span>\n             record<span class="token punctuation">.</span><span class="token function">partition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>record<span class="token punctuation">.</span><span class="token function">offset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> record<span class="token punctuation">.</span><span class="token function">key</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>record<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    ack<span class="token punctuation">.</span><span class="token function">acknowledge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="消息重复消费" tabindex="-1"><a class="header-anchor" href="#消息重复消费" aria-hidden="true">#</a> 消息重复消费</h2><h3 id="消息发送端-1" tabindex="-1"><a class="header-anchor" href="#消息发送端-1" aria-hidden="true">#</a> <strong>消息发送端</strong></h3><p>发送消息如果配置了重试机制，比如网络抖动时间过长导致发送端发送超时，实际broker可能已经接收到消息，但发送方会重新发送消息</p><h3 id="消息消费端" tabindex="-1"><a class="header-anchor" href="#消息消费端" aria-hidden="true">#</a> <strong>消息消费端</strong></h3><p>如果消费这边配置的是自动提交，刚拉取了一批数据处理了一部分，但还没来得及提交，服务挂了，下次重启又会拉取相同的一批数据重复处理</p><blockquote><p>一般消费端都是要做<strong>消费幂等</strong>处理的。</p></blockquote><h2 id="消息乱序" tabindex="-1"><a class="header-anchor" href="#消息乱序" aria-hidden="true">#</a> 消息乱序</h2><p>如果发送端配置了重试机制，kafka不会等之前那条消息完全发送成功才去发送下一条消息，这样可能会出现，发送了1，2，3条消息，第一条超时了，后面两条发送成功，再重试发送第1条消息，这时消息在broker端的顺序就是2，3，1了</p><p>所以，是否一定要配置重试要根据业务情况而定。也可以用同步发送的模式去发消息，当然acks不能设置为0，这样也能保证消息发送的有序。</p><p>kafka保证全链路消息顺序消费，需要从发送端开始，将所有有序消息发送到同一个分区，然后用一个消费者去消费，但是这种性能比较低，可以在消费者端接收到消息后将需要保证顺序消费的几条消费发到内存队列(可以搞多个)，一个内存队列开启一个线程顺序处理消息</p><h2 id="消息积压" tabindex="-1"><a class="header-anchor" href="#消息积压" aria-hidden="true">#</a> 消息积压</h2><blockquote><p>生产端过快</p></blockquote><p>线上有时因为发送方发送消息速度过快，或者消费方处理消息过慢，可能会导致broker积压大量未消费消息。</p><p>此种情况如果积压了上百万未消费消息需要紧急处理，可以修改消费端程序，让其将收到的消息快速转发到其他topic(可以设置很多分区)，然后再启动多个消费者同时消费新主题的不同分区。</p><blockquote><p>消费端情况</p></blockquote><p>由于消息数据格式变动或消费者程序有bug，导致消费者一直消费不成功，也可能导致broker积压大量未消费消息。</p><p>此种情况可以将这些消费不成功的消息转发到其它队列里去(类似<strong>死信队列</strong>)，后面再慢慢分析死信队列里的消息处理问题</p><h2 id="延时队列" tabindex="-1"><a class="header-anchor" href="#延时队列" aria-hidden="true">#</a> 延时队列</h2><p>延时队列存储的对象是延时消息。所谓的“延时消息”是指消息被发送以后，并不想让消费者立刻获取，而是等待特定的时间后，消费者才能获取这个消息进行消费，延时队列的使用场景有很多， 比如 ：</p><p>1）在订单系统中， 一个用户下单之后通常有 30 分钟的时间进行支付，如果 30 分钟之内没有支付成功，那么这个订单将进行异常处理，这时就可以使用延时队列来处理这些订单了。</p><p>2）订单完成1小时后通知用户进行评价。</p><p>**实现思路：**发送延时消息时先把消息按照不同的延迟时间段发送到指定的队列中（topic_1s，topic_5s，topic_10s，...topic_2h，这个一般不能支持任意时间段的延时），然后通过定时器进行轮训消费这些topic，查看消息是否到期，如果到期就把这个消息发送到具体业务处理的topic中，队列中消息越靠前的到期时间越早，具体来说就是定时器在一次消费过程中，对消息的发送时间做判断，看下是否延迟到对应时间了，如果到了就转发，如果还没到将该消息又返送回去。</p>',31),e={href:"https://baijiahao.baidu.com/s?id=1759797229483551869&wfr=spider&for=pc",target:"_blank",rel:"noopener noreferrer"},o=(0,p.Fv)('<p><img src="/images/kafka/d4628535e5dde711a2303a9b91ce1b109c1661ad.png@f_auto" alt="img"></p><h2 id="消息回溯" tabindex="-1"><a class="header-anchor" href="#消息回溯" aria-hidden="true">#</a> 消息回溯</h2><p>如果某段时间对已消费消息计算的结果觉得有问题，可能是由于程序bug导致的计算错误，当程序bug修复后，这时可能需要对之前已消费的消息重新消费，可以指定从多久之前的消息回溯消费，这种可以用consumer的offsetsForTimes、seek等方法指定从某个offset偏移的消息开始消费。</p><h2 id="分区数越多吞吐量越高吗" tabindex="-1"><a class="header-anchor" href="#分区数越多吞吐量越高吗" aria-hidden="true">#</a> <strong>分区数越多吞吐量越高吗</strong></h2><p>网络上很多资料都说分区数越多吞吐量越高 ， 但从压测结果来看，分区数到达某个值吞吐量反而开始下降，实际上很多事情都会有一个临界值，当超过这个临界值之后，很多原本符合既定逻辑的走向又会变得不同。一般情况分区数跟集群机器数量相当就差不多了。</p><p>当然吞吐量的数值和走势还会和磁盘、文件系统、 I/O调度策略等因素相关。</p><p>注意：如果分区数设置过大，比如设置10000，可能会设置不成功，后台会报错&quot;java.io.IOException : Too many open files&quot;。</p><p>异常中最关键的信息是“ Too many open flies”，这是一种常见的 Linux 系统错误，通常意味着文件描述符不足，它一般发生在创建线程、创建 Socket、打开文件这些场景下 。 在 Linux系统的默认设置下，这个文件描述符的个数不是很多 ，通过 ulimit -n 命令可以查看：一般默认是1024，可以将该值增大，比如：ulimit -n 65535</p><h2 id="消息传递保障" tabindex="-1"><a class="header-anchor" href="#消息传递保障" aria-hidden="true">#</a> <strong>消息传递保障</strong></h2><ul><li>at most once(消费者最多收到一次消息，0--1次)：acks = 0 可以实现。</li><li>at least once(消费者至少收到一次消息，1--多次)：ack = all 可以实现。</li><li>exactly once(消费者刚好收到一次消息)：at least once 加上消费者幂等性可以实现，还可以用<strong>kafka生产者的幂等性</strong>来实现。</li></ul><p><strong>kafka生产者的幂等性</strong>：因为发送端重试导致的消息重复发送问题，kafka的幂等性可以保证重复发送的消息只接收一次，只需在生产者加上参数 props.put(“enable.idempotence”, true) 即可，默认是false不开启。</p><p>具体实现原理是，kafka每次发送消息会生成PID和Sequence Number，并将这两个属性一起发送给broker，broker会将PID和Sequence Number跟消息绑定一起存起来，下次如果生产者重发相同消息，broker会检查PID和Sequence Number，如果相同不会再接收。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>PID：每个新的 Producer 在初始化的时候会被分配一个唯一的 PID，这个PID 对用户完全是透明的。生产者如果重启则会生成新的PID。\nSequence Number：对于每个 PID，该 Producer 发送到每个 Partition 的数据都有对应的序列号，这些序列号是从0开始单调递增的。\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="kafka事务" tabindex="-1"><a class="header-anchor" href="#kafka事务" aria-hidden="true">#</a> kafka事务</h2><p>Kafka的事务不同于Rocketmq，Rocketmq是保障本地事务(比如数据库)与mq消息发送的事务一致性，Kafka的事务主要是保障一次发送多条消息的事务一致性(要么同时成功要么同时失败)，一般在kafka的流式计算场景用得多一点，比如，kafka需要对一个topic里的消息做不同的流式计算处理，处理完分别发到不同的topic里，这些topic分别被不同的下游系统消费(比如hbase，redis，es等)，这种我们肯定希望系统发送到多个topic的数据保持事务一致性。Kafka要实现类似Rocketmq的分布式事务需要额外开发功能。</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token class-name">Properties</span> props <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;bootstrap.servers&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;localhost:9092&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;transactional.id&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;my-transactional-id&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token class-name">Producer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> producer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KafkaProducer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">StringSerializer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">StringSerializer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token comment">//初始化事务</span>\n producer<span class="token punctuation">.</span><span class="token function">initTransactions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n <span class="token keyword">try</span> <span class="token punctuation">{</span>\n     <span class="token comment">//开启事务</span>\n     producer<span class="token punctuation">.</span><span class="token function">beginTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n     <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n         <span class="token comment">//发到不同的主题的不同分区</span>\n         producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token string">&quot;hdfs-topic&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n         producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token string">&quot;es-topic&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n         producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token string">&quot;redis-topic&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n     <span class="token punctuation">}</span>\n     <span class="token comment">//提交事务</span>\n     producer<span class="token punctuation">.</span><span class="token function">commitTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">ProducerFencedException</span> <span class="token operator">|</span> <span class="token class-name">OutOfOrderSequenceException</span> <span class="token operator">|</span> <span class="token class-name">AuthorizationException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     <span class="token comment">// We can&#39;t recover from these exceptions, so our only option is to close the producer and exit.</span>\n     producer<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">KafkaException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     <span class="token comment">// For all other exceptions, just abort the transaction and try again.</span>\n     <span class="token comment">//回滚事务</span>\n     producer<span class="token punctuation">.</span><span class="token function">abortTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n producer<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div>',16),c={},l=(0,a(66262).A)(c,[["render",function(n,s){const a=(0,p.g2)("OutboundLink");return(0,p.uX)(),(0,p.CE)(p.FK,null,[t,(0,p.Lk)("blockquote",null,[(0,p.Lk)("p",null,[(0,p.eW)("参考："),(0,p.Lk)("a",e,[(0,p.eW)("时间的魔法师：探究Kafka中的延迟队列"),(0,p.bF)(a)])])]),o],64)}]])},66262:(n,s)=>{s.A=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);
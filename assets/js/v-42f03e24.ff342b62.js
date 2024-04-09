"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[5054],{53943:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-42f03e24",path:"/ElasticStack/20%20%E5%85%B3%E9%94%AE%E5%AD%97%E5%88%86%E9%A1%B5%E6%90%9C%E7%B4%A2.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/ElasticStack/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"分页查询",slug:"分页查询",children:[]},{level:2,title:"from和size来进行分页",slug:"from和size来进行分页",children:[]},{level:2,title:"scroll深分页❤️",slug:"scroll深分页❤️",children:[{level:3,title:"第一次使用scroll分页查询",slug:"第一次使用scroll分页查询",children:[]},{level:3,title:"第二次使用scroll分页查询",slug:"第二次使用scroll分页查询",children:[]}]}],filePathRelative:"ElasticStack/20 关键字分页搜索.md"}},42825:(s,n,a)=>{a.r(n),a.d(n,{default:()=>t});const e=(0,a(20641).Fv)('<h2 id="分页查询" tabindex="-1"><a class="header-anchor" href="#分页查询" aria-hidden="true">#</a> 分页查询</h2><p>在存在大量数据时，一般我们进行查询都需要进行分页查询。例如：我们指定页码、并指定每页显示多少条数据，然后Elasticsearch返回对应页码的数据。</p><h2 id="from和size来进行分页" tabindex="-1"><a class="header-anchor" href="#from和size来进行分页" aria-hidden="true">#</a> <strong>from和size来进行分页</strong></h2><p>在执行查询时，可以指定from（从第几条数据开始查起）和size（每页返回多少条）数据，就可以轻松完成分页</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code>POST /es_db/_doc/_search\n<span class="token punctuation">{</span>\n  <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;size&quot;</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">&quot;match&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">&quot;address&quot;</span><span class="token operator">:</span> <span class="token string">&quot;广州天河&quot;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="scroll深分页❤️" tabindex="-1"><a class="header-anchor" href="#scroll深分页❤️" aria-hidden="true">#</a> scroll深分页❤️</h2><p>前面使用from和size方式，查询在1W条数据以内都是OK的，但如果数据比较多的时候，会出现性能问题。Elasticsearch做了一个限制，不允许查询的是10000条以后的数据。如果要查询1W条以后的数据，需要使用Elasticsearch中提供的scroll游标来查询</p><p>在进行大量分页时，<strong>每次分页都需要将要查询的数据进行重新排序，这样非常浪费性能</strong>。<strong>使用scroll是将要用的数据一次性排序好，然后分批取出</strong>。性能要比from + size好得多。使用scroll查询后，<strong>排序后的数据会保持一定的时间，后续的分页查询都从该快照取数据即可</strong>。</p><h3 id="第一次使用scroll分页查询" tabindex="-1"><a class="header-anchor" href="#第一次使用scroll分页查询" aria-hidden="true">#</a> 第一次使用scroll分页查询</h3><p>此处，我们让排序的数据保持1分钟，所以设置scroll为1m</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code>GET /es_db/_search?scroll=1m\n<span class="token punctuation">{</span>\n  <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">&quot;multi_match&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">&quot;query&quot;</span><span class="token operator">:</span> <span class="token string">&quot;广州长沙张三&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;fields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">&quot;address&quot;</span><span class="token punctuation">,</span>\n        <span class="token string">&quot;name&quot;</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;size&quot;</span><span class="token operator">:</span> <span class="token number">100</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><img src="/images/elasticsearch/image-20211113021022284.png" alt=""></p><p>执行后，我们注意到，在响应结果中有一项：</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>&quot;_scroll_id&quot;: &quot;DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAARfMWOGtYNzR3WERTQ1NaU1dRVWh0R2xNQQ==&quot;\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>后续，我们需要根据这个_scroll_id来进行查询</p><h3 id="第二次使用scroll分页查询" tabindex="-1"><a class="header-anchor" href="#第二次使用scroll分页查询" aria-hidden="true">#</a> 第二次使用scroll分页查询</h3><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code>GET _search/scroll?scroll=1m\n<span class="token punctuation">{</span>\n  <span class="token property">&quot;scroll_id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAARfMWOGtYNzR3WERTQ1NaU1dRVWh0R2xNQQ==&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>',17),p={},t=(0,a(66262).A)(p,[["render",function(s,n){return e}]])},66262:(s,n)=>{n.A=(s,n)=>{const a=s.__vccOpts||s;for(const[s,e]of n)a[s]=e;return a}}}]);
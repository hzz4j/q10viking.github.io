"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[9355],{48634:(e,r,t)=>{t.r(r),t.d(r,{data:()=>n});const n={key:"v-57d37665",path:"/concurrency/66%20%E7%BA%BF%E7%A8%8B%E6%B1%A0%E7%BA%BF%E7%A8%8B%E6%95%B0%E6%80%8E%E4%B9%88%E8%AE%BE%E7%BD%AE.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/concurrency/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[{level:2,title:"线程池中核心线程数量大小怎么设置",slug:"线程池中核心线程数量大小怎么设置",children:[]}],filePathRelative:"concurrency/66 线程池线程数怎么设置.md"}},97697:(e,r,t)=>{t.r(r),t.d(r,{default:()=>i});var n=t(20641);const l=(0,n.Lk)("h2",{id:"线程池中核心线程数量大小怎么设置",tabindex:"-1"},[(0,n.Lk)("a",{class:"header-anchor",href:"#线程池中核心线程数量大小怎么设置","aria-hidden":"true"},"#"),(0,n.eW)(" 线程池中核心线程数量大小怎么设置")],-1),c=(0,n.Lk)("p",null,[(0,n.Lk)("strong",null,"CPU密集型任务"),(0,n.eW)("：比如像加解密，压缩、计算等一系列需要大量耗费 CPU 资源的任务，大部分场景下都是纯 CPU 计算。尽量使用较小的线程池，一般为CPU核心数+1。因为CPU密集型任务使得CPU使用率很高，若开过多的线程数，会造成CPU过度切换。")],-1),u=(0,n.Lk)("p",null,[(0,n.Lk)("strong",null,"IO密集型任务"),(0,n.eW)("：比如像 MySQL 数据库、文件的读写、网络通信等任务，这类任务不会特别消耗 CPU 资源，但是 IO 操作比较耗时，会占用比较多时间。可以使用稍大的线程池，一般为2*CPU核心数。IO密集型任务CPU使用率并不高，因此可以让CPU在等待IO的时候有其他线程去处理别的任务，充分利用CPU时间。")],-1),a={},i=(0,t(66262).A)(a,[["render",function(e,r){return(0,n.uX)(),(0,n.CE)(n.FK,null,[l,c,u],64)}]])},66262:(e,r)=>{r.A=(e,r)=>{const t=e.__vccOpts||e;for(const[e,n]of r)t[e]=n;return t}}}]);
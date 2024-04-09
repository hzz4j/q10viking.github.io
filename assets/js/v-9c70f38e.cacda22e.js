"use strict";(self.webpackChunkq10viking_github_io=self.webpackChunkq10viking_github_io||[]).push([[15489],{24447:(l,t,e)=>{e.r(t),e.d(t,{data:()=>n});const n={key:"v-9c70f38e",path:"/JVM/26%20GC%E4%B8%80%E6%AC%A1%E5%AE%8C%E6%95%B4%E6%B5%81%E7%A8%8B.html",title:"",lang:"zh-CN",frontmatter:{sidebarDepth:3,sidebar:"auto",prev:{text:"Back To 目录",link:"/JVM/"},"typora-root-url":"..\\.vuepress\\public"},excerpt:"",headers:[],filePathRelative:"JVM/26 GC一次完整流程.md"}},97908:(l,t,e)=>{e.r(t),e.d(t,{default:()=>a});var n=e(20641);const u=(0,n.Lk)("p",null,"JVM中的垃圾回收是自动进行的，它的目标是回收不再使用的对象，释放内存空间，并且保证程序的正常运行。下面是一次完整的GC流程的一般步骤：",-1),i=(0,n.Lk)("ol",null,[(0,n.Lk)("li",null,"标记阶段：GC从根对象开始，通过根对象的引用链，标记所有可达的对象。根对象包括活动线程的栈帧中的局部变量、静态变量、JNI引用等。"),(0,n.Lk)("li",null,"垃圾标记：在标记阶段完成后，GC会确定哪些对象是垃圾对象，即不可达对象。这些对象将被标记为垃圾，可以被回收。"),(0,n.Lk)("li",null,"垃圾回收：在标记阶段完成后，GC会执行垃圾回收操作，回收被标记为垃圾的对象所占用的内存空间。回收的方式有不同的算法，例如标记-清除、复制、标记-整理等。"),(0,n.Lk)("li",null,"内存整理：在垃圾回收完成后，可能会产生内存碎片。为了提高内存的利用率，GC可能会对内存空间进行整理，将存活的对象紧凑地排列在一起，以便更好地分配新的对象。"),(0,n.Lk)("li",null,"内存分配：在垃圾回收和内存整理完成后，GC会为新的对象分配内存空间。分配的方式有不同的算法，例如指针碰撞、空闲列表等。"),(0,n.Lk)("li",null,"重新分配对象引用：在垃圾回收和内存分配完成后，GC会更新对象之间的引用关系，确保引用指向正确的对象")],-1),r={},a=(0,e(66262).A)(r,[["render",function(l,t){return(0,n.uX)(),(0,n.CE)(n.FK,null,[u,i],64)}]])},66262:(l,t)=>{t.A=(l,t)=>{const e=l.__vccOpts||l;for(const[l,n]of t)e[l]=n;return e}}}]);
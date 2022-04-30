## SpringBoot自动配置的原理

SpringBoot集成第三方的组件，都是有@EnableXXX,@import

延迟，分组的特性DeferredImportSelector+Condition来处理springboot约定配置的许多bean,以及解决顺序问题

DeferredImportSelector还有一个Group，会调用process方法来处理spring.factories文件

Spring.factories 配置中的类筛选，根据key,**再根据starter场景启动器,以及配置的Condition**，使得类变成bean放入到容器中生效

看配置类的定制方式，来自己覆盖，或者根据全局配置文件

---------

依赖的类报红效果，maven 的optional 设置为true,不会传递




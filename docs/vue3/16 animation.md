::: tip

[进入过渡 & 离开过渡 | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/guide/transitions-enterleave.html#单元素-组件的过渡)

:::

## transition组件

::: tip

Vue 提供了 `transition` 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

:one: 有一个name属性

:::

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件
- 组件根节点

### 过渡 class

::: tip

在进入/离开的过渡中，会有 6 个 class 切换

:::

![](https://v3.cn.vuejs.org/images/transitions.svg)

#### 进入

1. `*-enter-from`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `*-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `*-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter-from` 被移除)，在过渡/动画完成之后移除。

![image](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112161008738.jpg)



### 离开

1. `*-leave-from`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
2. `*-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
3. `*-leave-to`：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave-from` 被移除)，在过渡/动画完成之后移除。

![image (1)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112161016190.jpg)

### 示例

```vue {3-5,20-30}
<template>
  <button @click="flag = !flag">Toggle Button</button>
  <transition name="fade">
    <h1 v-if="flag">Hello Animation</h1>
  </transition>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      flag: false,
    };
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 2.25s linear;
}

.fade-leave-to{
  opacity: 0;
}

</style>
```


<template>
  <button @click="flag = !flag">Toggle Button</button>
  <transition name="zoom" type="transition" appear>
    <h2 v-if="flag" key="main">Transaction With Animation</h2>
  </transition>
</template>

<script>
export default {
  name: "transition-with-animation",
  data() {
    return {
      flag: true,
    };
  },
};
</script>

<style scoped>
h2 {
  width: 50vw;
  height: 200px;
  padding: 20px;
  border: 5px solid black;
  background-color: rgb(238, 161, 19);
  text-align: center;
}
/* -------------过渡效果-------------------- */
.zoom-enter-from {
  opacity: 0;
}

.zoom-enter-active {
  animation: zoom-in 1s linear forwards;
  transition: all 2s linear;
}

.zoom-leave-active {
  animation: zoom-out 1s linear forwards;
  transition: all 2s linear;
}

.zoom-leave-to {
  opacity: 0;
}
/* ----------------动画----------------------- */

@keyframes zoom-in {
  from {
    transform: scale(0, 0);
  }

  to {
    transform: scale(1, 1);
  }
}

@keyframes zoom-out {
  from {
    transform: scale(1, 1);
  }

  to {
    transform: scale(0, 0);
  }
}
</style>
<template>
  <iframe
    id="embed_dom"
    name="embed_dom"
    frameborder="0"
    :style="`display: block; width: ${width}px; height: ${height}px`"
    :src="src"
  ></iframe>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
      require: true,
    },
    width: {
      type: Number,
      default: 625,
    },
    height: {
      type: Number,
      default: 345,
    },
  },
};
</script>

<style>
</style>
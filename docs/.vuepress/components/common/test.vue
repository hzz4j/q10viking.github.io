<template>
  <div id="root">
      {{msg}}
  </div>
</template>

<script>
export default {
    setup(){
        const msg = 'Vuepress Using Vue Component'
        return {
            msg
        }
    },
    methods: {
        greet(e){
            alert('😁'+this.msg)
        }
    }
}
</script>

<style>

</style>
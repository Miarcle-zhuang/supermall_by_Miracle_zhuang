<template>
  <div id="tab-bar" class="ignore">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBar"
  }
</script>

<style scoped>
  #tab-bar {
    display: flex;
    background-color: #f6f6f6;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    /*rgba()最后一个参数表示透明程度*/
    box-shadow: 0 -1px 1px rgba(100,100,100,.1);
  }
</style>

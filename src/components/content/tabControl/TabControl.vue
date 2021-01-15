<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles" class="tab-control-item" :class="{active: index == currentIndex}" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      itemClick(index){
        this.currentIndex = index;
        //子传父,使用$emit,其中tabClick是自定义事件,index是传给tabClick的参数
        this.$emit('tabClick', index);
      }
    },
    data() {
      return {
        currentIndex: 0
        /*currentIndex: 1*/
      }
    }
  }
</script>

<style scoped>
  .tab-control {
    display: flex;
    background-color: #fff;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
  }
  .tab-control-item {
    flex: 1;
  }
  .tab-control-item span {
    padding: 5px;
  }
  .active {
    color: var(--color-high-text);
  }
  .active span {
    border-bottom: 2px solid var(--color-tint);
  }
</style>

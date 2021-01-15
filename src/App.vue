<template>
  <div id="app">
    <!--将原来的组件保存,使用缓存中的组件数据,除了Detail组件-->
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  /*不是在dom中使用别名路径(且要满足是在src使用别名路径),components前面才需要加~*/
  import MainTabBar from "components/content/mainTabbar/MainTabBar";

  export default {
    name: 'App',
    components: {
      MainTabBar
    }
  }
</script>

<style>
  @import "./assets/css/base.css";
</style>

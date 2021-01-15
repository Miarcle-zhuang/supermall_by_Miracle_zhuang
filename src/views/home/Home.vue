<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <!--给scroll设置样式是可以实现效果的-->
    <scroll class="content" ref="scroll" :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <home-feature-view></home-feature-view>
      <!--<tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"></tab-control>-->
      <!--下面的方法使用:class="{fixed: isTabFixed}"行不通-->
      <!--<tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl"
                   :class="{fixed: isTabFixed}"></tab-control>-->
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <good-list :goods="showGoods"></good-list>
    </scroll>
    <!--
      默认情况下,组件不能监听原生的事件(如:click),除非当要让组件监听
      原生事件时,需要在事件后面加.native
    -->
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  /*页面组件*/
  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import HomeFeatureView from "./childComps/HomeFeatureView";
  /*公共组件*/
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl"
  import GoodList from "components/content/goods/GoodsList";

  //网络请求数据以及混入数据
  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMinin, backTopMixin} from 'common/mixin'

  /*第三方模块*/
  import Scroll from 'components/common/scroll/Scroll'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll
    },
    data() {
      return {
        //result: null,
        banners: [],
        recommends: [],
        goods: {
          'pop': {
            page: 0,
            list: []
          },
          'new': {
            page: 0,
            list: []
          },
          'sell': {
            page: 0,
            list: []
          }
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    //首页组件创建完发送的网络请求
    created() {
      //1、请求多个数据
     this.getHomeMultidata()

      //2、请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      //把这个当作提醒
      //3、监听事件总线上itemImageLoad事件图片加载完成
      /*this.$bus.$on('itemImageLoad', () => {
        //在created()很可能拿不到this.$refs.scroll,这也是细节的问题
        this.$refs.scroll.refresh();
      })*/
    },
    //下面是混入的mounted中的内容,注意看mixin.js
    mixins: [itemListenerMinin, backTopMixin],
    mounted() {},
    //Home路由活跃时调用这个
    activated() {
      //console.log('activated');
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
    },
    //Home路由不活跃时调用这个
    deactivated() {
      //console.log('deactivated');
      //1、保存Y值
      this.saveY = this.$refs.scroll.getScrollY();
      //this.$refs.scroll.scroll.y是已经滑动的距离
      //console.log(this.$refs.scroll.scroll.y)
      //2、取消全局事件的监听
      //不能向下面那样写,如果这样写,意味着所有的组件itemImageLoad事件都会被取消
      //this.$bus.$off('itemImageLoad') //不能这样写,理由如上
      //下面这样写就可以
      this.$bus.$off('itemImageLoad', this.itemImgLister)
    },
    //切换路由时,Home.vue会被销毁
    destroyed() {
      console.log('home destroyed');
    },
    methods: {
      /*
        事件监听相关的方法
      * */
      tabClick(index) {
        //console.log(index);
        /*this.currentType = */
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        //下面这种思想应该掌握
        //第一种解决方案
        if(this.$refs.tabControl1 !== undefined && this.$refs.tabControl2 !== undefined){
          this.$refs.tabControl1.currentIndex = index;
          this.$refs.tabControl2.currentIndex = index;
        }
      },
      contentScroll(position) {
        //1、判断backTop是否显示
        this.listenShowBackTop(position)
        //2、决定tabControl是否吸顶效果(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
      },
      swiperImageLoad() {
        //2、获取tabControl的offsetTop
        //组件对象中没有offsetTop
        //所有组件中都有一个属性$el：用于获取组件中的元素
        //this.tabControlTop = this.$refs.tabControl;
        //console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /*
        网络请求相关的方法
      * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          //console.log(res);
          //this.result = res;
          //this.banners = res.data.banner.list;
          this.banners = res.data.banner.list;
          //this.recommends = res.data.recommend.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          //console.log(res);
          /*
            num1.push(...num2),其中num1和num2都是数组,使用这个方法,
            可以将num2中数组的元素都放到num1中
          * */
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          this.$refs.scroll.finishPullUp();
        });
      }
    }
  }
</script>

<style scoped>
  #home {
    /*计算wrapper的位置和大小的第一种方案:动态计算,需要注释掉下面那两行代码*/
    /*position: relative;*/
    /*padding-top: 44px;*/
    /*计算wrapper的位置和大小的第二种方案:定位计算,不需要注释掉下面那两行代码*/
    position: relative;
    /*padding-top: 44px;*/
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用浏览器原生滚动时,为了让导航不跟随一起滚动*/
    /*下面的代码已经不需要了*/
    /*position: fixed;
    left: 0px;
    top: 0px;
    right: 0px;
    z-index: 9;*/
  }
  /*
    当还未到达top的值为44px的时候,position的值为static(没有脱离文档流),
    当到达top的值为44px的时候,position的值为sticky,脱离文档流
  */
  /*移动端一般支持这个属性,如果还要兼容IE,就不可以使用这个属性了*/
  /*.tab-control {

    position: sticky;
    top: 44px;
    z-index: 9;
  }*/
  /*下面的方法行不通*/
  /*.fixed {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 44px
  }*/
  /*计算wrapper的位置和大小的第一种方案:动态计算*/
  /*.content {
    margin-top: 44px;
    //calc()是css3的最新属性
    height: calc(100% - 93px);
    !*overflow: hidden;*!
  }*/
  /*计算wrapper的位置和大小的第二种方案:定位计算*/
  .content {
    position: absolute;
    top: 44px;
    bottom: 48px;
    left: 0px;
    right: 0px;
    overflow: hidden;
  }
  .tab-control {
    position: relative;
    z-index: 9
  }
</style>

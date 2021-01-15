<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll">
      <!-- 属性:topImages 传入值:top-images
          (因为传值的时候,浏览器不区分传值的属性是topimages还是topImages(标签也不区分大小写),
          所以可能会出错,因此传top-images比较保险)
      -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <!--
      默认情况下,组件不能监听原生的事件(如:click),除非当要让组件监听
      原生事件时,需要在事件后面加.native
    -->
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!-- 这是Toast的普通方式封装,暂时先去掉 -->
    <!--<toast :message="message" :show="show"></toast>-->
  </div>
</template>

<script>
  //导入子组件
  import DetailNavBar from "./childComponents/DetailNavBar";
  import DetailSwiper from "./childComponents/DetailSwiper";
  import DetailBaseInfo from "./childComponents/DetailBaseInfo";
  import DetailShopInfo from "./childComponents/DetailShopInfo";
  import DetailGoodsInfo from "./childComponents/DetailGoodsInfo";
  import DetailParamInfo from "./childComponents/DetailParamInfo";
  import DetailCommentInfo from "./childComponents/DetailCommentInfo";
  import DetailBottomBar from "./childComponents/DetailBottomBar"

  //导入第三方组件
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  //import Toast from "components/common/toast/Toast";

  //网络请求的方法
  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail"
  import {debounce} from 'common/utils'
  import {itemListenerMinin, backTopMixin} from 'common/mixin'

  /* 将vuex中的actions中的函数进行映射 */
  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },

    //下面是混入的内容,注意看mixin.js
    mixins: [itemListenerMinin, backTopMixin],

    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        //message: '',
        //show: false
      }
    },

    /*
      methods中的函数使用混入(mixin)的话,只会进行覆盖,
      只有vue中的生命周期函数中使用mixin的时候,会进行合并
    * */
    methods: {
      //将vuex中的actions中的函数映射到methods中
      ...mapActions(['addCart']),
      //监听图片的加载
      imageLoad() {
        //this.$refs.scroll.refresh();
        this.refresh();
        this.getThemeTopY();
      },
      //监听detail-nav-tab的点击
      titleClick(index) {
        //console.log(index);
        //点击之后切换到不同的位置
        this.$refs.scroll.scrollTo(0, -(this.themeTopYs[index]), 500);
      },
      //监听详情页的滚动
      contentScroll(position) {
        //console.log(position);
        //1、获取y值
        let positionY = -position.y;
        /*
          2、positionY和主题中的值进行对比
            themeTopYs为[0, 5575, 6378, 6597]
          (1)position在0和5575之间,index=0
          (1)position在=5575和6378之间,index=1
          (1)position在=6378和6597之间,index=2
          (1)position在大于等于6597以及以上,index=3
        * */
        //console.log(this.themeTopYs);
        let length = this.themeTopYs.length;
        for(let i = 0; i < length - 1; i++) {
          //positionY和主题中的值进行对比,有两种情况需要考虑

          //普通做法:普通做法的for循环中,i < length

          //所有条件成立: this.currentIndex = i
          /*
            条件一: 防止赋值的过程过于频繁,即this.currentIndex !== i这个条件
            条件二: ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
                    (i == length - 1 && positionY >= this.themeTopYs[i]))
             -条件1: (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
                -判断区间: 在0和某个数字之间(i < length -1)
             -条件2: (i == length - 1 && positionY >= this.themeTopYs[i])
                -判断大于等于: i === length - 1
           */
          /*if((this.currentIndex !== i) && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
            (i == length - 1 && positionY >= this.themeTopYs[i]))){
            this.currentIndex = i;
            console.log(i);
            this.$refs.nav.currentIndex = this.currentIndex;
          }*/

          //hack做法：hack做法的for循环中,i < length - 1,因为themeTopYs数组中,最后一个元素Number.MAX_VALUE是无意义的

          /*
            2、positionY和主题中的值进行对比
              themeTopYs为[0, 5575, 6378, 6597]
            (1)position在0和5575之间,index=0
            (1)position在=5575和6378之间,index=1
            (1)position在=6378和6597之间,index=2
            (1)position在=6597和非常大的值之间,index=3
                -JS中可以取到的最大值是Number.MAX_VALUE
           */
          //console.log(Number.MAX_VALUE);
          //判断条件越短,性能越高
          if((this.currentIndex !== i) && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            //console.log(i);
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }

        //判断backTop是否显示
        this.listenShowBackTop(position)
      },
      //将商品添加置购物车
      addToCart() {
        //1、获取购物车需要展示的信息
        const product = {};
        product.image = this.topImages[0];
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2、将商品添加到购物车当中
        //$store是src/store/index.js中创建的store对象
        //this.$store.commit('addCart', product);
        //this.$store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 this.$store.dispatch 仍旧返回 Promise
        /*this.$store.dispatch('addCart', product).then(res => {
          console.log(res);
        });*/
        //下面是使用vuex中映射在methods中的addCart函数
        this.addCart(product).then(res => {
          //下面这种是Toast普通的封装方式
          /*this.show = true;
          this.message = res;
          setTimeout(() => {
            this.show = false;
            this.message = '';
          }, 1000)*/
          //下面这种是Toast的插件封装方式
          this.$toast.show(res, 1000);
          //下面是传默认值的做法
          //this.$toast.show();
        })
      }
    },
    created() {
      //1、保存传入的iid
      //console.log(this.$route.params);
      this.iid = this.$route.params.iid
      //2、根据iid请求详情页数据
      getDetail(this.iid).then(res => {
        //console.log(res);
        //当很多次使用到res.result的时候,才需要这样
        const data = res.result;
        //1、获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages;
        //2、获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3、获取店铺信息对象
        this.shop = new Shop(data.shopInfo)
        //4、获取商品详细信息
        this.detailInfo = data.detailInfo
        //5、获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6、获取商品评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //下面是第一次获取
        /*
          1、第一次获取,值不对,
          2、值不对的原因是this.$refs.params.$el压根没有渲染
        * */
        /*this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);*/

        //下面是第二次获取
        /*
          1、第二次获取:值不对
          2、值不对的原因:图片没有计算在内
        * */
        //这里是等上面的数据都渲染完了,再调用的函数
        //调用$nextTick()的时候,仅仅是数据渲染完了,图片可能还没加载完
       /* this.$nextTick(() => {
          // (1)根据最新的数据,对应的DOM是已经被渲染出来的,
          //    但是图片依然没有加载完(目前获取到的的offsetTop是不包含
          //    其中的图片的)
          // (2)offsetTop值不对的时候,都是因为图片的问题
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          console.log(this.themeTopYs);
        })*/
      })
      //3、请求详情页推荐数据
      getRecommend().then(res => {
        //console.log(res);
        //获取推荐的信息
        this.recommends = res.data.list;
      })
      //4、给getThemeTopY赋值(给this.themeTopYs赋值的操作进行一次防抖)
      this.getThemeTopY = debounce(() => {
        //console.log('----');
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //themeTopYs数组中多加一个Number.MAX_VALUE, 占用的内存空间很小
        this.themeTopYs.push(Number.MAX_VALUE);
        //console.log(this.themeTopYs);
      },500);
    },
    mounted() {},
    destroyed() {
      //console.log('destroyed');
      this.$bus.$off('itemImageLoad', this.itemImgLister);
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    /*里面可以带单位*/
    /*这里的100%相对的是父元素高度的100%*/
    height: calc(100% - 44px - 49px);
  }
</style>

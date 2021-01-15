<template>
  <div class="goods-item">
    <!--只要有一张图片加载完就会调用imageLoad函数-->
    <!-- 没有使用懒加载的代码 -->
    <!--<img :src="showImage" alt="" @load="imageLoad" @click="itemClick">-->
    <!--  使用了懒加载的代码 -->
    <img v-lazy="showImage" alt="" @load="imageLoad" @click="itemClick">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItemCategory",
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      showImage() {
        return this.goodsItem.image;
      }
    },
    methods: {
      imageLoad() {
        //console.log('图片加载完了');
        //console.log(this.$bus);
        //第一种解决方案
        /*if(this.$route.path.indexOf('/home')) {
          this.$bus.$emit('homeItemImageLoad');
        }else {
          this.$bus.$emit('detailItemImageLoad');
        }*/
        //第二种解决方案,另一份代码见Home.vue
        this.$bus.$emit('itemImageLoad');
      },
      itemClick() {
        //console.log('跳转到详情页');
        this.$router.push('/detail/' + this.goodsItem.iid)
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>

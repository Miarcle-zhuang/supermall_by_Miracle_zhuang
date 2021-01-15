import {debounce} from 'common/utils';
import BackTop from "components/content/backTop/BackTop";

//这是Vue的高级用法--混入(mix in)
export const itemListenerMinin = {
  data() {
    return {
      itemImgLister: null,
      refresh: null
    }
  },
  //这些也可以提出来混入
  components: {},
  methods: {},
  mounted() {
    //1、图片加载完成的事件监听
    this.refresh = debounce(this.$refs.scroll.refresh, 500);
    this.itemImgLister = () => {
      this.refresh();
    };
    this.$bus.$on('itemImageLoad', this.itemImgLister);
    //console.log('我是混入中的内容');
  }
}

//回到顶部的Mixin抽取
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTopClick() {
      //console.log('backTopClick');
      //是scrollTo(),而不是scrollUp(),且最后一个参数代表用多少时间,回到指定的位置
      //第一种方式:较为复杂
      //this.$refs.scroll.scroll.scrollTo(0, 0, 500);
      //第二种方法:采用面向对象方法的思想,即Scroll模块做了什么事,都不关Home模块的事情
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShowBackTop(position) {
      //1、判断backTop是否显示
      //console.log(position);
      //下面代码这样写,比较繁琐
      /*if(position.y <= -1000) {
        this.isShowBackTop = true
      }else {
        this.isShowBackTop = false
      }*/
      //这样写代码才比较简略
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}

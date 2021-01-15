<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //1、创建scroll对象
      //document.querySelector()默认查找的是第一个标签
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      });
      //2、监听滚动的位置
      if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', position => {
          //console.log(position);
          //下面这样写是错误的,传递的事件需要加参数
          //this.$emit(scroll, position)
          this.$emit('scroll', position)
        })
      }
      //3、监听scroll滚动到底部
      if(this.pullUpLoad) {
        //当加载到底部的时候,调用pullingUp函数
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
          this.$emit('finishPullUp')
        })
      }
    },
    methods: {
      //time = 300是默认值,这是ES6中的语法,传入的其他值会将该默认值替代
      scrollTo(x, y, time = 500) {
        //先要判断this.scroll有了,才不会有scroll为null的情况了(即不会报错)
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
        //console.log('refresh被调用了');
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>

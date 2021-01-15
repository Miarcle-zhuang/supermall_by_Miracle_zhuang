<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkbutton/CheckButton";

  import { mapGetters } from "vuex";

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      //这里弄出来的不只是只能是computed中进行使用
      ...mapGetters(['cartList', 'cartLength']),

      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.count * item.price
        }, 0).toFixed(2);
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      //非自己点击全选按钮的情况下, 一般自己点击其他按钮，导致按钮都被选中，则判断是否全选都用计算属性
      isSelectAll() {
        //下面是我的做法,还存在没选中购物车项所有选项,但全选按钮依旧被选上的情况
         //return this.cartList.filter(item => item.checked).length != this.cartList.length ? false : true
        //下面是老师的做法
        if(this.cartList.length === 0) return false;
        //用find()性能会更高一些,比起filter()
        return !this.cartList.find(item => !item.checked)
      },
    },
    methods: {
      //下面是我写的点击全选,其它商品也被选中的情形,并没有得到效果
      /*selectAllClick() {
        if(!this.$refs.checkButton.checked) {
          for(let item of this.cartList) {
            item.checked = false
          }
        }else {
          for(let item of this.cartList) {
            item.checked = true
          }
        }
      }*/
      /*
        点击全选按钮
        1、如果原来都是选中,点击一次,全部不选中
        2、如果原来都是不选中(某些不选中),全部选中
      * */
      checkClick() {
        //这一种是普通做法,这个只能用普通做法
        //全部选中
        if(this.isSelectAll) {
          //如果原来都是选中,点击一次,全部不选中
          for(let item of this.$store.getters.cartList) {
            item.checked = false
          }
        }else {
          //如果原来都是不选中(某些不选中),全部选中
          for(let item of this.$store.getters.cartList) {
            item.checked = true
          }
        }
        //下面这一种是简略做法,但是会引起乱七八糟,this.isSelectedheitem.checked的影响乱七八糟
        //因此不能用下面这种简略写法
        //this.cartList.forEach(item => item.checked = !this.isSelectAll);
      },
      calcClick() {
        //没有任何一个商品被选中,则弹出'请选择购买的商品'
        if(!this.cartList.find(item => item.checked)) {
          this.$toast.show('请选择购买的商品', 1500);
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    position: relative;
    height: 40px;
    /* check-button组件中的img会继承line-height:40px这个属性,所以它会更下面一些 */
    line-height: 40px;
    background-color: #eee;
  }
  .check-content {
    display: flex;
    width: 60px;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 22px;
    height: 22px;
    line-height: 22px;
    margin-right: 5px;
  }
  .price {
    flex: 1;
    margin-left: 5px;
  }
  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>

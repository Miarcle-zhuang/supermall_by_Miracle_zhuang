//vue.config.js用来配置相关文件夹的别名
//vue.config.js里面写的配置会和node_modules中公共的配置合并
module.exports = {
  configureWebpack: {
    resolve: {
      //extensions: []用于使其他文件免写扩展名
      //extensions: [],
      //alias用于配置别名
      alias: {
        //src的别名在node_modules已经配置过了
        //'src': '@',
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}

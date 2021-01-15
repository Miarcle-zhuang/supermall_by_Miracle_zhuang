/*
  分离出network里面的request.js,会使开发人员对axios依赖性变小,
  方便当axios不再被维护时,更新新的网络框架
* */
import axios from 'axios'

//第四种请求方式(补充的,这个方案是最好的,即最终方案)
export function request(config) {
  //1、创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000
  })

  //2、axios的拦截器
  //2.1请求拦截的作用
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    //console.log(err);//拦截失败打印的
  });

  //2.2响应拦截
  instance.interceptors.response.use(res => {
    //不将res.data返回,后续的处理拿不到服务器返回的数据
    return res.data;
  }, err => {
    console.log(err);
  });

  //3、发送真正的网络请求
  //instance(config)本身返回的就是Promise对象
  return instance(config)
}

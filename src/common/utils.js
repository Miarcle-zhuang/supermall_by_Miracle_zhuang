/*
  下面都是工具型函数
* */
//防抖函数,以后常写,多看
//所有的函数都要通过export导出
export function debounce(func, delay) {
  let timer = null;
  //循环执行的是下面的代码
  return function (...args) {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay)
  }
}

//所有要导出的函数都要使用export
export function formatDate(date, fmt) {
  //1、获取年份
  if (/(y+)/.test(fmt)) {

    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

  }

  let o = {

    'M+': date.getMonth() + 1,

    'd+': date.getDate(),

    'h+': date.getHours(),

    'm+': date.getMinutes(),

    's+': date.getSeconds()

  };

  for (let k in o) {

    if (new RegExp(`(${k})`).test(fmt)) {

      let str = o[k] + '';

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));

    }

  }

  return fmt;

};

//这个函数不需要导出
function padLeftZero (str) {

  return ('00' + str).substr(str.length);

};

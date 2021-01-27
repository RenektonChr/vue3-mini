// v1

const { effect } = require("@vue/reactivity");

/* 
// 回归本质问题
let a = 20;
let b;

b = a + 20;

// b依赖于a，b的变化是命令式的
console.log(b)
*/

/*
// v2 封装性
let a;
let b;
function updata() {
  b = a + 20;
  console.log(b)
}

// b同样依赖于a，只不过是封装一个update函数，其本质也是通过命令式的逻辑代码  手动进行更新！
a = 20;
updata();

a = 12;
updata();
*/

/*
// v3
// 我们可以使用一些相应是的库, Vue3的reactivity模块
const { effect, reactive } = require('@vue/reactivity');

let a = reactive({
  value: 10,
});
let b;
effect(() => {
  // 在最初effect中的函数会自动执行一次，可以算作初始化（但并不准确）。
  b = a.value + 10;
  console.log(b)
})
// 改变a的值
a.value = 30;
*/

// v4 自己写一个响应式库...    这是重点

/**
 * vue2.x中的响应式实现原理
 * 1. 依赖收集
 * 2. 依赖触发
 * 
 * 数据响应式的实现就是实现这两个部分（值类型的响应式）
 */
let currentEffect;
class Dep {
  constructor(val) {
    // 使用Set（集合）这个数据结构来存储依赖，Set是不能重复的集合。
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val
  }

  set value(newVal) {
    this._val = newVal
    this.notice();
  }

  depend() {
    console.log('currentEffect--->', currentEffect)
    // 依赖收集
    if(currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  notice() {
    // 以来触发
    this.effects.forEach(effect => {
      effect();
    })
  }
}

const dep = new Dep(10);
// effectWatch是个函数
function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

let b;
effectWatch(() => {
  b = dep.value + 10
  console.log('啦啦啦啦  德玛西亚')
})
// b = dep.value
dep.value = 30;
dep.value = 60;

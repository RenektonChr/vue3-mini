// v1
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

//  依赖类
let currentEffect;
class Dep {
  constructor(val) {
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    dep.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal;
    dep.notice();
  }
  // 收集依赖
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  // 通知依赖，执行
  notice() {
    this.effects.forEach(effect => {
      effect();
    })
  }
}


export function effectWatch(effect) {
  currentEffect = effect;
  effect()
  currentEffect = null;
}
// reactive
// 以上的代码实现的是一个单值的响应式
// dep ---> number string
// object ---> key ---> dep  对象的话每一个key  对应了一个dep对象   来收集依赖  触发依赖

// 1. 这个对象在什么时候改变的
// object.a --> get
// object.a = 2 ---> set

// vue2 使用了一个defineProperties
// vue3 使用了proxy   代理对象

// get  set  实际上就是一种面向切面编程的编程范式
const targetMap = new Map();
function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  return dep;
}
export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      // key --> dep
      const dep = getDep(target, key);
      // 做依赖收集
      dep.depend();

      return Reflect.get(target, key);
    },

    set(target, key, value) {
      // 触发依赖
      // 要获取到相应的dep
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    }
  })
}


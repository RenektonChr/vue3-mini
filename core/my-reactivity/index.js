// 第三次

// 整理思路   独立完成   开干！

/**
 * Vue2和Vue3响应式源码的不同之处在于，Vue2使用了ES5的defineProperty，Vue3则使用了ES6的Proxy。
 * 但是vue2和Vue3的响应式设计原理是相同的，都是数据劫持，也就是依赖的收集和通知。
 * 在设计模式上都是订阅发布模式。
 */

/**
 * Vue3实现响应式主要完成两个任务：
 * 1. 依赖收集
 * 2. 依赖通知（执行）
 */


/*

// 回归本质
// 1. 命令式的响应（过程使然）
let a = 0;
let b = a + 1;
console.log(b);
a = 3;
b = a + 1;
console.log(b);

// 2. 函数封装
function update() {
  b = a + 1
  console.log(b)
}

a = 12;
update();

a = 55;
update();

// 使用第三方库
const { reactive, effect }  = require('@vue/reactivity');

const user = reactive({ name: 'cuihaoran', age: 18 });
let aa;
effect(() => {
  // console.log('age: ' + user.age);
  aa = user.age * 2
  console.log('age * 2 : ' + aa) 
})

user.age = 19;

*/

// 重写一个响应式库
let currentEffect;
class Dep {
  constructor(val) {
    // 依赖不能重复收集
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal
    this.notice();
  }

  // 收集依赖
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  // 触发依赖
  notice() {
    this.effects.forEach((effect) => {
      effect()
    })
  }
}

export function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

const targetMap = new Map();
function getDep(target, key) {
  let depsMap = targetMap.get(target)
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
      // 收集依赖
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      // 触发依赖
      dep.notice();
      return result
    }
  })
}

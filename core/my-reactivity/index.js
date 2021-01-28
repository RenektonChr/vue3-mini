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

// 依赖类
let currentEffrct;
class Dep {
  constructor (val) {
    // 这里使用ES6+的集合数据结构，是因为依赖不能重复收集。
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal;
    this.notice();
  }

  // 依赖收集
  depend() {
    if(currentEffrct) {
      this.effects.add(currentEffrct);
    }
  }

  // 依赖通知
  notice() {
    this.effects.forEach(effect => {
      effect();
    })
  }
}


// 依赖收集的函数
function effectWatch(effect) {
  currentEffrct = effect;
  effect();
  currentEffrct = null;
}

let a;
let b;
const dep = new Dep(10);

effectWatch(() => {
  a = dep.value + 10;
  b = a + 1;
  console.log(b)
})

dep.value = 12;

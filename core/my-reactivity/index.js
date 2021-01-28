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
let currentEffect;
class Dep {
  // 依赖存储
  constructor (val) {
    // 使用ES6+ 集合数据结构   依赖的收集不能重复
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
    if(currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  // 依赖触发
  notice() {
    this.effects.forEach(effect => {
      effect();
    })
  }
}

// 触发依赖收集
function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

// reactive
// dep ---> number string
// object ---> key ---> dep

/**
 * 对象的响应式方法实现主要是完成两个事儿：
 * 对象在什么时候改变的
 * object.a --> get
 * object.a = 2 --> set
 */

// vue3  proxy
function reactive (obj) {
  return new Proxy(obj, {
    get(target, key) {
      console.log(key);
    },
    set(target, key, value) {

    }
  })
}

const proxyObj = reactive({ name: 'renkton', age: 18 });
proxyObj.name

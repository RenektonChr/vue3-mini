// 响应式库
// 创建全局变量，存储依赖。
let currentEffect;
class Dep {
  constructor(val) {
    // 这里使用set数据结构，依赖不能重复收集。ES6+
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal;
    this.notice()
  }

  // 1. 收集依赖
  depend() {

    if(currentEffect) {
      this.effects.add(currentEffect);
    }
    
  }

  // 2. 触发依赖
  notice() {
    // 触发一下我们之前收集到的依赖
    this.effects.forEach(effect => {
      effect();
    })
  }
}

function effectWatch(effect) {
  // 收集依赖 
  currentEffect = effect;
  effect();
  dep.depend();
  currentEffect = null;
}

const dep = new Dep(10);

let b;

effectWatch(() => {
  b = dep.value + 10;
  console.log(b);
})

// 值发生变更
dep.value = 20;


// reactivity
// dep ---> number string
// object ---> key ---> dep

// 1. 对象在什么时候改变的
// object.a ---> get
// object.a = 2 ---> set

// vue2 defineProperty
// proxy

const targetMap = new Map();

function reactive (raw) {
  return new Proxy(raw, {
    get(target, key) {
      console.log(key);
      // key - dep
      // dep我们存储在哪里？
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        depsMap = new Map();
        targetMap.set(key, depsMap)
      }

      let dep = depsMap.get(key);
      if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
      }

      // 依赖收集 
      dep.depend();

      return Reflect.get(target, key);
    },
  })
}

const user = reactive({
  age: 19,
})

user.age;

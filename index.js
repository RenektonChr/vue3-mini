import { reactive, effectWatch } from './core/reactivity/index.js'

// 声明一个响应式对象
// ref --> 一般接收值类型
let a = reactive({
  number: 1,
  lalla: 121
});
let b;
let c;
effectWatch(() => {
  // 函数
  // effect一开始就会执行一次
  b = a.number + 10;
  c = a.lalla +1;
  console.log(b)
});

// 当a变化时，effect还会再次执行！
a.number = 30;
a.number = 40;
a.lalla = 1212

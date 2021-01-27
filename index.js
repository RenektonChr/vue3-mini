const { reactive, effect } = require('@vue/reactivity')

// V1

// let a = 10;
// let b = a + 10;
// console.log(b);


// a = 20;
// b = a + 10;
// console.log(b);


// v2

// let a = 10;
// let b;
// update();
// function update() {
//   b = a + 10;
//   console.log(b);
// }

// a = 20;
// update();

// v3
// a发生变更了，想让b自动更新

// 声明一个响应式对象
// ref --> 一般接收值类型
let a = reactive({
  value: 1,
});
let b;

effect(() => {
  // 函数
  // effect一开始就会执行一次
  // b = a.value + 10;
  console.log(111)
});

// 当a变化时，effect还会再次执行！
a.value = 30;
a.value = 40;

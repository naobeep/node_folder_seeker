let a = 0;
const arr = [];

const func1 = () => {
  console.log(a);
  arr.push(a);
  a++;
};

const promiseFunc = () => {
  if (a < 5) {
    return new Promise(resolve => {
      setTimeout(() => {
        func1();
        resolve();
      }, 1000);
    }).then(() => {
      return promiseFunc();
    });
  }
};

promiseFunc().then(() => {
  console.log('done', { arr });
});

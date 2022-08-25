let a = 0;
const arr = [];

const func1 = () => {
  setTimeout(() => {
    console.log(a);
    arr.push(a);
    a++;
  }, 1000);
};

const promiseFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (a < 5) {
        func1();
        resolve(a);
      }
    }, 1000);
  }).then(a => {
    console.log({ a });
    return promiseFunc();
  });
};

promiseFunc().then(() => {
  console.log('done', { arr });
});

let [a, b] = [0, 0];
const arr = [];

const func1 = () => {
  setTimeout(() => {
    console.log({ a });
    arr.push(a);
    a++;
    a < 5 && func1();
  }, 1000);
};

const promiseFunc = () => {
  return new Promise(resolve => {
    b++;
    func1();
    resolve(b);
  });
};

promiseFunc().then(b => {
  console.log({ b }, 'done', { arr });
});

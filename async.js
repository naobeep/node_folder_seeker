let [a, b] = [0, 0];
const arr = [];

const func1 = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log({ a });
      arr.push(a);
      a++;
      if (a < 5) {
        func1();
        resolve();
      }
      // a < 5 && func1();
    }, 1000);
  });
};

const promiseFunc = async () => {
  await func1()
    .then(() => {
      console.log({ b }, 'done', { arr });
    })
    .catch(() => {
      console.log('false');
    });
  // return new Promise(async resolve => {
  //   b++;
  //   resolve(b);
  // });
};
promiseFunc();

// var arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// function recursiveFunc(arr) {
//   while (arr.length > 0) {
//     return new Promise(resolve => {
//       var tmpArr = arr.splice(0, 3);
//       var entryTimestamp = Date.now();
//       setTimeout(function () {
//         logger(tmpArr, entryTimestamp);
//         resolve();
//       }, 1000);
//     }).then(function () {
//       return recursiveFunc(arr);
//     });
//   }
// }

// function logger(arr, timestamp) {
//   console.log(JSON.stringify(arr) + timestamp);
// }

// recursiveFunc(arr).then(function () {
//   console.log('done');
// });

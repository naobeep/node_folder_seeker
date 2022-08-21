let a = 0;

const func1 = () => {
  setTimeout(() => {
    if (a < 5) {
      console.log(a);
      a++;
      func1();
    }
  }, 1000);
};

func1();

console.log({ a });

const myPromise = new Promise((resolve, reject) => {
  func1();
  resolve('done!');
});

myPromise
  .then(res => {
    console.log(res, 'then1', { a });
    return 'next'
  })
  .then(res=>{
    console.log(res);
    console.log({a});
  });

const arr = [
  [1, 2, 3, 4, 5],
  [1, 2, 5, 4, 6],
  [1, 2, 5, 4, 7],
];

arr.sort();
console.log(arr);
const standard = [];
const newArr = [];

arr.forEach(a => {
  console.log({ standard }, { a });
  newArr.push(
    a.map((el, i) => {
      if (standard[i] === el) {
        return '';
      } else {
        standard[i] = el;
        standard[i + 1] = '';
        return el;
      }
    })
  );
});

console.log(newArr);

const obj = {
  foo: [
    { bar: 'bbb', baz: 'sss' },
    { bar: 'BBB', baz: 'sss' },
    { bar: 'AAA', baz: 'sss' },
    { bar: 'CCC', baz: 'sss' },
    { bar: 'ddd', baz: 'sss' },
    { bar: 'aaa', baz: 'sss' },
    { bar: 'AAA', baz: 'sss' },
    { bar: 'ccc', baz: 'sss' },
  ],
};

const ol = Object.entries(obj.foo);
const sort1 = ol.sort((a, b) => {
  a = a[1].bar.toLowerCase();
  b = b[1].bar.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});
console.log(sort1);

const obj1 = { foo: [] };
obj1.foo = sort1.map(arr => arr[1]);

console.log(obj);

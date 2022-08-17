import * as fs from 'fs';
import * as path from 'path';
import { inputPath } from './modules/inputPath.js';
  console.log('function!');

// const dir = inputPath() || './src/root';
const dir = './src/root';
const dirLength = dir.length - 1;

let currentFolder = 'root';
const list = [];
let depth = 0;

const results = {
  root: {
    files: [],
  },
};
const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file === '.git') return;
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        results[currentFolder][file] = {};
        depth++;
        detect(fp);
      } else {
        list.push(fp.slice(dirLength));
        results[currentFolder].files.push(file);
      }
    });
  });
  // console.log(results);
};

detect(dir);

setTimeout(() => {
  console.log(list);
  let data = '';
  for (const item of list) {
    const arr = item.split('\\');
    console.log(arr);
    data += `${arr}\n`;
  }

  fs.writeFile('./list.txt', data, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}, 3000);

// const sampleObj = {
//   root: [
//     { hoge: ['hoge.txt', { fuga: ['fuga.txt', { piyo: ['piyo.txt'] }] }] },
//     { foo: ['foo.txt', { bar: ['bar.txt'] }] },
//   ],
// };

// const samplePath = 'root/hoge/fuga/fuga.txt';
// const res = samplePath.split('/');
// console.log(res);
// const obj1 = {
//   [res[0]]: {
//     [res[1]]: {
//       [res[2]]: {
//         [res[3]]: res[4],
//       },
//     },
//   },
// };

// console.log(obj1);

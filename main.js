import * as fs from 'fs';
import * as path from 'path';
const dir = process.argv[2] || '.';

let currentFolder = 'root';
const list = [];

const results = {
  root: {
    files: [],
  },
};
const detect = (p, cb) => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file === '.git') return;
      const fp = path.join(p, file);
      list.push(fp)
      if (fs.statSync(fp).isDirectory()) {
        results[currentFolder][file] = {};
        detect(fp, cb);
      } else {
        results[currentFolder].files.push(file);
      }
    });
  });
  // console.log(results);
};

detect(dir, () => {});

setTimeout(() => {
  // console.log(results);
  console.log(list);
}, 1000);

const hoge = {
  name: 'root',
  children: [
    { name: 'hoge', children: [] },
    { name: 'fuga', children: [] },
  ],
  root: {
    hoge: {
      piyo: {},
      file: ['1.txt', '2,txt', '3.txt', '4.txt'],
    },
    fuga: {},
  },
};

// console.log(hoge['root']);

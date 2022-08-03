import * as fs from 'fs';
import * as path from 'path';
const dir = process.argv[2] || '.';

let currentFolder = 'root';

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
      if (fs.statSync(fp).isDirectory()) {
        // results.children.push({ [file]: {} });
        results[currentFolder][file]={};
        detect(fp, cb);
      } else {
        // results.children.push({ files: file });
        console.log(results[currentFolder]);
        results[currentFolder].files.push({ files: file });
      }
    });
  });
  console.log(60, results);
};

detect(dir, () => {
  console.log(results);
});

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

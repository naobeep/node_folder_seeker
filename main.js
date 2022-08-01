import * as fs from 'fs';
import * as path from 'path';
const dir = process.argv[2] || '.';

const walk = (p, cb) => {
  const results = [];
  fs.readdir(p, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        walk(fp, cb);
      } else {
        cb(fp);
      }
    });
  });
};

walk(dir, path => {
  console.log(path);
});

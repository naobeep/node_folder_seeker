import * as fs from 'fs';
import * as path from 'path';
const dir = process.argv[2] || '.';

const walk = (p, cb) => {
  const results = [];
  fs.readdir(p, (err, files) => {
    if (err) throw err;

    files
      .map(file => {
        return path.join(p, file);
      })
      .filter(file => {
        if (path.basename(file) === '.git') return;
        console.log(file);
        if (fs.statSync(file).isDirectory()) {
          walk(file, () => {
            console.log(path.basename(file));
            results.push({ name: path.basename(file) });
          });
        }
      })
      .forEach(file => {
        // const fp = path.join(p, file);
        //  else {
        //   cb(fp);
        // }
      });
  });

  // console.log(results);
};

walk(dir, path => {
  // console.log(path);
});

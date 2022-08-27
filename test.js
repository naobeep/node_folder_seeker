import * as fs from 'fs';
import * as path from 'path';

const dir = 'c:\\Users\\naomu\\OneDrive\\デスクトップ\\会議用背景';
const rawFileList = [];
const rawFolderList = [];

const pathJudge = fp => {
  return new Promise((resolve, reject) => {
    if (fs.statSync(fp).isDirectory()) {
      resolve(fp);
    } else {
      reject(fp);
    }
  });
};

// フォルダを探索してリストに書き出す
const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    for (const file of files) {
      if (file.match(/(.svn|.vscode)/)) continue;
      const fp = path.join(p, file);
      // console.log({ fp });
      pathJudge(fp)
        .then(fp => {
          // console.log('resolve', fp);
          rawFolderList.push(fp);
          detect(fp);
        })
        .catch(fp => {
          // console.log('reject', fp);
          rawFileList.push(fp);
        });
    }
  });
};

detect(dir)
// .then(a => {
//   console.log('done!', a);
//   console.log(rawFolderList);
//   console.log(rawFileList);
// });

setTimeout(() => {
  console.log('setTimeout');
  console.log(rawFolderList);
}, 1000);

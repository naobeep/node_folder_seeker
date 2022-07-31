import * as fs from 'fs';
import * as path from 'path';

//mjsが入っているディレクトリを取得
const currentDir = process.cwd();

//ファイルとディレクトリのリストが格納される(配列)
const files = fs.readdirSync(currentDir);
console.log(files);

//ディレクトリのリストに絞る
const dirList = files.filter(file => {
  return fs.statSync(path.join(currentDir, file)).isDirectory();
});
console.log(dirList);

let data = '';
for (const item of dirList) {
  data += `${item}\n`;
}

fs.writeFile('./list.txt', data, err => {
  if (err) {
    console.error(err);
    return;
  }
});

const choice = dirList[Math.floor(Math.random() * dirList.length)];

console.log(choice);
console.log(dirList.length);

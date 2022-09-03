import * as fs from 'fs';
import * as path from 'path';
// import XLSX from 'xlsx';
import XLSX from 'xlsx-js-style';
import colors from 'colors';
import { readFile } from 'fs/promises';
import { dialog } from './modules/dialog.js';

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

console.log(XLSX);

const settings = {};
const json = JSON.parse(
  await readFile(new URL('./modules/_dialog.json', import.meta.url))
);

await dialog(settings, json);

const workbook = XLSX.utils.book_new();
const dir = settings.rootDirectory;
const reg = new RegExp(settings.exclusionString);

const folderName = dir.split('\\').at(-1);
const rawFileList = [];
const rawFolderList = [];
const fileList = [];
const folderList = [];
const result = {
  sheetName: 'ファイルネーム一覧',
  data: [],
};

// フォルダを探索してリストに書き出す
const seek = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    for (const file of files) {
      if (file.match(reg)) continue;
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        rawFolderList.push(fp);
        seek(fp);
      } else {
        rawFileList.push(fp);
      }
    }
  });
};

const sortFunc = (a, b) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

// リストを成形
const listProcessing = () => {
  // ファイルリストを2次元配列に加工
  rawFileList.sort(sortFunc);
  for (const [i, fp] of rawFileList.entries()) {
    const num = ('0000' + (i + 1)).slice(-4);
    const filePath = settings.rootPath ? fp.replace(dir, '') : fp;
    // fileList.push([num, filePath]);
    const dirArr = filePath.split('\\');
    const filename = dirArr.at(-1);
    dirArr.pop();

    result.data.push({
      num: num,
      filePath: filePath,
      folderPath: dirArr,
      filename: filename,
    });
  }
  // fileList.unshift('ファイルパス一覧');

  // フォルダリストをディレクトリマップ用に成形
  const standard = [];
  rawFolderList.unshift(dir);
  rawFolderList
    .sort(sortFunc)
    .map(fp => fp.replace(dir, folderName).split('\\'))
    .forEach(a => {
      folderList.push(
        // 同一ディレクトリが続く場合、2つ目以降を空欄に
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
  folderList.unshift('ディレクトリマップ');
};

const writeXLSX = (...list) => {
  const lists = [...list];

  lists.forEach((list, i) => {
    const sheetName = list.shift();
    const sheet = XLSX.utils.json_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  });
  console.log(`create: ${folderName}_content.xlsx`.warn);
  XLSX.writeFile(workbook, `./dist/${folderName}_content.xlsx`, {
    type: 'xlsx',
  });
  console.log('succeed!'.info);
};

seek(dir);
setTimeout(() => {
  listProcessing();
  writeXLSX(folderList, fileList);
}, 3000);

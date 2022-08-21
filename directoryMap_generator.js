import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx';
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

const settings = {};
const json = JSON.parse(
  await readFile(new URL('./modules/_dialog.json', import.meta.url))
);

await dialog(settings, json);

const workbook = XLSX.utils.book_new();
const dir = settings.rootDirectory;
const exclusionString = settings.exclusionString;
const reg = new RegExp(exclusionString);

const folderName = dir.split('\\').at(-1);
const processedList = [];
const fileList = [];
const folderList = [];

const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file.match(reg)) return;
      const fp = path.join(p, file);
      const trimStr = fp.replace(dir, 'root');
      if (fs.statSync(fp).isDirectory()) {
        folderList.push(trimStr);
        detect(fp);
      } else {
        fileList.push(trimStr);
      }
    });
  });
};

const listProcessing = () => {
  fileList.sort();
  folderList.sort();
  const splitList = folderList.map(trimStr => {
    const dirArray = trimStr.split('\\');
    return dirArray;
  });

  const standard = [];
  // 同一ディレクトリが続く場合、2つ目以降を空欄に
  splitList.forEach(a => {
    processedList.push(
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
};

const writeXLSX = () => {
  const list = fileList.map((el, i) => {
    const num = ('0000' + (i + 1)).slice(-4);
    return [num, el];
  });
  const lists = [processedList, list];
  const names = ['ディレクトリマップ', 'ファイルリスト'];

  lists.forEach((list, i) => {
    const sheet = XLSX.utils.json_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, sheet, names[i]);
  });
  console.log(`create: ${folderName}_content.xlsx`.warn);
  XLSX.writeFile(workbook, `./dist/${folderName}_content.xlsx`, {
    type: 'xlsx',
  });
  console.log('succeed!'.info);
};

detect(dir);
setTimeout(() => {
  listProcessing();
  writeXLSX();
}, 3000);

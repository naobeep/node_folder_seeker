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
const rawList = [];
const processedList = [];

const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file.match(reg)) return;
      const fp = path.join(p, file);
      const trimStr = fp.replace(dir, 'root');
      if (fs.statSync(fp).isDirectory()) {
        settings.collectFiles || rawList.push(trimStr);
        detect(fp);
      } else {
        settings.collectFiles && rawList.push(trimStr);
      }
    });
  });
};

const listProcessing = rawList => {
  const standard = [];
  rawList.sort();
  const splitList = rawList.map(trimStr => {
    const dirArray = trimStr.split('\\');
    return dirArray;
  });

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
  let appendix, list;
  if (settings.collectFiles) {
    appendix = 'fileList';
    list = rawList.map((el, i) => {
      const num = ('0000' + (i + 1)).slice(-4);
      return [num, el];
    });
  } else {
    appendix = 'directoryMap';
    list = processedList;
  }
  console.log(`create: ${folderName}_${appendix}.xlsx`.warn);
  const sheet1 = XLSX.utils.json_to_sheet(list);
  XLSX.utils.book_append_sheet(workbook, sheet1, 'Dates');
  XLSX.writeFile(workbook, `./dist/${folderName}_${appendix}.xlsx`, {
    type: 'xlsx',
  });
  console.log('succeed!'.info);
};

detect(dir);
setTimeout(() => {
  settings.collectFiles || listProcessing(rawList);
  writeXLSX();
}, 3000);

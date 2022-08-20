import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx';
import { readFile } from 'fs/promises';
import { dialog } from './modules/dialog.js';

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
      if (fs.statSync(fp).isDirectory()) {
        if (!settings.collectFiles) {
          const trimStr = fp.replace(dir, 'root');
          const dirArray = trimStr.split('\\');
          rawList.push(dirArray);
        }
        detect(fp);
      } else {
        if (settings.collectFiles) {
          const trimStr = fp.replace(dir, 'root');
          const dirArray = trimStr.split('\\');
          rawList.push(dirArray);
        }
      }
    });
  });
};

const listProcessing = rawList => {
  const standard = [];
  rawList.sort();

  rawList.forEach(a => {
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

const writeXLSX = rawList => {
  const sheet1 = XLSX.utils.json_to_sheet(rawList);
  XLSX.utils.book_append_sheet(workbook, sheet1, 'Dates');
  XLSX.writeFile(workbook, `./dist/${folderName}_directoryMap.xlsx`, {
    type: 'xlsx',
  });
};

detect(dir);
setTimeout(() => {
  listProcessing(rawList);
  writeXLSX(processedList);
}, 3000);

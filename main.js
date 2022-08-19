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
const list = [];
const exclusionString = settings.exclusionString;
const reg = new RegExp(exclusionString);

const folderName = dir.split('\\').at(-1);

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
          list.push(dirArray);
        }
        detect(fp);
      } else {
        if (settings.collectFiles) {
          const trimStr = fp.replace(dir, 'root');
          const dirArray = trimStr.split('\\');
          list.push(dirArray);
        }
      }
    });
  });
};

detect(dir);

const writeFile = () => {
  list.sort();
  console.log(list);
  const sheet1 = XLSX.utils.json_to_sheet(list);
  XLSX.utils.book_append_sheet(workbook, sheet1, 'Dates');
  XLSX.writeFile(workbook, `./dist/${folderName}_directoryMap.xlsx`, {
    type: 'xlsx',
  });
};

setTimeout(() => {
  writeFile();
}, 3000);

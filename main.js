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

const workbook = XLSX.readFile('./assets/blanc.xlsx');
const sheet1 = workbook.Sheets['Sheet1'];
const dir = settings.rootDirectory;
const list = [];
const startRow = 3;
const startColumn = 3;

const folderName = dir.split('\\').at(-1);
sheet1['!ref'] = 'A1:L10000';

const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file.match(/(Steam)/)) return;
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        detect(fp);
      } else {
        const trimStr = fp.replace(dir, 'root');
        const dirArray = trimStr.split('\\');
        list.push(dirArray);
      }
    });
  });
};

detect(dir);

setTimeout(() => {
  console.log(list);
  list.forEach((item, i) => {
    item.forEach((dir, cellIndex) => {
      const targetColumn = String.fromCodePoint(cellIndex + 65 + startColumn);
      sheet1[`${targetColumn}${i + startRow}`] = {
        t: 's',
        v: dir,
        w: dir,
      };
    });
  });
  workbook.Sheets['Sheet1'] = sheet1
  XLSX.writeFile(workbook,`./dist/${folderName}_directory.xlsx`,{type:'xlsx'})
}, 3000);

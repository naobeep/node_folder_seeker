import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx-js-style';
import colors from 'colors';
import { readFile } from 'fs/promises';
import { dialog } from './modules/dialog.js';
import { extColorCode } from './modules/extColorCode.js';

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
const reg = new RegExp(settings.exclusionString);
const rootPrefix = settings.rootPath ? '/' : '';
const delimiter = settings.rootPath ? '/' : '\\';

const targetFolder = dir.split('\\').at(-1);
const rawFileList = [];
const rawFolderList = [];
const sheetData = [
  {
    sheetName: 'ファイルネーム一覧',
    data: [],
  },
  {
    sheetName: 'ディレクトリマップ',
    data: [],
  },
];

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
  // ファイルリストをファイル一覧シート用に加工
  rawFileList.sort(sortFunc);
  for (const [i, fp] of rawFileList.entries()) {
    const num = ('0000' + (i + 1)).slice(-4);
    const filePath = settings.rootPath
      ? fp.replace(dir, '').replaceAll('\\', '/')
      : fp;
    const dirArr = filePath.split(delimiter);
    const filename = dirArr.at(-1);
    dirArr.pop();
    const folderPath =
      rootPrefix + dirArr.reduce((accu, curr) => accu + curr + delimiter);
    const ext = filename.split('.').at(-1).toLowerCase();

    sheetData[0].data.push({
      'No.': num,
      ext,
      filePath,
      folderPath,
      filename,
      check: '',
      note: '',
    });
  }

  // フォルダリストをディレクトリマップシート用に成形
  const standard = [];
  rawFolderList.unshift(dir);
  rawFolderList
    .sort(sortFunc)
    .map(fp => fp.replace(dir, targetFolder).split('\\'))
    .forEach(a => {
      sheetData[1].data.push(
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
};

const writeXLSX = sheetData => {
  // ファイル一覧
  sheetData.forEach(sheetObj => {
    const sheetName = sheetObj.sheetName;
    const sheet = XLSX.utils.json_to_sheet(sheetObj.data);
    if (sheetName === 'ファイルネーム一覧') {
      for (const [i, row] of sheetObj.data.entries()) {
        sheet[`D${i + 2}`].s = {
          alignment: { wrapText: true },
        };
        if (extColorCode.hasOwnProperty(row.ext)) {
          sheet[`B${i + 2}`].s = {
            font: {
              color: { rgb: extColorCode[row.ext].fontColor },
              bold: true,
            },
            fill: { fgColor: { rgb: extColorCode[row.ext].bgColor } },
            alignment: { horizontal: 'center' },
          };
        } else {
          sheet[`B${i + 2}`].s = {
            alignment: { horizontal: 'center' },
          };
        }
      }
    }
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  });
  console.log(`create: ${targetFolder}_content.xlsx`.warn);
  XLSX.writeFile(workbook, `./dist/${targetFolder}_content.xlsx`, {
    type: 'xlsx',
  });
  console.log('succeed!'.info);
};

seek(dir);
setTimeout(() => {
  listProcessing();
  writeXLSX(sheetData);
}, 3000);

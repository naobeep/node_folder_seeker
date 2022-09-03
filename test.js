import * as fs from 'fs';
import * as path from 'path';
// import XLSX from 'xlsx';
import { readFile } from 'fs/promises';

const settings = {
  rootPath: false,
  rootDirectory: 'C:\\Users\\naomu\\OneDrive\\デスクトップ\\会議用背景',
  exclusionString: '(.svn|.vscode)',
};

const dir = settings.rootDirectory;
const reg = new RegExp(settings.exclusionString);

const rawFileList = [];
const rawFolderList = [];
const result = [
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

const strComposition = arr => {
  const str = arr.reduce((accu, curr) => {
    console.log(accu);
    accu + curr + '\\';
  });
  return str;
};

// リストを作成
const listProcessing = () => {
  // ファイルリストを2次元配列に加工
  rawFileList.sort(sortFunc);
  for (const [i, fp] of rawFileList.entries()) {
    const num = ('0000' + (i + 1)).slice(-4);
    const filePath = settings.rootPath ? fp.replace(dir, '') : fp;
    const dirArr = filePath.split('\\');
    const filename = dirArr.at(-1);
    dirArr.pop();
    const folderPath = dirArr.reduce((accu, curr) => {
      return accu + curr + '\\';
    });
    // console.log(folderPath);

    result[0].data.push({
      num,
      filePath,
      folderPath,
      filename,
    });
  }
};

seek(dir);
setTimeout(() => {
  listProcessing();
  console.log(result[0].data);
}, 3000);

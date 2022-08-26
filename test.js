import * as fs from 'fs';
import * as path from 'path';

const settings = {
  rootDirectory: 'c:\\Users\\naomu\\OneDrive\\デスクトップ\\会議用背景',
  exclusionString:'(.svn|.vscode)'
};

const dir = settings.rootDirectory;
const reg = new RegExp(settings.exclusionString);

const rawFileList = [];
const rawFolderList = [];

// フォルダを探索してリストに書き出す
const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    for (const file of files) {
      if (file.match(reg)) continue;
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        rawFolderList.push(fp);
        detect(fp);
      } else {
        rawFileList.push(fp);
      }
    }
  });
};

detect(dir);

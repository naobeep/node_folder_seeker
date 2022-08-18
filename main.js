import * as fs from 'fs';
import * as path from 'path';
import { readFile } from 'fs/promises';
import { dialog } from './modules/dialog.js';

const settings = {};
const json = JSON.parse(
  await readFile(new URL('./modules/_dialog.json', import.meta.url))
);

await dialog(settings, json);

const dir = settings.rootDirectory;
const list = [];

const detect = p => {
  fs.readdir(p, (err, files) => {
    if (err) console.error(err);

    files.forEach(file => {
      if (file.match(/(Steam)/)) return;
      const fp = path.join(p, file);
      if (fs.statSync(fp).isDirectory()) {
        detect(fp);
      } else {
        const trimStr = fp.replace(dir,'root')
        list.push(trimStr);
      }
    });
  });
};

detect(dir);

setTimeout(() => {
  console.log(list);
  let data = '';
  for (const item of list) {
    const arr = item.split('\\');
    console.log(arr);
    data += `${arr}\n`;
  }

  fs.writeFile('./dist/list.txt', data, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}, 3000);

var fs = require('fs'),
  path = require('path'),
  dir = process.argv[2] || '.'; //引数が無いときはカレントディレクトリを対象とする

var walk = function (p, fileCallback, errCallback) {
  fs.readdir(p, function (err, files) {
    if (err) {
      errCallback(err);
      return;
    }

    files.forEach(function (f) {
      var fp = path.join(p, f); // to full-path
      if (fs.statSync(fp).isDirectory()) {
        walk(fp, fileCallback); // ディレクトリなら再帰
      } else {
        fileCallback(fp); // ファイルならコールバックで通知
      }
    });
  });
};

// 使う方
walk(
  dir,
  function (path) {
    console.log(path); // ファイル１つ受信
  },
  function (err) {
    console.log('Receive err:' + err); // エラー受信
  }
);

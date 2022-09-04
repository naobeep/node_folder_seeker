# node_detect_folder

ぶっ込んだフォルダを精査してディレクトリマップとファイルリストを xlsx で出力します。
~~何に使うんだこんなもん~~使い道はあった。

## Usage

パッケージをインストールしたら npm スクリプトか同梱の`run.bat`で起動してください。
あとは設問に従って検索するフォルダをドラッグアンドドロップでぶっこみ、検索から除外するフォルダに含まれる文字を設定すれば`dist`フォルダの中にエクセルファイルが出力されます。
動作確認は node.js 18.0.0 でしかやってないので自己責任でどうぞ。

### 準備

- Node.jsをインスコしてけねすか？話はそれからだ
- ターミナル（あるいはコマンドプロンプト）を開いてこのフォルダに移動し`npm i`でパッケージをインストールしてけさい。

### 実行

1. 下記のいずれかの方法でスクリプトを起動
   - このフォルダを VScode で開き`NPMスクリプト`の`generate`ボタンを押す
   - `run.bat`を走らせる
2. 検索するディレクトリのパスを入力（探索するフォルダをターミナルにドラッグ＆ドロップ → [ENTER]）
3. 出力結果をルートパスで出力するか選択（y = ルートパス, n = フルパス）
4. 探索から除外する文字列を入力
5. `dist`フォルダに`探索したフォルダ名_content.xlsx`

## 課題

- 再帰的関数の非同期処理
  - やり方わかんないからsetTimeoutでディレイかけて誤魔化してるけどわかんないんだからしょうがないよね
- ~~シートのスタイル設定~~
  - ~~`xlsx(SheetJS)`では不可。パッケージの変更を検討~~
- シートの体裁を整える
  - 2022.09現在。既存パッケージでは列幅の変更は不可能な模様。初めからVBSでやればよかったんじゃね？
- ~~フォルダマップのみ書き出す設定~~
  - ~~同一フォルダが並ぶ場合、2 つ目以降を空欄に~~
- ~~新規にブックを作成~~
- ~~除外文字設定~~
- ~~ファイル名の場合は`root`をつけない~~
- リファクタリング

## 更新履歴

- 2022.09.04 v0.4.1
  - コードリファクタリング
    - ファイル一覧シートのスタイル処理を関数化
      - B列背景色処理を関数化
      - D列の背景色処理を関数化
- 2022.09.04 v0.4.0
  - コードリファクタリング
    - パッケージを`xlsx-js-style`に変更
    - ファイルパスの項目をファイル一覧シートに統合
    - 拡張子の項目を追加
    - ファイルパス一覧シートの行データをオブジェクトに変更
  - スタイル設定追加
    - 拡張子に合わせて背景色変更
    - 同一フォルダのブロックごとに背景色をトグル

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const schema = require('js-yaml-schema-cfn');

module.exports = {
  /**
   * 指定されたパスにファイルが存在すれば、CFn YAML としてパースする
   * @return <null|CFnYAMLFile> ファイルが存在しなければ null
   * CFnYAMLFile: {
   *   [filepath: 相対パス]: string,
   *   [content: ファイル文字列 (UTF8)]: string,
   *   [json: CFn オブジェクト]: any,
   * }
   */
  load(rawpath, basepath) {
    // 絶対パスに変換
    const abspath = path.resolve(path.isAbsolute(rawpath) ? rawpath : path.join(basepath, rawpath));
    // 相対パスに変換
    const filepath = path.relative(basepath, abspath);
    // 存在チェック
    if (!fs.existsSync(abspath) || !fs.statSync(abspath).isFile()) {
      return null;
    }
    // 文字列読み込み
    const content = fs.readFileSync(abspath, 'utf8');
    // CFn Yaml パース
    const json = yaml.load(content, { schema });
    return { filepath, content, json };
  },
};

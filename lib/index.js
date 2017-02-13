const _ = require('lodash');
const path = require('path');

const loader = require('./cfn-yaml-loader');
const parser = require('./cfn-yaml-parser');
const dumper = require('./dot-dumper');

/**
 * 依存関係を解決したいファイルリストを与えると、
 * 依存解決関係を示した GraphViz dot 形式の文字列を返す
 *
 * @param entryFiles Array<string> ファイルリスト
 * @param basepath string ファイル相対パスの基準パス
 * @return string dot 形式文字列
 */
module.exports = (entryFiles, basepath) => {
  const nodes = [];

  const loadFile = (file) => {
    const cfnYaml = loader.load(file, basepath);
    // ファイルが存在しない場合
    if (!cfnYaml) {
      return cfnYaml;
    }
    // 重複除去
    if (_.find(nodes, n => n.filepath === cfnYaml.filepath)) {
      return cfnYaml;
    }
    // 登録
    nodes.push(cfnYaml);

    // DependsOn: <file_path> 記法
    cfnYaml.deps = [];
    parser.dependsOn(cfnYaml.content).forEach((d) => {
      const dirPath = path.dirname(cfnYaml.filepath);
      const depPath = path.join(dirPath, d);
      const depYaml = loadFile(depPath);
      if (depYaml) {
        cfnYaml.deps.push(depYaml.filepath);
      }
    });

    // ImportValue
    cfnYaml.imports = parser.importValue(cfnYaml.json);

    // Outputs
    cfnYaml.outputs = parser.outputs(cfnYaml.json);

    return cfnYaml;
  };
  entryFiles.forEach(loadFile);

  // ImportValue
  nodes.forEach((node) => {
    const { deps, imports } = node;
    imports.forEach((i) => {
      const newDeps = _.filter(nodes, n => _.includes(n.outputs, i)).map(n => n.filepath);
      _.filter(newDeps, d => !_.includes(deps, d)).forEach(d => deps.push(d));
    });
  });

  return dumper.dump(nodes);
};

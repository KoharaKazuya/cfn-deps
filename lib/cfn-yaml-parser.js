const _ = require('lodash');

module.exports = {
  /**
   * DependsOn: <file_path> 記法
   */
  dependsOn(content) {
    const deps = [];
    content.split('\n').forEach((line) => {
      const matches = /DependsOn: (.+)$/.exec(line);
      if (matches === null) {
        return;
      }
      deps.push(matches[1]);
    });
    return deps;
  },

  /**
   * ImportValue タグ
   */
  importValue(json) {
    const dive = (obj) => {
      if (typeof obj !== 'object') {
        return [];
      }
      return _.flatMap(_.keys(obj), (key) => {
        if (key === 'Fn::ImportValue') {
          if (typeof obj[key] === 'string') {
            return [obj[key]];
          }
          return [JSON.stringify(obj[key])];
        }
        return dive(obj[key]);
      });
    };
    return dive(json);
  },

  /**
   * Outputs
   */
  outputs(json) {
    const outputs = [];
    if (json && json.Outputs) {
      _.values(json.Outputs).forEach((v) => {
        if (v.Export && v.Export.Name) {
          if (typeof v.Export.Name === 'string') {
            outputs.push(v.Export.Name);
          } else {
            outputs.push(JSON.stringify(v.Export.Name));
          }
        }
      });
    }
    return outputs;
  },
};

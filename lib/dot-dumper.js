const _ = require('lodash');

module.exports = {
  dump(nodes) {
    const lines = _.flatMap(nodes, node => _.map(node.deps, d => `  "${node.filepath}" -> "${d}"`));
    return `digraph deps {\n${lines.join('\n')}\n}\n`;
  },
};

const cfnDeps = require('../lib');
const path = require('path');

const expectedJson = `digraph deps {
  "index.yml" -> "DependsOn.yml"
  "index.yml" -> "ImportValue.yml"
  "index.yml" -> "null.yml"
  "index.yml" -> "Outputs.yml"
  "index.yml" -> "sub/nest.yml"
  "index.yml" -> "sub/relative.yml"
  "index.yml" -> "sub/sequence.yml"
  "DependsOn.yml" -> "null.yml"
  "ImportValue.yml" -> "Outputs.yml"
  "sub/relative.yml" -> "sub/nest.yml"
}
`;

describe('cfn-deps', () => {
  describe('spec/data', () => {
    it('should parse deps', () => {
      const indexYml = path.join(__dirname, 'data', 'index.yml');
      const basedir = path.join(__dirname, 'data');
      const dotContent = cfnDeps([indexYml], basedir);
      expect(dotContent).toBe(expectedJson);
    });
  });
});

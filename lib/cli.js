const _ = require('lodash');
const argv = require('argv');
const glob = require('glob');

const cfnDeps = require('./index');

const { targets } = argv.run();
const files = _.flatMap(targets, t => glob.sync(t));
const dotContent = cfnDeps(files, process.cwd());
process.stdout.write(dotContent);

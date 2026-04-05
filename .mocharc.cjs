const path = require('node:path');
module.exports = {
    extensions: ['js', 'jsx'],
    require: path.resolve(__dirname, 'setup-tests.js'),
};

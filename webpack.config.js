const path = require('path');
 
module.exports = {
    entry: './scripts/index.js',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/main.js',
    },
};

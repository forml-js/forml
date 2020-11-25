const path = require('path');

function loader(name, options = {}) {
    return { loader: `${name}-loader`, options };
}

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: path.resolve('./index.js'),
    output: {
        filename: 'bundle.js',
        publicPath: '/forml/dist/',
        path: path.resolve('../../dist'),
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, use: [loader('file')] },
        ],
    },
};

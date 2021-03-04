const path = require('path');
module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: path.resolve('./src/index.js'),
    output: {
        filename: 'bundle.js',
        publicPath: '/',
        path: path.resolve('../dist'),
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@material-ui/core': path.resolve(
                './node_modules/@material-ui/core'
            ),
            '@material-ui/pickers': path.resolve(
                './node_modules/@material-ui/pickers'
            ),
            '@forml/core': path.resolve('./node_modules/@forml/core'),
            '@forml/hooks': path.resolve('./node_modules/@forml/hooks'),
            '@forml/context': path.resolve('./node_modules/@forml/context'),
            '@forml/decorator-barebones': path.resolve('./node_modules/@forml/decorator-barebones'),
            '@forml/decorator-mui': path.resolve('./node_modules/@forml/decorator-mui'),
            '@forml/decorator-pdf': path.resolve('./node_modules/@forml/decorator-pdf'),
        },
        extensions: ["*", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, use: ['file-loader'] }
        ],
    },
};

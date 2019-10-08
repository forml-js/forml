const path     = require('path');
module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: path.resolve('./example/index.js'),
    output: {
        filename: 'bundle.js',
        publicPath: '/',
        path: path.resolve('./example/dist'),
    },
    devtool: 'eval-source-map',
    externals: [
        {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@material-ui/core': 'MaterialUI',
        },
    ],
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {loader: 'babel-loader'},
            },
        ]
    }
};

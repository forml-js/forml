const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    devServer: {
        client: { overlay: { runtimeErrors: false } },
    },
    resolve: {
        fallback: {
            events: false,
            process: false,
            zlib: false,
            stream: false,
            util: false,
            buffer: false,
            asset: false,
        },
        alias: {
            '@forml/core': path.resolve('../packages/core/src'),
            '@forml/hooks': path.resolve('../packages/hooks/src'),
            '@forml/context': path.resolve('../packages/context/src'),
            '@forml/decorator-barebones': path.resolve(
                '../packages/decorator-barebones/src'
            ),
            '@forml/decorator-mui': path.resolve(
                '../packages/decorator-mui/src'
            ),
            '@forml/decorator-pdf': path.resolve(
                '../packages/decorator-pdf/src'
            ),
        },
        extensions: ['.*', '.js', '.jsx'],
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        app: path.resolve('./src/index.js'),
        iso: path.resolve('./src/iso.js'),
    },
    output: {
        chunkFilename: '[name].bundle.js',
        filename: '[name].bundle.js',
        publicPath: '/',
        path: path.resolve('./dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
        },
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-react',
                                {
                                    runtime: 'automatic',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['postcss-preset-mantine'],
                            },
                        },
                    },
                ],
            },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, type: 'asset/resource' },
        ],
    },
    plugins: [
        new MonacoEditorWebpackPlugin({
            languages: ['json'],
        }),
        new HtmlWebpackPlugin({
            filename: 'iso.html',
            chunks: ['iso'],
            template: './public/iso.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['app'],
            template: './public/index.html',
        }),
    ],
};

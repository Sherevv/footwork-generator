const helpers = require('./helpers');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: helpers.root('/src/main.ts'),
    },
    output: {
        path: helpers.root('/dist'),
        filename: 'assets/js/[name].[hash].js',
        chunkFilename: 'assets/js/[name].[chunkhash:7].js',
    },
    resolve: {
        extensions: ['.json', '.ts', '.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'Assets$': path.resolve(__dirname, '../src/assets'),
        }
    },
    devServer:
        {
            port: 8080,
            host: 'localhost',
            historyApiFallback: true,

            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            contentBase: './dist',
            compress: true,
            open: false,
        },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: false
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: "assets/images/[name].[hash].[ext]",
                },
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: "assets/fonts/[name].[hash].[ext]",
                },
            }
        ],
    },
};
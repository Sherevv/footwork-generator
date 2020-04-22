const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const helpers = require('./helpers');

module.exports = merge(baseWebpackConfig, {
    devServer:
        {
            hot: true,
            contentBase: './dist',
        },
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        /*new BundleAnalyzerPlugin({
            analyzerMode: 'static'
          }),*/
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Dev Config',
            template: 'src/index.ejs',
            inject: true,
            isLocalBuild: true,
            filename: helpers.root('/dist/index.html'),
        }),
        new CopyWebpackPlugin([
            {from: 'src/assets/favicon.ico', flatten: true},
            {from: 'src/assets/sounds/*', to: 'assets/sounds', flatten: true},
            {from: 'src/assets/img/preview.png', to: 'assets/images', flatten: true},
        ]),
        new webpack.HotModuleReplacementPlugin(),

    ]
});
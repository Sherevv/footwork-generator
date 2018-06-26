const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    devServer:
        {
            hot: true
        },
    devtool: 'source-map',
    plugins: [
        /*new BundleAnalyzerPlugin({
            analyzerMode: 'static'
          }),*/
        new HtmlWebpackPlugin({
            title: 'Dev Config',
            template: 'src/index.html',
            inject: true
        }),
        new CopyWebpackPlugin([
            {from: 'src/assets/favicon.ico', flatten: true},
            {from: 'src/assets/sounds/*', to: 'assets/sounds', flatten: true},
            {from: 'src/assets/img/preview.png', to: 'assets/images', flatten: true},
        ]),
        new webpack.HotModuleReplacementPlugin(),
    ]
});
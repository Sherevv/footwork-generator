const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');

module.exports = merge(baseWebpackConfig, {
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: "initial",
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    minChunks: 3,
                    enforce: true
                }
            }
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: helpers.root('/src/index.html'),
            favicon: helpers.root('/src/assets/favicon.ico'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new CleanWebpackPlugin([helpers.root('/dist')], {
            root: helpers.root('/'),
            verbose: true,
            dry: false
        }),
        new CopyWebpackPlugin([
            {from: 'src/assets/favicon.ico', flatten: true},
            {from: 'src/assets/sounds/*', to: 'assets/sounds', flatten: true},
            {from: 'src/assets/img/preview.png', to: 'assets/images', flatten: true},
        ], {copyUnmodified: true})
        /*    new CompressionPlugin({
              asset: '[path].gz[query]',
              test: /\.js$/
            }),*/
    ]
});
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const commonConfig = {
    entry: {
        three: './public/three.js',
        main: './app.js'
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        chunkFilename: '[name].bundle.js',
        filename: chunkData => chunkData.chunk.name === 'main' ? '[name].[chunkhash:12].js' : '[name].js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "./"),
            "@css": '@/public/css',
            "@images": '@/public/images',
            "@fonts": '@/public/fonts',
            "@src": "@/src",
            "@game": "@src/game",
            "@stage": "@src/stage",
            "@utils": "@src/utils",
            "@scene": "@src/scene",
            "@block": "@src/block",
            "@part": "@src/part",
            "@audio": "@/public/audio"
        }
    },
    devtool: "cheap-module-eval-source-map",
    devServer: {
        contentBase: "./dist",
        port: 8085,
        open: false
    },

    module: {
        rules: [{
            test: /\.(mp3|mp4|ogg)$/,
            use: {
                loader: "file-loader",
                options: {
                    name: "[name].[hash:8].[ext]",
                    outputPath: "audio/"
                }
            }
        }, {
            test: /\.(jpe?g|gif|svg|png)$/,
            use: {
                loader: "file-loader",
                options: {
                    name: "[name].[hash:8].[ext]",
                    outputPath: "images/"
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "babel-loader",
                options: {
                    plugins: ['@babel/plugin-proposal-class-properties'],
                    presets: [[
                        '@babel/preset-env', {
                            targets: {
                                chrome: 58,
                            },
                            useBuiltIns: "usage",
                            corejs: 2
                        }
                    ]]
                }
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "跳一跳H5",
            favicon: "./public/favicon.ico",
            filename: "index.html",
            template: "./public/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true
            },
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
}


module.exports = commonConfig;
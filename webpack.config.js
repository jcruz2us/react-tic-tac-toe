var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: {
        index: "./app/index.js",
        worker: "./app/worker.js"
    },
    output: {
        path: path.resolve(__dirname, "app"),
        filename: "[name].output.js",
        publicPath: path.resolve(__dirname, "app")
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ["es2015"]
            }
        }]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
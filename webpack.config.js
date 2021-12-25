const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/FrostFlake.ts',
    output: {
        filename: './frostflake.min.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts"]
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 5000
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },{
                test: /\.js$/,
                exclude:[
                    (/node_modules/),
                    path.resolve(__dirname, 'dist')
                ],
                loader: "source-map-loader"
            }
        ]
    }
}
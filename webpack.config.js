const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/FrostFlake.js',
    output: {
        filename: './dist/frostflake.min.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".js"]
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 5000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude:[
                    (/node_modules/),
                    path.resolve(__dirname, 'dist')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-transform-runtime'
                        ]
                    }   
                }
            }
        ]
    }
}
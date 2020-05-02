const path = require('path');

module.exports = {
    mode: 'development',
    entry: './demo/js/Demos.js',
    output: {
        filename: 'ff.min.js',
        path: path.resolve(__dirname, 'demo/dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods'
                        ]
                    }   
                }
            }
        ]
    }
}
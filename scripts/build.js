const concat = require('concat')
    uglify = require('uglify-es'),
    babel = require('@babel/core'),
    fs = require('fs'),
    path = require('path');

const config = {
    buildDirPath: path.dirname(__dirname) + '/build',
    concatFileName: 'frostflake.concat.js',
    buildFileName: 'frostflake.js',
    mapFileName: 'frostflake.js.map',
    babelOptions: {
        plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-private-methods"
        ]
    },
    uglifyOptions: {
        sourceMap: process.argv[2] === "no-sourceMap" ? false : {url: "frostflake.js.map", filename: "frostflake.js.map"}
    }
}

concat([
    './src/GameTime.js',
    './src/Utility/MathUtil.js',
    './src/Entities/Sprite.js',
    './src/Entities/Camera.js',
    './src/Drawing/CanvasRenderer.js',
    './src/Drawing/Frame.js',
    './src/Drawing/Animation.js',
    './src/Shapes/Shape.js',
    './src/Shapes/Circle.js',
    './src/Views/View.js',
    './src/Logging/Log.js',
    './src/Input/Cursor.js',
    './src/Input/Keys.js',
    './src/Input/Mouse.js',
    './src/Input/Input.js',
    './src/FrostFlake.js'
])
.then(result => {
    const transpiled = babel.transform(result, config.babelOptions);
    const uglified = uglify.minify(transpiled.code, config.uglifyOptions);
    cleanBuildDir(config.buildDirPath);

    // write concat file
    fs.writeFileSync(`${config.buildDirPath}/${config.concatFileName}`, result);

    // write sourcemap
    fs.writeFileSync(`${config.buildDirPath}/${config.mapFileName}`, uglified.map);

    // write transpiled/minified file
    fs.writeFileSync(`${config.buildDirPath}/${config.buildFileName}`, uglified.code);
})
.catch(error => console.log(error));

// wipe everything in the build directory
const cleanBuildDir = (buildDirPath) => {
    if (fs.existsSync(buildDirPath)) {
        fs.readdirSync(buildDirPath).forEach(filename => fs.unlinkSync(`${buildDirPath}/${filename}`));
    } 
    else {
        fs.mkdirSync(buildDirPath);
    }
}
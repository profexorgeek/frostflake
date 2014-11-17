module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: "\n// == NEW FILE ==\n"
            },
            dist: {
                src: [
                    "core/Class.js",
                    "core/Animation.js",
                    "core/Camera.js",
                    "core/Input.js",
                    "core/InputManager.js",
                    "core/Io.js",
                    "core/Renderer.js",
                    "core/Sprite.js",
                    "core/Util.js",
                    "core/View.js",
                    "frostFlake.js"
                ],
                dest: "dist/<%= pkg.name %>_<%= pkg.version %>_concat.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");

    grunt.registerTask("combine", ["concat"]);
}
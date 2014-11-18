module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: "\n// == NEW FILE ==\n"
            },
            dist: {
                src: [
                    "Class.js",
                    "Animation.js",
                    "Camera.js",
                    "Input.js",
                    "InputManager.js",
                    "Io.js",
                    "Renderer.js",
                    "Sprite.js",
                    "Util.js",
                    "View.js",
                    "frostFlake.js"
                ],
                dest: "dist/<%= pkg.name %>_<%= pkg.version %>_concat.js"
            }
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> Version: <%= pkg.version %> */\n"
            },
            dist : {
                files: {
                    "dist/<%= pkg.name %>_<%= pkg.version %>_min.js" : ["dist/<%= pkg.name %>_<%= pkg.version %>_concat.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("combine", ["concat"]);
    grunt.registerTask("package", ["concat", "uglify"]);
}
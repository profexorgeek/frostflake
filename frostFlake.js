/* ===============================================================================================

    FROSTFLAKE.JS
    Core FrostFlake library, initializes FrostFlake and provides Class object used for more
    typical OOP functionality that JavaScript doesn't provide by default.

================================================================================================*/

var frostFlake = (function (ff) {
    // application constants
    ff.constants = {
        CONTENT_DIRECTORY: "content",
        DEFAULT_WIDTH: 350,
        DEFAULT_HEIGHT: 350,
        DEFAULT_FPS: 60,
        DEFAULT_BACKGROUND: "rgba(0,0,0,1)"
    };

    // the game interval timer
    ff.timer = null;

    // object that tracks time between update cycles
    ff.time = {
        start: new Date(),
        last: new Date(),
        delta: 0,
        deltaFromStart: 0
    };

    // whether or not the game is paused
    ff.paused = false;

    // whether or not the game has focus
    ff.focused = false;

    // default renderer
    ff.renderer = null;

    // the default camera
    ff.camera = null;

    // default array of drawable objects
    ff.drawables = [];

    // current FPS target
    ff.targetFps = 60;

    // sets up the game, fps and background are optional
    ff.init = function(canvas, fps, background) {

        // validate args
        if (canvas === undefined || canvas === null) {
            throw "Unable to initialize FrostFlake: invalid drawing canvas";
        }
        background = ff.defaultIfNoValue(background, ff.constants.DEFAULT_BACKGROUND);
        ff.targetFps = ff.defaultIfNoValue(fps, ff.constants.DEFAULT_FPS);

        // init engine objects
        ff.camera = new ff.Camera(canvas.clientWidth, canvas.clientHeight);
        ff.renderer = new ff.Renderer(canvas, ff.camera, background);
        ff.input.init();
        ff.timer = setInterval(ff.run, 1000 / ff.targetFps);
    };

    // called by the game loop to update and draw the game
    ff.run = function () {
        ff.update();
        ff.renderer.draw(ff.drawables);
    };

    // updates time manager, camera and drawables in the rendering list
    ff.update = function () {
        ff.updateTime();
        ff.camera.update(ff.time.delta);
        for (var i = 0; i < ff.drawables.length; i++) {
            ff.drawables[i].update(ff.time.delta);
        }
        ff.customUpdate(ff.time.delta);
    };

    // this method can be overridden to call custom game logic
    ff.customUpdate = function (deltaTime) {
        // overridden by game
    }

    // updates the time object, calculates deltas
    ff.updateTime = function () {
        var startMilli = ff.time.start.getTime();
        var lastMilli = ff.time.last.getTime();
        ff.time.last = new Date();
        var nowMilli = ff.time.last.getTime();
        ff.time.delta = (nowMilli - lastMilli) / 1000;
        ff.time.deltaFromStart = (nowMilli - startMilli) / 1000;
    };

    // sorts drawables based on layer
    ff.updateDrawableLayers = function(drawable, newLayer) {
        throw "Not implemented.";
    };

    

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    // details: http://ejohn.org/blog/simple-javascript-inheritance/
    ff.Class = (function () {
            var initializing = false, fnTest = /xyz/.test(function () {
                xyz;
            }) ? /\b_super\b/ : /.*/;

            // The base Class implementation (does nothing)
            this.Class = function () {
            };

            // Create a new Class that inherits from this class
            Class.extend = function (prop) {
                var _super = this.prototype;

                // Instantiate a base class (but only create the instance,
                // don't run the init constructor)
                initializing = true;
                var prototype = new this();
                initializing = false;

                // Copy the properties over onto the new prototype
                for (var name in prop) {
                    // Check if we're overwriting an existing function
                    prototype[name] = typeof prop[name] == "function" &&
                        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                        (function (name, fn) {
                            return function () {
                                var tmp = this._super;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this._super = _super[name];

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this._super = tmp;

                                return ret;
                            };
                        })(name, prop[name]) :
                        prop[name];
                }

                // The dummy class constructor
                function Class() {
                    // All construction is actually done in the init method
                    if (!initializing && this.init)
                        this.init.apply(this, arguments);
                }

                // Populate our constructed prototype object
                Class.prototype = prototype;

                // Enforce the constructor to be what we expect
                Class.prototype.constructor = Class;

                // And make this class extendable
                Class.extend = arguments.callee;

                return Class;
            };
        })();

    return ff;
}(frostFlake || {}));
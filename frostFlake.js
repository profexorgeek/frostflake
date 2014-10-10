var frostFlake = (function (ff, $) {
    ff.constants = {
        CONTENT_DIRECTORY: "content",
        DEFAULT_WIDTH: 350,
        DEFAULT_HEIGHT: 350,
        DEFAULT_FPS: 60,
        DEFAULT_BACKGROUND: "rgba(0,0,0,1)"
    };

    ff.paused = false;
    ff.focused = false;
    ff.canvas = null;
    ff.timer = null;
    ff.camera = null;
    ff.drawables = [];
    ff.targetFps = 60;
    ff.time = {
        start: new Date(),
        last: new Date(),
        delta: 0,
        deltaFromStart: 0
    };
    ff.renderer = null;

    // sets up the game, all arguments are optional but if no canvas is passed the created canvas will need added to the DOM
    ff.init = function(canvas, fps, background) {
        if ($ === undefined || $ === null) {
            throw "FrostFlake depends on jQuery, which was not found.";
        }

        background = background ? background : ff.constants.DEFAULT_BACKGROUND;
        ff.canvas = canvas ? canvas : ff.createCanvas();
        ff.targetFps = fps ? fps : ff.constants.DEFAULT_FPS;
        ff.camera = new ff.Camera(canvas.clientWidth, canvas.clientHeight);
        ff.renderer = new ff.Renderer(ff.canvas, ff.camera, background);
        ff.input.init();
        ff.timer = setInterval(ff.run, 1000 / ff.targetFps);
    };

    // creates a canvas object to draw on
    ff.createCanvas = function(width, height) {
        width = width ? width : ff.constants.DEFAULT_WIDTH;
        height = height ? height : ff.constants.DEFAULT_HEIGHT;

        var canvas = $('<canvas width="' + width + 'px" height="' + height + 'px"  />');
        return canvas;
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

    // method overridden by custom code
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

    // adds a drawable to render queue
    ff.addDrawable = function(drawable) {
        var placeToAdd = ff.drawables.length - 1;
        for(var i = 0; i < ff.drawables.length; i++) {
            if(drawable.layer < ff.drawables[i].layer) {
                placeToAdd = i;
                break;
            }
        }
        ff.drawables.splice(placeToAdd, 0, drawable);
    };

    // adds collection of drawables to render queue
    ff.addDrawableArray = function(drawableArray) {
        for(var i = 0; i < drawableArray.length; i++) {
            ff.addDrawable(drawableArray[i]);
        }
    };

    // removes a drawable from render queue
    ff.removeDrawable = function(drawable) {
        var index = ff.drawables.indexOf(drawable);
        if(index >= 0) {
            ff.drawables.splice(index, 1);
        }
    };

    // removes collection of drawables from render queue
    ff.removeDrawableArray = function(drawableArray) {
        for(var i = 0; i < drawableArray.length; i++) {
            ff.removeDrawable(drawableArray[i]);
        }
    };

    // removes all drawables from render queue
    ff.clearDrawables = function() {
        ff.drawables = [];
    };

    // loads an image from a URL
    ff.loadImage = function (url, loadedCallback) {
        var path = url;
        var img;

        if (url.indexOf("data:") < 0 && url.indexOf("http") < 0) {
            path = ff.constants.CONTENT_DIRECTORY + "/" + url;
            if (path.indexOf(".") < 0) {
                path += ".png";
            }
        }

        img = new Image();
        img.loadEvents = [];
        if (loadedCallback) {
            img.loadEvents.push(loadedCallback);
        }

        // execute callbacks on load
        img.onload = function () {
            for (var i = 0; i < img.loadEvents.length; i += 1) {
                img.loadEvents[i]();
            }
        };

        img.src = path;

        return img;
    };

    // loads json from a url
    ff.loadJson = function (url, successCallback, failCallback, alwaysCallback) {
        if (!successCallback) {
            successCallback = function (json) {
                console.log("Loaded json from: " + url);
            }
        }

        if (!failCallback) {
            failCallback = function (jqxhr, textStatus, error) {
                console.log("Failed to load JSON: " + textStatus + ", " + error);
            };
        }
        $.getJSON(url).done(successCallback).fail(failCallback).always(alwaysCallback);
    };

    // converts an object to a JSON string
    ff.toJson = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    // parses a json string, WARNING: uses eval
    ff.fromJson = JSON.parse || function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };


    // TODO: migrate away from using this!
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
}(frostFlake || {}, jQuery));
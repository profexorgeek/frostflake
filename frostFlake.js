/* ===============================================================================================

    FROSTFLAKE.JS
    Frostflake Game object. This is the entry point to creating a game.

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {

    "use strict";

    // The Game class that all games should extend
    ff.Game = Class.extend({
        // constructor
        init: function (canvas, fps, background) {

            // self reference for callbacks
            var me = this;

            // canvas is a required argument
            if (!ff.hasValue(canvas)) {
                throw "Unable to initialize game without a valid canvas!";
            }

            // keep a reference to the game canvas
            me.canvas = canvas;

            // keep a reference to the background color
            me.background = ff.defaultIfNoValue(background, "rgba(0, 0, 0, 0)");

            // set the starting view to a default view
            me.currentView = new ff.View();

            // initialize the games main camera
            me.camera = new ff.Camera(canvas.clientWidth, canvas.clientHeight);

            // initialize the game's main renderer
            me.renderer = new ff.Renderer();

            // init FPS to 60 if not defined
            me.targetFps = ff.defaultIfNoValue(fps, 60);

            // init input manager
            me.inputManager = new ff.InputManager(canvas, me.camera);

            // object used to track elapsed time each update
            me.time = {
                start: new Date(),      // the time the game started
                last: new Date(),       // the last update cycle time
                delta: 0,               // milliseconds since last update
                deltaFromStart: 0       // milliseconds since game started
            };

            // whether or not the game should update
            me.paused = false;

            // whether or not the game has focus
            me.focused = false;

            // start the game timer
            me.timer = window.setInterval( function () {
                me.update();
            }, 1000 / this.targetFps);
        },

        // updates the elapsed time each update cycle
        updateTime: function () {
            var startMilli = this.time.start.getTime(),         // the time the game started
                lastMilli = this.time.last.getTime(),           // the time the last update was performed
                nowMilli = new Date();                          // this update cycle time

            this.time.last = nowMilli;
            this.time.delta = (nowMilli - lastMilli) / 1000;
            this.time.deltaFromStart = (nowMilli - startMilli) / 1000;
        },

        // the core update loop of the game, called by the interval timer
        update: function () {
            this.updateTime();
            this.camera.update(this.time.delta);
            this.inputManager.update(this.time.delta);
            this.currentView.update(this.time.delta);
            this.renderer.draw(this.currentView.sprites, this.camera, this.canvas, this.background);
        },

        // notify the game that the rendering surface size has changed
        notifyCanvasSizeChanged: function () {
            this.camera.updateDimensions(this.canvas.clientWidth, this.canvas.clientHeight);
        }
    });

    return ff;
}(frostFlake || {}));
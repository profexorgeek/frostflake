/* ===============================================================================================

    FROSTFLAKE.JS
    Frostflake Game object. This is the entry point to creating a game.

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {

    "use strict";

    // If this many milliseconds elapses between updates, frame is discarded
    var updateTimeThreshold = 500;

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
            me.input = new ff.Input(me);

            // object used to track elapsed time each update
            me.time = {
                start: new Date(),      // the time the game started
                last: new Date(),       // the last update cycle time
                frameSeconds: 0,        // milliseconds since last update
                gameTimeSeconds: 0      // milliseconds since game started
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
            var lastMilli = this.time.last.getTime(),   // the time the last update was performed
                nowMilli = new Date(),                  // this update cycle time
                deltaMilli = nowMilli - lastMilli;      // frame delta in miliseconds

            // calculate the delta between frames
            if(deltaMilli < updateTimeThreshold) {
                
                this.time.frameSeconds = deltaMilli / 1000;
            }

            // too long has elapsed, reset delta
            else {
                this.time.frameSeconds = 0;
                console.log("Time between frames (" + deltaMilli + ") exceeded " + updateTimeThreshold + ", delta reset.");
            }

            this.time.gameTimeSeconds += this.time.frameSeconds;
            this.time.last = nowMilli;
        },

        // the core update loop of the game, called by the interval timer
        update: function () {
            this.updateTime();
            this.camera.update(this.time.frameSeconds);
            this.input.update(this.time.frameSeconds);
            this.currentView.update(this.time.frameSeconds);
            this.renderer.draw(this.currentView.sprites, this.camera, this.canvas, this.background);
        },

        // notify the game that the rendering surface size has changed
        notifyCanvasSizeChanged: function () {
            this.camera.updateDimensions(this.canvas.clientWidth, this.canvas.clientHeight);
        }
    });

    return ff;
}(frostFlake || {}));
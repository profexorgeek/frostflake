/* ===============================================================================================

    GAME.JS
    This is an example of how to create a new game by extending the frostFlake game class.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    
    "use strict";
    
    // custom game instance extends frostFlake
    g.Game = ff.Game.extend({

        // constructor gets a canvas and a div to write FPS
        init: function (canvas, fpsDiv) {

            // reference to a div 
            this.fpsDiv = fpsDiv;

            // container to keep track of FPS over time
            this.fps = [];

            // number of FPS samples to average
            this.fpsSamples = 60;

            // call parent with custom background color
            this._super(canvas, 60, "rgba(10, 10, 15, 1)");

            // set our custom view as the current view
            this.currentView = new g.views.Space();
        },

        // override the frostFlake.update method to add FPS calc
        update: function () {
            this._super();
            this.updateFps();
            this.fpsDiv.innerHTML = this.averageFps();
        },

        // add this frame's FPS to the log
        updateFps: function () {
            var thisFrameFps = 1 / ff.game.time.delta;
            this.fps.push(thisFrameFps);

            if(this.fps.length > this.fpsSamples) {
                this.fps.shift();
            }
        },

        // get an average of the FPS over time
        averageFps: function () {
            var i, fpsAverage = 0;
            if(this.fps.length > 0) {
                for(i = 0; i < this.fps.length; i++) {
                    fpsAverage += this.fps[i];
                }
                fpsAverage = fpsAverage / this.fps.length;
            }
            return Math.floor(fpsAverage);
        },

        // override size change events: if the rendering surface changes, the starfield needs to be refreshed
        notifyCanvasSizeChanged: function () {
            this._super();
            if(this.currentView instanceof g.views.Space) {
                this.currentView.randomizeStarfield();
            }
        }
    });

return g;
}(game || {}, frostFlake));
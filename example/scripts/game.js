var game = (function (g, ff) {
    "use strict";
    
    g.Game = ff.Game.extend({
        init: function (canvas, fpsDiv) {
            this.fpsDiv = fpsDiv;
            this.fps = [];
            this.fpsSamples = 60;
            this._super(canvas, 60, "rgba(10, 10, 15, 1)");

            console.log("Game instantiated.");

            this.currentView = new g.views.Space();
        },

        update: function () {
            this._super();
            this.updateFps();
            this.fpsDiv.innerHTML = this.averageFps();
        },

        updateFps: function () {
            var thisFrameFps = 1 / ff.game.time.delta;
            this.fps.push(thisFrameFps);

            if(this.fps.length > this.fpsSamples) {
                this.fps.shift();
            }
        },

        averageFps: function () {
            var i, fpsAverage = 0;
            if(this.fps.length > 0) {
                for(i = 0; i < this.fps.length; i++) {
                    fpsAverage += this.fps[i];
                }
                fpsAverage = fpsAverage / this.fps.length;
            }
            return Math.floor(fpsAverage);
        }
    });

return g;
}(game || {}, frostFlake));

// Load the game
$(function() {
    console.log("DOM ready: starting game...");
    var canvas = $("canvas#gameWindow")[0],
        fpsDiv = $("div#fps")[0],
        gameInstance;

        // ask for the game to be fullscreen
        // $("button#fullScreen").on('click', function () {
        //     if (canvas.requestFullscreen) {
        //     console.log("Calling requestFullScreen");
        //     canvas.requestFullscreen();
        //     }
        //     else if (canvas.msRequestFullscreen) {
        //         console.log("Calling msRequestFullscreen");
        //         canvas.msRequestFullscreen();
        //     }
        //     else if (canvas.mozRequestFullScreen) {
        //         console.log("Calling mozRequestFullScreen");
        //         canvas.mozRequestFullScreen();
        //     }
        //     else if (canvas.webkitRequestFullscreen) {
        //         console.log("Calling webkitRequestFullscreen");
        //         canvas.webkitRequestFullscreen();
        //     }
        //     else {
        //         console.log("Fullscreen not available.");
        //     }

        //     $("canvas#gameWindow").attr('width', $(document).width());
        //     $("canvas#gameWindow").attr('height', $(document).height());
        // });

        gameInstance = new game.Game(canvas, fpsDiv);
});
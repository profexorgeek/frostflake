/* ===============================================================================================

    STARTUP.JS
    This is an example of how to startup a game instance. It utilizes jQuery to
    wait for the DOM and bind actions to native HTML elements.

================================================================================================*/

/* global game, frostFlake, $ */
$(function() {

    "use strict";

    var canvasJQ = $("canvas#gameWindow"),              // jQuery canvas object
        canvas = canvasJQ[0],                           // canvas object game will render to
        fpsDiv = $("div#fps")[0],                       // div to track FPS
        fullScreenButton = $("div#fullScreen"),         // button to toggle fullscreen
        gameInstance;                                   // the instance of our game

        // sets the canvas pixel size to the max browser window
        function updateCanvasSize () {
            var height = $("html").height(),
                width = $("html").width();

            // update the actual pixel size of the canvas to match html element
            canvasJQ.attr("width", width + "px");
            canvasJQ.attr("height", height + "px");

            if(frostFlake.hasValue(gameInstance)) {
                gameInstance.notifyCanvasSizeChanged();
            }
        }

        // toggles between full and normal screen size
        function toggleFullScreen() {
            var html = $("html")[0];
            if (!$(document).fullscreenElement &&
                !$(document).mozFullScreenElement &&
                !$(document).webkitFullscreenElement &&
                !$(document).msFullscreenElement
            ) {
                console.log("Attempting to enter fullscreen.");
                if (html.requestFullscreen) {
                    html.requestFullscreen();
                }
                else if (html.msRequestFullscreen) {
                    html.msRequestFullscreen();
                }
                else if (html.mozRequestFullScreen) {
                    html.mozRequestFullScreen();
                }
                else if (html.webkitRequestFullscreen) {
                    html.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
            else {
                console.log("Attempting to exit fullscreen.");
                if ($(document).exitFullscreen) {
                    $(document).exitFullscreen();
                }
                else if ($(document).msExitFullscreen) {
                    $(document).msExitFullscreen();
                }
                else if ($(document).mozCancelFullScreen) {
                    $(document).mozCancelFullScreen();
                }
                else if ($(document).webkitExitFullscreen) {
                    $(document).webkitExitFullscreen();
                }
            }
        }

        // set canvas based on HTML size
        updateCanvasSize();

        // listen for window resize and update game
        $(window).on("resize", function () {
            updateCanvasSize();
        });

        // ask for the game to be fullscreen
        fullScreenButton.on("click", function () {
            toggleFullScreen();
        });

        // instantiate the game
        gameInstance = new game.Game(canvas, fpsDiv);
});
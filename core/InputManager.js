/* ===============================================================================================

    INPUTMANAGER.JS
    Uses jQuery to listen for state changes and update the input objects.

================================================================================================*/

/*global document, jQuery */
var frostFlake = (function (ff, $) {
    "use strict";

    ff.InputManager = Class.extend({
        init: function (canvas) {
            var mouse = ff.mouse,               // local reference to the mouse object
                keyboard = ff.keyboard;         // local reference to the keyboard object

            if (!ff.hasValue(canvas)) {
                throw "InputManager needs a valid canvas to listen for input.";
            }

            // handle mouse over canvas
            $(canvas).mouseenter(function () {
                mouse.inFrame = true;
            });
            $(canvas).mouseleave(function () {
                mouse.inFrame = false;
            });

            // update mouse position
            $(canvas).mousemove(function (e) {
                mouse.lastX = mouse.x;
                mouse.lastY = mouse.y;
                mouse.x = e.offsetX - (ff.renderer.viewBounds.width / 2);
                mouse.y = ff.math.invert(e.offsetY) + (ff.renderer.viewBounds.height / 2);
                mouse.changeX = mouse.x - mouse.lastX;
                mouse.changeY = mouse.y - mouse.lastY;
                mouse.worldX = ff.camera.position.x + mouse.x;
                mouse.worldY = ff.camera.position.y + mouse.y;
            });

            // handle mouse button pressed
            $(document).mousedown(function (e) {
                var buttonName = mouse.buttonCodes[e.which];
                mouse.pressed[buttonName] = true;
            });

            // handle mouse button released
            $(document).mouseup(function (e) {
                var buttonName = mouse.buttonCodes[e.which];
                mouse.pressed[buttonName] = false;
            });

            // handle keyboard button press
            $(document).keydown(function (e) {
                var keyName = keyboard.chars[e.which];
                keyboard.pressed[keyName] = true;
            });

            // handle keyboard button release
            $(document).keyup(function (e) {
                var keyName = keyboard.chars[e.which];
                keyboard.pressed[keyName] = false;

                // prevent the keyboard from scrolling browser
                // TODO: also handle page up/down etc?
                if (keyName === "Space" && ff.focused === true) {
                    e.preventDefault();
                }
            });
        }
    });

    return ff;
}(frostFlake || {}, jQuery));
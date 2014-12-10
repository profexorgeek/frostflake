/* ===============================================================================================

    INPUTMANAGER.JS
    Updates the frostFlake input objects by implementing listeners on the canvas. Simulates
    left clicks for touches on touch-enabled devices.

    Requires updating to keep mouse coordinates in sync with a moving camera if mousemove
    event has not fired.

================================================================================================*/

/*global document, jQuery, Class */
var frostFlake = (function (ff, $) {

    "use strict";

    ff.InputManager = Class.extend({

        // constructor: sets up all event listeners using jQuery
        init: function (canvas, camera) {
                var me = this,
                    mouse = ff.input.mouse,         // local reference for mouse
                    keyboard = ff.input.keyboard;   // local reference for keyboard
                this.camera = camera;               // local reference for camera

            if (!ff.hasValue(canvas)) {
                throw "InputManager needs a valid canvas to listen for input.";
            }

            //============================================
            // TOUCH EVENTS
            //============================================
            // simulate mouse movement on touch
            $(document).on("touchmove", function (e) {
                var touch = e.originalEvent.touches[0];
                if(ff.hasValue(touch)) {
                    me.updateMouseLocation(touch.clientX, touch.clientY);
                }

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            // simulate mousedown on touch
            $(document).on("touchstart", function (e) {
                var touch = e.originalEvent.touches[0];
                if(ff.hasValue(touch)) {
                    me.updateMouseLocation(touch.clientX, touch.clientY);
                }
                mouse.buttonsDown.Left = true;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            // simulate mouseup on touch
            $(document).on("touchend", function (e) {
                var touch = e.originalEvent.touches[0];
                if(ff.hasValue(touch)) {
                    me.updateMouseLocation(touch.clientX, touch.clientY);
                }
                mouse.buttonsDown.Left = false;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            //============================================
            // MOUSE EVENTS
            //============================================
            // handle mouse over canvas
            $(canvas).mouseenter(function () {
                mouse.inFrame = true;
            });
            $(canvas).mouseleave(function () {
                mouse.inFrame = false;
            });
            
            // handle mouse movement
            $(canvas).on("mousemove", function (e) {
                me.updateMouseLocation(e.offsetX, e.offsetY);

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            // handle mouse button pressed, simulate presses on touch
            $(document).on("mousedown", function (e) {
                var buttonName = mouse.buttonCodes[e.which];
                mouse.buttonsDown[buttonName] = true;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            // handle mouse button released
            $(document).on("mouseup", function (e) {
                var buttonName = mouse.buttonCodes[e.which];
                mouse.buttonsDown[buttonName] = false;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            //============================================
            // KEYBOARD EVENTS
            //============================================
            // handle keyboard button press
            $(document).keydown(function (e) {
                var keyName = keyboard.chars[e.which];
                keyboard.keysDown[keyName] = true;
            });

            // handle keyboard button release
            $(document).keyup(function (e) {
                var keyName = keyboard.chars[e.which];
                keyboard.keysDown[keyName] = false;

                // prevent the keyboard from scrolling browser
                // TODO: also handle page up/down etc?
                if (keyName === "Space" && ff.focused === true) {
                    e.preventDefault();
                }
            });
        },

        // updates the mouse object based on the position where an event occurred
        updateMouseLocation: function (locationX, locationY) {
            var mouse = ff.input.mouse,
                camera = this.camera;

            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
            mouse.x = locationX - (camera.viewPort.width / 2);
            mouse.y = ff.math.invert(locationY) + (camera.viewPort.height / 2);
            mouse.changeX = mouse.x - mouse.lastX;
            mouse.changeY = mouse.y - mouse.lastY;
            mouse.worldX = camera.position.x + mouse.x;
            mouse.worldY = camera.position.y + mouse.y;
        },

        // update mouse world coordinates from camera
        update: function (deltaTime) {
            var m = ff.input.mouse;
            m.worldX = this.camera.position.x + m.x;
            m.worldY = this.camera.position.y + m.y;
        }
    });

    return ff;
}(frostFlake || {}, jQuery));
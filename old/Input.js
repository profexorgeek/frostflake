/* ===============================================================================================

    INPUT.JS
    Updates the frostFlake input objects by implementing listeners on the canvas. Simulates
    left clicks for touches on touch-enabled devices.

    Requires updating to keep mouse coordinates in sync with a moving camera if mousemove
    event has not fired.

    Provides mouse and keyboard objects that can be queried for input state

================================================================================================*/

/*global document, jQuery, Class */
var frostFlake = (function (ff, $) {

    "use strict";

    ff.Input = Class.extend({

        // constructor calls event binders
        init: function(gameReference) {
            
            this.game = gameReference;

            // provides methods for tracking mouse state
            this.mouse = {
                lastX: 0,               // the mouse last X position
                lastY: 0,               // the mouse last Y position
                x: 0,                   // mouse current X
                y: 0,                   // mouse current Y
                worldX: 0,              // mouse X translated by default camera position
                worldY: 0,              // mouse Y translated by default camera position
                changeX: 0,             // x change since last frame
                changeY: 0,             // y change since last frame
                buttonsDown: {},        // collection of currently pressed buttons
                inFrame: false,         // whether or not the mouse is within the canvas

                // checks if a provided button is currently pressed
                buttonDown: function (button) {
                    return this.buttonsDown[ff.mouse.buttonCodes[button]] === true;
                },

                // checks if the mouse world coordinates are over the sprite
                isOverSprite: function (sprite) {
                    if (!(sprite instanceof ff.Sprite)) {
                        throw "Instance is not a sprite";
                    }
                    var spriteHalfWidth = sprite.width * 0.5,
                        spriteHalfHeight = sprite.height * 0.5;

                    if (this.worldX > sprite.position.x - spriteHalfWidth &&
                            this.worldX < sprite.position.x + spriteHalfWidth &&
                            this.worldY > sprite.position.y - spriteHalfHeight &&
                            this.worldY < sprite.position.y + spriteHalfHeight) {
                        return true;
                    }
                    return false;
                }
            };

            // provides methods for retrieving keyboard state
            this.keyboard = {
                // collection to store currently pressed keys
                keysDown: {},

                // boolean returns if key is in the collection of currently-pressed keys
                keyDown: function (key) {
                    return this.keysDown[ff.keyboard.chars[key]] === true;
                }
            };

            if(!ff.hasValue(this.game.canvas)) {
                throw "InputManager needs a valid canvas to listen for input.";
            }

            if(!ff.hasValue(this.game.camera)) {
                throw "InputManager needs a camera to calculate mouse position";
            }

            this.bindTouchEvents();
            this.bindMouseEvents();
            this.bindKeyboardEvents();
        },

        // attempts to simulate mouse input on touch to centralize input handling
        bindTouchEvents: function() {
            var me = this,
                mouse = this.mouse;

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
        },

        bindMouseEvents: function () {
            var canvas = this.game.canvas,
                mouse = this.mouse,
                me = this;

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

            // handle mouse button pressed
            $(document).on("mousedown", function (e) {
                var buttonName = ff.mouse.buttonCodes[e.which];
                mouse.buttonsDown[buttonName] = true;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });

            // handle mouse button released
            $(document).on("mouseup", function (e) {
                var buttonName = ff.mouse.buttonCodes[e.which];
                mouse.buttonsDown[buttonName] = false;

                if(mouse.inFrame === true) {
                    e.preventDefault();
                }
            });
        },

        bindKeyboardEvents: function () {
            var keyboard = this.keyboard;

            // handle keyboard button press
            $(document).keydown(function (e) {
                var keyName = ff.keyboard.chars[e.which];
                keyboard.keysDown[keyName] = true;
            });

            // handle keyboard button release
            $(document).keyup(function (e) {
                var keyName = ff.keyboard.chars[e.which];
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
            var mouse = this.mouse,
                camera = this.game.camera;

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
            var m = this.mouse,
                c = this.game.camera;
            m.worldX = c.position.x + m.x;
            m.worldY = c.position.y + m.y;
        }
    });

    return ff;
}(frostFlake || {}, jQuery));
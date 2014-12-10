/* ===============================================================================================

    CLASS.JS
    This was written by John Resig (http://ejohn.org/)
    http://ejohn.org/blog/simple-javascript-inheritance/
    
    Inspired by base2 and Prototype. MIT Licensed.

    This allows OOP-like inheritance for most of the frostFlake objects and makes it much
    easier to create custom game objects based on frostFlake core types.

    This is the only class in frostFlake that is not expected to conform to the
    majority of JSLint because John Resig > Justin Johnson

================================================================================================*/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
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
        (function(name, fn){
          return function() {
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
      if ( !initializing && this.init )
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
// == NEW FILE ==
/* ===============================================================================================

    ANIMATION.JS
    Animation Class used by Sprites to control animation chains.


================================================================================================*/

var frostFlake = (function (ff) {
    
    "use strict";
    
    ff.Animation = function () {
        var texturePath = "",        // the url of the spritesheet for this animation 
            sequences = {},             // an object containing sequences with name as key
            currentSequence = {},       // the current animation sequence
            currentSequenceName = "",   // the name of the sequence playing
            currentFrameIndex = 0,      // the current frame index in the current sequence
            frameWidth = 0,             // the width of the animation frames
            frameHeight = 0,            // the height of the animation frames
            isAnimating = false,        // whether the animation is currently playing
            timeLeftInFrame = 0;        // amount of time before animation advances

        // getter/setter for currentSequence
        this.currentSequence = function (sequenceName) {
            if (ff.hasValue(sequenceName) && sequenceName !== currentSequenceName) {
                if (sequences.hasOwnProperty(sequenceName)) {
                    currentSequenceName = sequenceName;
                    currentSequence = sequences[sequenceName];
                    currentFrameIndex = 0;
                    timeLeftInFrame = currentSequence.frames[currentFrameIndex].duration;
                }
            }

            return currentSequence;
        };

        // getter/setter for currentFrameIndex
        this.currentFrame = function (index) {
            if(ff.hasValue(index)) {
                currentFrameIndex = index;
            }
            return currentFrameIndex;
        };

        // getter with potential to be setter for spriteSheetUrl
        this.spriteSheetUrl = function (path) {
            if(ff.hasValue(path)) {
                texturePath = path;
            }
            return texturePath;
        };

        // update the flow of animation through frames
        this.update = function (deltaTime) {
            if (isAnimating === true && ff.hasValue(currentSequence)) {
                // reduce time left in frame by elapsed time
                timeLeftInFrame = timeLeftInFrame - deltaTime;

                if (timeLeftInFrame <= 0) {
                    if (currentFrameIndex < currentSequence.frames.length - 1) {
                        currentFrameIndex = currentFrameIndex + 1;
                    } else {
                        if (currentSequence.isLooping) {
                            currentFrameIndex = 0;
                        }
                    }

                    // NOTE: Render cycles do not exacly match frame durations!
                    // So we need to increment timeLeftInFrame instead of setting it directly.
                    // This makes overall animation duration more accurate.
                    // Long hiccups in update speed will result in animations playing very quickly until
                    // they catch up.
                    timeLeftInFrame = timeLeftInFrame + currentSequence.frames[currentFrameIndex].duration;
                }

            }
        };

        // starts the animation if valid sequences are defined
        this.start = function () {
            if (ff.hasValue(currentSequence) && ff.hasValue(currentSequence.frames) && currentSequence.frames.length > 0) {
                isAnimating = true;
            }
        };

        // stops the animation
        this.stop = function () {
            isAnimating = false;
        };

        // gets the specific texture coordinates of the current frame for rendering
        this.getTextureCoordinates = function () {
            var coords = {top: 0, right: 0, bottom: 0, left: 0 },  // coordinates object expected by renderer
                frameData;                                         // reference to the current frame

            if (ff.hasValue(currentSequence.frames) && currentSequence.frames.length > 0) {
                frameData = currentSequence.frames[currentFrameIndex];
                coords = {
                    top: frameData.top,
                    right: frameData.left + frameWidth,
                    bottom: frameData.top + frameHeight,
                    left: frameData.left
                };
            }

            return coords;
        };

        // returns a JSON string representing this animation
        this.toJson = function () {
            return {
                spriteSheetUrl: this.spriteSheetUrl(),
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                sequences: sequences
            };
        };

        // populates animation data from a json string and stops animating
        this.fromJson = function (jsonObject) {
            this.spriteSheetUrl(jsonObject.spriteSheetUrl);
            frameWidth = jsonObject.frameWidth;
            frameHeight = jsonObject.frameHeight;
            sequences = jsonObject.sequences;
            isAnimating = false;
        };
    };

    // static method allowing creation of an animation instance from a URL
    ff.Animation.getInstanceFromUrl = function (url, loadedCallback) {

        var animation = new ff.Animation();

        // load from URL if one was provided
        if (ff.hasValue(url)) {
            ff.loadJson(url, function (json) {
                animation.fromJson(json);

                if (ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
            });
        }

        return animation;
    };

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
/* ===============================================================================================

    CAMERA.JS
    Represents a view of the game area. Used by the renderer to translate object
    coordinates during the drawing cycle.

================================================================================================*/

/*global Class */
var frostFlake = (function (ff) {
    
    "use strict";

    ff.Camera = Class.extend({

        // set up initial properties and update viewport
        init: function (viewWidth, viewHeight) {
            // positionable object the camera is attached to
            this.attachTarget = null;

            // describes the camera's current viewable area
            this.viewPort = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: viewWidth,
                height: viewHeight
            };

            // the camera's rate of movement
            this.velocity = {
                x: 0,
                y: 0
            };

            // the camera position
            this.position = {
                x: 0,
                y: 0
            };

            this.updateViewPort();
        },

        // updates position and viewport
        update: function (deltaTime) {
            if (ff.hasValue(this.attachTarget)) {
                this.velocity = this.attachTarget.velocity;
                this.position = this.attachTarget.position;
            } else {
                this.position.x = this.position.x + (this.velocity.x * deltaTime);
                this.position.y = this.position.y + (this.velocity.y * deltaTime);
            }
            this.updateViewPort();
        },

        // updates the viewport based on position and dimensions
        updateViewPort: function () {
            var halfWidth = this.viewPort.width / 2,
                halfHeight = this.viewPort.height / 2;

            this.viewPort.left = this.position.x - halfWidth;
            this.viewPort.right = this.position.x + halfWidth;
            this.viewPort.top = this.position.y + halfHeight;
            this.viewPort.bottom = this.position.y - halfHeight;
        },

        // checks for position property and attaches camera if valid target
        attachTo: function (positionable) {
            if (ff.hasValue(positionable.position)) {
                this.attachTarget = positionable;
                this.position = this.attachTarget;
                this.updateViewPort();
                return true;
            }
            return false;
        },

        // detaches the camera from positionable object
        detach: function () {
            this.attachTarget = null;
        },

        // gets a random point within the view of the camera
        getRandomPointInView: function () {
            return {
                x: this.getRandomXInView(),
                y: this.getRandomYInView()
            };
        },

        // gets a random point along the x axis within the viewport
        getRandomXInView: function () {
            return ff.math.randomInRange(this.viewPort.left, this.viewPort.right);
        },

        // gets a random point along the y axis within the viewport
        getRandomYInView: function () {
            return ff.math.randomInRange(this.viewPort.bottom, this.viewPort.top);
        },

        // updates the height and width of the camera, call if the canvas size changes
        updateDimensions: function (viewWidth, viewHeight) {
            this.viewPort.width = viewWidth;
            this.viewPort.height = viewHeight;
            this.updateViewPort();
        }
    });

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
/* ===============================================================================================

    INPUT.JS
    Exposes two input objects that provide information about user input. These objects
    must be updated by an input manager that implements platform-specific event handlers
    for input.

    Mouse:
    Provides properties tracking actual and world-adjusted coordinates and methods for 
    detecting if buttons are pressed. Exposes button lists by button code and button name.

    Keyboard:
    Provides methods for detecting key press and release. Exposes key lists by keycode and
    by key name.

================================================================================================*/

var frostFlake = (function (ff) {
    
    "use strict";

    ff.input = {

        // exposes properties and methods for tracking mouse input
        mouse: {
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

            // provides button codes by button name
            buttons: {
                "Left": 1,
                "Middle": 2,
                "Right": 3
            },

            // provides button names by button code
            buttonCodes: {
                1: "Left",
                2: "Middle",
                3: "Right"
            },

            // checks if a provided button is currently pressed
            buttonDown: function (button) {
                return this.buttonsDown[this.buttonCodes[button]] === true;
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
        },

        // exposes properties and methods for tracking keyboard input
        keyboard: {

            // collection to store currently pressed keys
            keysDown: {},

            // key characters by name
            keys: {
                "Backspace": 8,
                "Tab": 9,
                "Enter": 13,
                "Shift": 16,
                "Ctrl": 17,
                "Alt": 18,
                "PauseBreak": 19,
                "CapsLock": 20,
                "Esc": 27,
                "Space": 32,
                "PageUp": 33,
                "PageDown": 34,
                "End": 35,
                "Home": 36,
                "Left": 37,
                "Up": 38,
                "Right": 39,
                "Down": 40,
                "Insert": 45,
                "Delete": 46,
                "0": 48,
                "1": 49,
                "2": 50,
                "3": 51,
                "4": 52,
                "5": 53,
                "6": 54,
                "7": 55,
                "8": 56,
                "9": 57,
                "A": 65,
                "B": 66,
                "C": 67,
                "D": 68,
                "E": 69,
                "F": 70,
                "G": 71,
                "H": 72,
                "I": 73,
                "J": 74,
                "K": 75,
                "L": 76,
                "M": 77,
                "N": 78,
                "O": 79,
                "P": 80,
                "Q": 81,
                "R": 82,
                "S": 83,
                "T": 84,
                "U": 85,
                "V": 86,
                "W": 87,
                "X": 88,
                "Y": 89,
                "Z": 90,
                "Windows": 91,
                "RightClick": 93,
                "Num0": 96,
                "Num1": 97,
                "Num2": 98,
                "Num3": 99,
                "Num4": 100,
                "Num5": 101,
                "Num6": 102,
                "Num7": 103,
                "Num8": 104,
                "Num9": 105,
                "Num*": 106,
                "Num+": 107,
                "Num-": 109,
                "Num.": 110,
                "Num/": 111,
                "F1": 112,
                "F2": 113,
                "F3": 114,
                "F4": 115,
                "F5": 116,
                "F6": 117,
                "F7": 118,
                "F8": 119,
                "F9": 120,
                "F10": 121,
                "F11": 122,
                "F12": 123,
                "NumLock": 144,
                "ScrollLock": 145,
                "MyComputer": 182,
                "MyCalculator": 183,
                ";": 186,
                "=": 187,
                ",": 188,
                "-": 189,
                ".": 190,
                "/": 191,
                "`": 192,
                "[": 219,
                "\\": 220,
                "]": 221,
                "'": 222
            },

            // key names by character code
            chars: {
                8: "Backspace",
                9: "Tab",
                13: "Enter",
                16: "Shift",
                17: "Ctrl",
                18: "Alt",
                19: "PauseBreak",
                20: "CapsLock",
                27: "Esc",
                32: "Space",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "Left",
                38: "Up",
                39: "Right",
                40: "Down",
                45: "Insert",
                46: "Delete",
                48: "0",
                49: "1",
                50: "2",
                51: "3",
                52: "4",
                53: "5",
                54: "6",
                55: "7",
                56: "8",
                57: "9",
                65: "A",
                66: "B",
                67: "C",
                68: "D",
                69: "E",
                70: "F",
                71: "G",
                72: "H",
                73: "I",
                74: "J",
                75: "K",
                76: "L",
                77: "M",
                78: "N",
                79: "O",
                80: "P",
                81: "Q",
                82: "R",
                83: "S",
                84: "T",
                85: "U",
                86: "V",
                87: "W",
                88: "X",
                89: "Y",
                90: "Z",
                91: "Windows",
                93: "RightClick",
                96: "Num0",
                97: "Num1",
                98: "Num2",
                99: "Num3",
                100: "Num4",
                101: "Num5",
                102: "Num6",
                103: "Num7",
                104: "Num8",
                105: "Num9",
                106: "Num*",
                107: "Num+",
                109: "Num-",
                110: "Num.",
                111: "Num/",
                112: "F1",
                113: "F2",
                114: "F3",
                115: "F4",
                116: "F5",
                117: "F6",
                118: "F7",
                119: "F8",
                120: "F9",
                121: "F10",
                122: "F11",
                123: "F12",
                144: "NumLock",
                145: "ScrollLock",
                182: "MyComputer",
                183: "MyCalculator",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'"
            },

            // boolean returns if key is in the collection of currently-pressed keys
            keyDown: function (key) {
                return this.keysDown[this.chars[key]] === true;
            }
        }
    };

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
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
        init: function (canvas) {
            var mouse = ff.input.mouse,               // local reference to the mouse object
                keyboard = ff.input.keyboard,         // local reference to the keyboard object
                me = this;                            // self reference for events

            if (!ff.hasValue(canvas)) {
                throw "InputManager needs a valid canvas to listen for input.";
            }

            //============================================
            // TOUCH EVENTS
            //============================================
            // simulate mouse movement on touch
            $(canvas).on("touchmove", function (e) {
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
                camera = ff.game.camera;

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
            var m = ff.input.mouse,
                c = ff.game.camera;
            m.worldX = c.position.x + m.x;
            m.worldY = c.position.y + m.y;
        }
    });

    return ff;
}(frostFlake || {}, jQuery));
// == NEW FILE ==
/* ===============================================================================================

    IO.JS
    Provides methods for loading objects from JSON or converting them to JSON

================================================================================================*/

/*global console, Image, jQuery*/
var frostFlake = (function (ff, $) {

    "use strict";

    // loads json from a url
    ff.loadJson = function (url, successCallback, failCallback, alwaysCallback) {
        if (!successCallback) {
            successCallback = function (json) {
                console.log("Loaded json from: " + url + " (" + json + ")");
            };
        }

        if (!failCallback) {
            failCallback = function (jqxhr, textStatus, error) {
                console.log("Failed to load JSON: " + textStatus + ", " + error);
            };
        }
        $.getJSON(url).done(successCallback).fail(failCallback).always(alwaysCallback);
    };

    // converts an object to a JSON string. Stubbed to use fallback library.
    ff.toJson = JSON.stringify;

    // parses a json string. Stubbed to eventually use fallback library.
    ff.fromJson = JSON.parse;

    // loads an image from a URL
    ff.loadImage = function (url, loadedCallback) {
        var path = url,
            img;

        img = new Image();
        img.loadEvents = [];
        if (loadedCallback) {
            img.loadEvents.push(loadedCallback);
        }

        // execute callbacks on load
        img.onload = function () {
            var i;
            for (i = 0; i < img.loadEvents.length; i += 1) {
                img.loadEvents[i]();
            }
        };
        img.src = path;
        return img;
    };

    return ff;
}(frostFlake || {}, jQuery));
// == NEW FILE ==
/* ===============================================================================================

    RENDERER.JS
    The renderer is capable of taking a list of sprites, potentially with nested children,
    and rendering them to a provided context using a camera projection.

    The renderer is stateless, requiring a list of sprites, a camera and a context on every
    draw call. This enables a single renderer to draw to multiple contexts with multiple
    cameras.

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {
    
    "use strict";

    ff.Renderer = Class.extend({
        // no constructor, renderer is stateless

        // draws a list of sprites to a context using the provided camera's projection
        // passing arguments allows renderer to be used for multiple different cameras and surfaces
        draw: function (spriteList, camera, canvas, backgroundColor) {
            var context = canvas.getContext("2d"),                                                       // canvas to draw to
                cameraTranslationX = ff.math.invert(camera.position.x) + (context.canvas.width / 2),    // camera projection offset
                cameraTranslationY = camera.position.y + (context.canvas.height / 2),                   // camera projection offset
                fillColor = ff.defaultIfNoValue(backgroundColor, "rgba(0, 0, 0, 0)"),                    // background or transparent
                i;                                                                                      // iterator, JSLint prefers here

            // fill canvas
            context.fillStyle = fillColor;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // perform camera projection translation
            context.save();
            context.translate(cameraTranslationX, cameraTranslationY);

            // draw sprites, recurses on children
            for (i = 0; i < spriteList.length; i += 1) {
                this.drawSprite(spriteList[i], context);
            }

            // restore context
            context.restore();
        },

        // draws sprite and all children recursively
        drawSprite: function (sprite, context) {
            var spriteTranslationX = sprite.position.x,
                spriteTranslationY = ff.math.invert(sprite.position.y),
                spriteRotation = sprite.rotation,
                spriteAlpha = sprite.alpha,
                srcWidth = 0,
                srcHeight = 0,
                i;

            if(ff.hasValue(sprite.textureCoordinates)) {
                srcWidth = sprite.textureCoordinates.right - sprite.textureCoordinates.left;
                srcHeight = sprite.textureCoordinates.bottom - sprite.textureCoordinates.top;
            }

            // apply transformation
            context.save();
            context.translate(spriteTranslationX, spriteTranslationY);

            // apply rotation, note that rotation is 0 at right
            context.rotate(-spriteRotation);

            // set alpha
            context.globalAlpha = spriteAlpha;

            // draw sprite if texture is valid
            if (ff.hasValue(sprite.texture) && srcWidth > 0 && srcHeight > 0) {
                context.drawImage(
                    sprite.texture,
                    sprite.textureCoordinates.left,
                    sprite.textureCoordinates.top,
                    srcWidth,
                    srcHeight,
                    sprite.width / -2,
                    sprite.height / -2,
                    sprite.width,
                    sprite.height
                );
            }

            // TODO: draw sprite radius if sprite.showRadius

            // reset alpha
            context.globalAlpha = 1;

            // recurse through children
            if (ff.hasValue(sprite.children)) {
                for (i = 0; i < sprite.children.length; i += 1) {
                    this.drawSprite(sprite.children[i], context);
                }
            }

            // restore context
            context.restore();
        }
    });
    return ff;
}(frostFlake || {}));
// == NEW FILE ==
/* ===============================================================================================

    SPRITE.JS
    A Drawable referencing texture data. Can specify texture coordinates to only draw 
    a portion of a texture or an animation that continually updates texture coordinates.

    Images can be lazy-loaded from a URL provided when instantiated or loaded later via
    the "loadImage" method.

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {

    "use strict";

    ff.Sprite = Class.extend({

        // constructor: set properties and load image
        init: function (imageUrl, loadedCallback) {
            this.active = true;                 // whether update and draw should apply to this object
            this.children = [];                 // child sprites
            this.alpha = 1;                     // sprite alpha as a 0-1 float
            this.drawScale = {x: 1, y: 1};      // the x and y drawing scale as a percentage
            this.parent = null;                 // sprite parent
            this.width = 0;                     // sprite width
            this.height = 0;                    // sprite total height
            this.position = {x: 0, y: 0};       // sprite position, relative to parent if parented
            this.velocity = {x: 0, y: 0};       // sprite velocity, applied each update
            this.acceleration = {x: 0, y: 0};   // sprite acceleration, applied to velocity and position each frame
            this.friction = 0;                  // the amout of friction applied to acceleration and velocity
            this.rotation = 0;                  // sprite rotation in radians, relative to parent if parented
            this.rotationVelocity = 0;          // sprite rotation velocity, applied each update
            this.collisionRadius = 0;           // sprite collideable radius
            this.showRadius = false;            // whether or not to draw the sprite's collision radius
            this.textureUrl = "";               // url of the texture to load and display
            this.texture = null;                // the actual image data used by this sprite
            this.animation = null;              // the animation governing this sprite
            this.textureCoordinates = null;     // object representing the texture dimensions once loaded

            this.parallaxCamera = null;         // the camera to use for parallax
            this.parallaxPercent = 0;           // the amount of camera velocity to apply

            // load the texture if URL was provided
            // Sprites with null textures will be updated but not drawn
            if (ff.hasValue(imageUrl)) {
                this.textureUrl = imageUrl;
                this.loadImage(imageUrl, loadedCallback);
            }
        },

        // updates the position, rotation and children
        update: function (deltaTime) {
            if (!ff.hasValue(deltaTime)) {
                throw "Bad delta provided to update cycle!";
            }

            // inactive Sprites are not updated or drawn
            if (this.active === true) {
                var deltaSquaredDividedByTwo = deltaTime * deltaTime / 2,   // calc once for performance
                    i;                                                      // JSLint likes this here.

                // update values based on time elapsed
                this.position.x += (this.velocity.x * deltaTime) + (this.acceleration.x * deltaSquaredDividedByTwo);
                this.position.y += (this.velocity.y * deltaTime) + (this.acceleration.y * deltaSquaredDividedByTwo);
                this.velocity.x += (this.acceleration.x * deltaTime) - (this.friction * this.velocity.x * deltaTime);
                this.velocity.y += (this.acceleration.y * deltaTime) - (this.friction * this.velocity.y * deltaTime);
                this.rotation += this.rotationVelocity * deltaTime;

                if(ff.hasValue(this.parallaxCamera)) {
                    this.position.x += (this.parallaxCamera.velocity.x * this.parallaxPercent * deltaTime);
                    this.position.y += (this.parallaxCamera.velocity.y * this.parallaxPercent * deltaTime);
                }

                // update children
                for (i = 0; i < this.children.length; i += 1) {
                    this.children[i].update(deltaTime);
                }

                // clamp values
                this.clamp();

                // calculate animation
                if (ff.hasValue(this.animation) && this.animation instanceof ff.Animation) {
                    this.animation.update(deltaTime);
                    this.textureCoordinates = this.animation.getTextureCoordinates();
                }
            }
        },

        // adds a child sprite to this object
        addChild: function (sprite) {
            sprite.parent = this;
            this.children.push(sprite);
        },

        // removes a child sprite from this object
        removeChild: function (sprite) {
            var index = this.sprites.indexOf(sprite);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
            sprite.parent = null;
            return sprite;
        },

        // attaches this to another sprite as a child
        attachTo: function (parent) {
            parent.addChild(this);
        },

        // returns the absolute position of this object, taking parent positions and rotations into account
        getAbsoluteProperties: function () {
            var parentAbsolute, absoluteProperties, offsetX, offsetY;

            // if we have a parent, recurse upwards to combine properties
            if (ff.hasValue(this.parent)) {
                parentAbsolute = this.parent.getAbsoluteProperties();

                // calculate parent rotation's effect on position
                offsetX = Math.cos(parentAbsolute.rotation) * this.position.x;
                offsetY = Math.sin(parentAbsolute.rotation) * this.position.y;

                // create our absolute properties from parent and new calculations
                absoluteProperties = {
                    position: {
                        // add parent position, local position and rotation offset
                        x: offsetX + parentAbsolute.position.x,
                        y: offsetY + parentAbsolute.position.y
                    },
                    // combine rotations
                    rotation: this.rotation + parentAbsolute.rotation
                };
            }

            // if no parent, our properties are already absolute
            else {
                absoluteProperties = {
                    position: this.position,
                    rotation: this.rotation
                };
            }

            return absoluteProperties;
        },

        applyParallax: function(camera, percent) {
            this.parallaxCamera = camera;
            this.parallaxPercent = percent;
        },

        clearParallax: function() {
            this.parallaxCamera = null;
            this.parallaxPercent = 0;
        },

        // clamps values to valid ranges
        clamp: function () {
            this.alpha = Math.max(this.alpha, 0);
            this.alpha = Math.min(this.alpha, 1);
            if (this.rotation >= ff.math.twoPi) {
                this.rotation -= ff.math.twoPi;
            }
            if (this.rotation < 0) {
                this.rotation += ff.math.twoPi;
            }
        },

        // checks if this sprite's collision radius overlaps the provided sprite
        isRadiusColliding: function (sprite) {
            var overlapDistance,        // the combined radii 
                distanceBetween;        // the absolute distance between Sprites

            if (!(sprite instanceof ff.Sprite)) {
                throw "Cannot check radius collision against a non-Sprite object.";
            }

            overlapDistance = (this.radius) + (sprite.radius);
            distanceBetween = ff.math.absoluteDistanceBetween(this.position, sprite.position);
            return (overlapDistance < distanceBetween);
        },

        // recalculate the height/width based on texture coordinates, then recalculate radius
        updateDimensions: function () {
            // if we have an animation, get texture coordinates from the animation
            if (ff.hasValue(this.animation)) {
                this.textureCoordinates = this.animation.getTextureCoordinates();

            // otherwise set based on texture size
            } else {
                // if the coordinates haven't been set, use the texture size
                if(!ff.hasValue(this.textureCoordinates)) {
                    var texDimensions = {
                        width : 0,
                        height: 0
                    };
                    if (ff.hasValue(this.texture)) {
                        texDimensions.width = this.texture.width;
                        texDimensions.height = this.texture.height;
                    }
                    // manually set texture coordinates
                    // NOTE: do not call setTextureCoordinates here: infinite loop!
                    this.textureCoordinates = {top: 0, right: texDimensions.width, bottom: texDimensions.height, left: 0};
                }
        }

            // calculate width/height with drawscale
            this.width = (this.textureCoordinates.right - this.textureCoordinates.left) * this.drawScale.x;
            this.height = (this.textureCoordinates.bottom - this.textureCoordinates.top) * this.drawScale.y;

            // update the radius to match the new dimensions
            this.updateRadius();
        },

        // calculates and sets the radius. This should be called whenever dimensions change
        updateRadius: function () {
            if (this.width === 0 && this.height === 0) {
                this.radius = 0;
            } else {
                this.radius = ff.math.absoluteDistanceBetween({x: 0, y: 0}, {x: this.width * 0.5, y: this.height * 0.5});
            }
        },

        // set new texture coordinates, called automatically by animation sequence
        setTextureCoordinates: function (left, right, top, bottom) {
            this.textureCoordinates = {top: top, right: right, bottom: bottom, left: left};
            this.updateDimensions();
        },

        // resets texture coordinates to null
        clearTextureCoordinates: function () {
            this.textureCoordinates = null;
        },

        // sets the position
        setPosition: function (x, y) {
            this.position.x = x;
            this.position.y = y;
        },

        // sets the drawscale, ensuring it's not < 0 and then updates dimensions
        setDrawScale: function (xScale, yScale) {
            xScale = Math.max(xScale, 0);
            yScale = Math.max(yScale, 0);
            this.drawScale = {
                x: xScale,
                y: yScale
            };
            this.updateDimensions();
        },

        // loads and sets animation json from provided URL, calls loadedCallback on success
        loadAnimation: function (url, loadedCallback) {
            var me = this,
            animation = ff.Animation.getInstanceFromUrl(url, function() {
                me.setAnimation(animation, loadedCallback);
            });
        },

        // sets the animation and loads the animation's spritesheet URL
        setAnimation: function (anim, loadedCallback) {
            var me = this;
            this.loadImage(anim.spriteSheetUrl(), function () {
                me.animation = anim;
                me.updateDimensions();
                if(ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
            });
        },

        // loads an image texture from the provided URL, calls loadedCallback when complete
        loadImage: function (url, loadedCallback) {
            var me = this;
            this.textureUrl = url;
            this.texture = ff.loadImage(this.textureUrl, function () {
                if (ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
                me.updateDimensions();
            });
        },

        // TODO: implement this
        toJson: function () {
            throw "Not implemented";
        },

        // TODO: implement this
        fromJson: function () {
            throw "Not implemented";
        }
    });

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
/* ===============================================================================================

    UTIL.JS
    Provides utility methods to make common game tasks easier, including a math
    utility that performs a lot of common calculations

================================================================================================*/

var frostFlake = (function (ff) {

    "use strict";

    // Checks if provided variable is not undefined or null
    ff.hasValue = function(variable) {
        if(variable !== undefined && variable !== null && variable !== "") {
            return true;
        }

        return false;
    };

    // Returns a default values if provided variable has no value
    ff.defaultIfNoValue = function(variable, defaultValue) {
        if(ff.hasValue(variable)) {
            return variable;
        }
        return defaultValue;
    };

    // Gets a randomized hex color as a string
    ff.randomHexColor = function() {
        return "#" + ff.math.randomIntInRange(0, 16777215).toString(16);
    };

    // Provides a collection of common values and utilities for math operations in games
    ff.math = {
        e:Math.E,
        log10E: 0.4342945,
        log2E: 1.442695,
        pi: Math.PI,
        piOver2: (Math.PI * 0.5),
        piOver4: (Math.PI * 0.25),
        twoPi: (Math.PI * 2.0),

        // returns the opposite of value
        invert: function (value) {
            return 0 - value;
        },

        // clamps a value to the min or max possible value
        clamp: function (value, min, max) {
            if (value < min) {
                return min;
            }
            else if (value > max) {
                return max;
            }
            else {
                return value;
            }
        },

        // linear interpolation between two values
        lerp: function(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        },

        // returns the square of the provided value
        square: function(value) {
            return Math.pow(value, 2);
        },

        // returns a random number within the provided range
        randomInRange:function(min, max) {
            var range = max - min;
            var rand = Math.random() * range;
            var returnValue =  min + rand;
            return returnValue;
        },

        // returns a random integer between min and max, exclusive of max
        randomIntInRange:function(min,max) {
            return Math.floor(this.randomInRange(min,max));
        },

        // finds the distance between two points
        distanceBetween:function(pt1, pt2) {
            var dX = pt1.x - pt2.x;
            var dY = pt1.y - pt2.y;
            var dist = this.hypotenuseLength(dX, dY);
            return dist;
        },

        // gets hypoteneus length
        hypotenuseLength: function (a, b) {
            return Math.sqrt(this.square(a) + this.square(b));
        },

        // finds the absolute distance between two points
        absoluteDistanceBetween:function(pt1, pt2) {
            return Math.abs(this.distanceBetween(pt1, pt2));
        },

        // returns a velocity {x,y} given an angle and a speed
        velocityFromAngle:function(angle, speed) {
            var velocity = {x: 0, y: 0};
            angle = this.regulateAngle(angle);
            if (ff.hasValue(angle) && !isNaN(angle)) {
                velocity = {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                };
            }
            return velocity;
        },

        // returns the angle between two points
        angleBetweenPoints:function(pt1, pt2) {
            var dX = pt2.x - pt1.x,
                dY = pt2.y - pt1.y,
                angle = this.regulateAngle(Math.atan2(dY, dX));
            return isNaN(angle) ? 0 : angle;
        },

        // converts radians to degrees
        toDegrees: function(radians) {
            radians = this.regulateAngle();
            return (radians * 57.295779513082320876798154814105);
        },

        // converts degrees to radians
        toRadians: function(degrees) {
            return this.regulateAngle((degrees * 0.017453292519943295769236907684886));
        },

        // converts an angle to a value between 0 and Math.PI * 2
        regulateAngle: function(angle) {
            while(angle > this.twoPi) {
                angle -= this.twoPi;
            }

            while(angle < 0) {
                angle += this.twoPi;
            }

            return angle;
        }
    };

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
/* ===============================================================================================

    VIEW.JS
    Views manage the current collection of objects in use in a game.
    Views should be overridden to contain the objects, saving and loading that a game requires

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {
    
    "use strict";

    ff.View = Class.extend({
        // constructor
        init: function () {
            this.sprites = [];
        },

        // updates all Sprites (Sprites automatically update their children)
        update: function (deltaTime) {
            var i;
            for (i = 0; i < this.sprites.length; i += 1) {
                this.sprites[i].update(deltaTime);
            }
        },

        // adds a sprite to the draw/update queue
        addSprite: function (sprite) {
            var placeToAdd = this.sprites.length - 1,
                i;
            for (i = 0; i < this.sprites.length; i += 1) {
                if (sprite.layer < this.sprites[i].layer) {
                    placeToAdd = i;
                    break;
                }
            }
            this.sprites.splice(placeToAdd, 0, sprite);
        },

        // adds array of sprites to the draw/update queue
        addSpriteArray: function (spriteArray) {
            var i;
            for (i = 0; i < spriteArray.length; i += 1) {
                this.addSprite(spriteArray[i]);
            }
        },

        // removes a sprite from the draw/update queue
        removeSprite: function (sprite) {
            var index = this.sprites.indexOf(sprite);
            if (index >= 0) {
                this.sprites.splice(index, 1);
            }
        },

        // removes array of sprites from the draw/update queue
        removeSpriteArray: function (spriteArray) {
            var i;
            for (i = 0; i < spriteArray.length; i += 1) {
                this.removeSprite(spriteArray[i]);
            }
        },

        // removes all sprites from render queue
        clearSprites: function () {
            this.sprites = [];
        }
    });

    return ff;
}(frostFlake || {}));
// == NEW FILE ==
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

            // provide a reference to the game object that can be accessed anywhere
            me.game = me;

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
            me.inputManager = new ff.InputManager(canvas);

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
                me.game.update();
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
            this.inputManager.update(this.time.delta);
            this.camera.update(this.time.delta);
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
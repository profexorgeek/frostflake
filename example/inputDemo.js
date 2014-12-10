/* global frostFlake */
var inputDemo = (function (ff) {
    "use strict";

    // create container for demo game
    var demo = {};

    demo.GameCursor = ff.Sprite.extend({
        // custom constructor loads sprite
        init: function () {
            this._super("/example/frostFlake.png");
        },

        // override the update function to call our custom method
        update: function (deltaTime) {
            this._super(deltaTime);
            this.trackMouse();
            this.handleInput();
        },

        // custom method to track mouse
        trackMouse: function () {
            this.position.x = ff.input.mouse.worldX;
            this.position.y = ff.input.mouse.worldY;
        },

        handleInput: function () {
            if(ff.input.keyboard.keyDown(ff.input.keyboard.keys.R)) {
                this.rotationVelocity = 1.5;
            }
            else {
                this.rotationVelocity = 0;
            }

            if(ff.input.mouse.buttonDown(ff.input.mouse.buttons.Left)) {
                this.alpha = 0.5;
            }
            else {
                this.alpha = 1;
            }
        }
    });

    // custom view instantiates a cursor object
    demo.CustomView = ff.View.extend({
        // custom constructor to create cursor
        init: function () {
            var cursor;
            this._super();

            // create and add cursor instance to sprite collection
            cursor = new demo.GameCursor();
            this.addSprite(cursor);
        }
    });

    // custom game instance sets currentView
    demo.Game = ff.Game.extend({
        init: function(canvas) {
            this._super(canvas, 60, "rgba(150, 150, 150, 1)");
            this.currentView = new demo.CustomView();
        }
    });

    return demo;
    
}(frostFlake));
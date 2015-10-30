/* global frostFlake */
var cameraDemo = (function (ff) {
    "use strict";

    // create container for demo game
    var demo = {};

    // reference to the game instance
    demo.instance = null;

    // custom entity that has randomized properties and wraps at screen edge
    demo.Flake = ff.Sprite.extend({
        init: function () {
            var me;

            me = this;

            // call parent and load texture
            // set custom values in success callback
            this._super("/example/textures/frostFlake.png", function () {
                var scale, pos;

                scale = ff.math.randomInRange(0.25, 1);

                // set custom size
                me.setDrawScale(scale);

                // set random rotation
                me.rotation = ff.math.randomInRange(0, ff.math.pi);

                // set random position
                pos = demo.instance.camera.getRandomPointInView();
                me.position.x = pos.x;
                me.position.y = pos.y;

                // make smaller items have a higher parallax value
                // they move slower and are smaller giving an illusion of depth
                // parallax method needs to know the camera and the percentage
                me.applyParallax(demo.instance.camera, 1 - scale);
            });
        },

        // override the update method to call our custom method
        update: function (deltaTime) {
            this._super(deltaTime);

            // call our custom wrapping method
            this.wrapAtScreenEdge();
        },

        // wrap the sprite if it goes offscreen
        wrapAtScreenEdge: function () {
            var cam = demo.instance.camera,
                wrapPadding = 16;

            // wrap the x axis
            if(this.position.x > cam.viewPort.right + wrapPadding) {
                this.position.x = cam.viewPort.left - wrapPadding;
            }
            if(this.position.x < cam.viewPort.left - wrapPadding) {
                this.position.x = cam.viewPort.right + wrapPadding;
            }

            // wrap the y axis
            if(this.position.y > cam.viewPort.top + wrapPadding) {
                this.position.y = cam.viewPort.bottom - wrapPadding;
            }
            if(this.position.y < cam.viewPort.bottom - wrapPadding) {
                this.position.y = cam.viewPort.top + wrapPadding;
            }
        }
    });

    demo.CustomView = ff.View.extend({
        init: function () {
            var i, flake;
            this._super();

            // create 50 flake sprites
            for(i = 0; i < 50; i++) {
                flake = new demo.Flake();
                this.addSprite(flake);
            }
        },

        // custom update to call our input method
        update: function (deltaTime) {
            this._super(deltaTime);
            this.handleInput();
        },

        // listen for input and move the camera
        handleInput: function () {
            var input = demo.instance.input,
                cam = demo.instance.camera,
                moveSpeed = 100;

            // handle left/right
            if(input.keyboard.keyDown(ff.keyboard.keys.A)) {
                cam.velocity.x = -moveSpeed;
            }
            else if(input.keyboard.keyDown(ff.keyboard.keys.D)) {
                cam.velocity.x = moveSpeed;
            }
            else {
                cam.velocity.x = 0;
            }

            // handle up/down
            if(input.keyboard.keyDown(ff.keyboard.keys.W)) {
                cam.velocity.y = moveSpeed;
            }
            else if(input.keyboard.keyDown(ff.keyboard.keys.S)) {
                cam.velocity.y = -moveSpeed;
            }
            else {
                cam.velocity.y = 0;
            }

        }

    });


    // custom game instance sets currentView
    demo.Game = ff.Game.extend({
        init: function(canvas) {
            this._super(canvas, 60, "rgba(225, 235, 255, 1)");
            demo.instance = this;
            this.currentView = new demo.CustomView();
        }
    });

    return demo;
    
}(frostFlake));
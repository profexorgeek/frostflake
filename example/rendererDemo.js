/* global frostFlake */
var rendererDemo = (function (ff, $) {
	"use strict";

    // create container for demo game
    var demo = {};

    // reference to the game instance
    demo.instance = null;

    // basic custom entity with texture and rotation
    demo.Flake = ff.Sprite.extend({
        // custom construct specifies texture URL
        init: function (callback) {
            // call base constructor with sprite URL and a custom load callback
            this._super("/example/frostFlake.png", callback);
        }
    });

    // custom view to create big list of sprites and render to a custom target
    demo.CustomView = ff.View.extend({
    	init: function () {
    		this._super();
    		this.gridSize = 10;										// the size of sprite grid to render
    		this.spriteSize = 32;										// the size of each sprite
    		this.spritesLoaded = 0;										// the number of sprites that have finished loading
    		this.flakeContainer = [];									// a container to hold our sprites while they load
    		this.renderComplete = false;								// flag to check if the render has been done
    		this.textureSize = (this.gridSize) * this.spriteSize;		// the size our canvas needs to be
    		
    		// create a canvas large enough to hold our custom texture
    		this.renderTarget = $("<canvas width='" + this.textureSize + "' height='" + this.textureSize + "'></canvas>")[0];

    		this.loadSprites();
    	},

    	// custom update to call our input method
        update: function (deltaTime) {
            this._super(deltaTime);
            this.handleInput();

            if(this.renderComplete === false) {
            	this.checkSpritesLoaded();
        	}
        },

        checkSpritesLoaded: function() {
        	// check if all sprites are loaded
        	if(this.spritesLoaded === ff.math.square(this.gridSize)) {
        		// 
        		demo.instance.renderer.draw(
        			this.flakeContainer,			// our custom sprite list
        			demo.instance.camera,			// the camera to use
        			this.renderTarget,				// the canvas to use
        			"rgb(255, 255, 255)"			// the background color to use
        			);

        		// create a single sprite with the render target texture
        		var sprite = new ff.Sprite(this.renderTarget.toDataURL());

        		// add our single sprite to the view's collection
        		this.addSprite(sprite);

        		// dispose of our array of sprites
        		// TODO: these should probably be unloaded
        		this.flakeContainer = null;

        		// notify the view that the render has completed
        		this.renderComplete = true;
        	}
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
        },

        // create a grid of sprites
    	loadSprites: function () {
    		var f, x, y, me = this, startPosX, startPosY;

			// callback to notify view that a sprite has finished loading
			function callback() {
				me.spritesLoaded++;
			}

			// set offsets to start rendering sprites so grid will be centered
			startPosX = (this.gridSize * this.spriteSize) / -2 + (this.spriteSize / 2);
			startPosY = startPosX;

    		// create the grid of sprites
    		for(x = 0; x < this.gridSize; x++) {
    			for(y = 0; y < this.gridSize; y++) {
    				f = new demo.Flake(callback);
    				f.position.x = startPosX + this.spriteSize * x;
    				f.position.y = startPosY + this.spriteSize * y;
    				f.rotation = ff.math.randomInRange(0, 1.5);
    				this.flakeContainer.push(f);
    			}
    		}
    	}
    });

    demo.Game = ff.Game.extend({
    	init: function (canvas) {
    		this._super(canvas, 60, "rgba(150, 150, 150, 1)");
    		demo.instance = this;
    		this.currentView = new demo.CustomView();
    	}
    });


	return demo;
    
}(frostFlake, jQuery));
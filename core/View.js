/* ===============================================================================================

    VIEW.JS
    Views manage the current collection of objects in use in a game.
    Views should be overridden to contain the objects, saving and loading that a game requires

================================================================================================*/

var frostFlake = (function (ff) {
	"use strict";

    ff.View = Class.extend({
        
        init:function() {
            this.sprites = [];
        },

        // adds a sprite to render queue
	    addsprite = function (sprite) {
	        var placeToAdd = ff.sprites.length - 1,
	        i;
	        for(i = 0; i < ff.sprites.length; i++) {
	            if(sprite.layer < ff.sprites[i].layer) {
	                placeToAdd = i;
	                break;
	            }
	        }
	        ff.sprites.splice(placeToAdd, 0, sprite);
	    },
	    
	    // adds collection of sprites to render queue
	    addSpriteArray = function (spriteArray) {
	    	var i;
	        for (i = 0; i < spriteArray.length; i++) {
	            ff.addSprite(spriteArray[i]);
	        }
	    },

	    // removes a sprite from render queue
	    removeSprite = function (sprite) {
	        var index = ff.sprites.indexOf(sprite);
	        if (index >= 0) {
	            ff.sprites.splice(sprite, 1);
	        }
	    },

	    // removes collection of sprites from render queue
	    removeSpriteArray = function (spriteArray) {
	    	var i;
	        for (i = 0; i < spriteArray.length; i++) {
	            ff.removeSprite(spriteArray[i]);
	        }
	    },

	    // removes all sprites from render queue
	    clearSprites = function () {
	        ff.sprites = [];
	    }
    });

    return ff;
}(frostFlake || {}));
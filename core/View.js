/* ===============================================================================================

    VIEW.JS
    Views manage the current collection of objects in use in a game.
    Views should be overridden to contain the objects, saving and loading that a game requires

================================================================================================*/

/* global window */
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
                this.sprites.splice(sprite, 1);
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
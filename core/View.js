/* ===============================================================================================

    VIEW.JS
    Views manage the current collection of objects in use in a game.
    Views should be overridden to contain the objects, saving and loading that a game requires

================================================================================================*/

/* global window */
var frostFlake = (function (ff) {
    "use strict";

    ff.View = ff.Class.extend({
        // constructor
        init: function () {
            this.sprites = [];
        },

        // updates all Sprites (Sprites automatically update their children)
        update: function () {
            var i;
            for (i = 0; i < ff.sprites.length; i += 1) {
                ff.sprites[i].update(ff.time.delta);
            }
        },

        // adds a sprite to the draw/update queue
        addsprite: function (sprite) {
            var placeToAdd = ff.sprites.length - 1,
                i;
            for (i = 0; i < ff.sprites.length; i += 1) {
                if (sprite.layer < ff.sprites[i].layer) {
                    placeToAdd = i;
                    break;
                }
            }
            ff.sprites.splice(placeToAdd, 0, sprite);
        },

        // adds array of sprites to the draw/update queue
        addSpriteArray: function (spriteArray) {
            var i;
            for (i = 0; i < spriteArray.length; i += 1) {
                ff.addSprite(spriteArray[i]);
            }
        },

        // removes a sprite from the draw/update queue
        removeSprite: function (sprite) {
            var index = ff.sprites.indexOf(sprite);
            if (index >= 0) {
                ff.sprites.splice(sprite, 1);
            }
        },

        // removes array of sprites from the draw/update queue
        removeSpriteArray: function (spriteArray) {
            var i;
            for (i = 0; i < spriteArray.length; i += 1) {
                ff.removeSprite(spriteArray[i]);
            }
        },

        // removes all sprites from render queue
        clearSprites: function () {
            ff.sprites = [];
        }
    });

    return ff;
}(frostFlake || {}));
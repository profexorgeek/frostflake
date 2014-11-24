/* ===============================================================================================

    CURSOR.JS
    Example game object extends Sprite and uses the frostFlake.input object to
    track the mouse.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    "use strict";

    // create the entities namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    // add Cursor class to the entities namespace
    g.entities.Cursor = ff.Sprite.extend({
        // constructor: implement sprite with custom image and texture coordinates
        init: function () {
            var tex = g.textures.cursorMove;
            this._super("/example/textures/spaceSpriteSheet.png");
            this.setTextureCoordinates(tex.left, tex.right, tex.top, tex.bottom);
        },

        // custom update, follow mouse
        update: function (deltaTime) {
            this._super(deltaTime);
            this.position.x = ff.input.mouse.worldX;
            this.position.y = ff.input.mouse.worldY;
        }
    });

    return g;
}(game || {}, frostFlake));
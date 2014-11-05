/* global frostFlake */
var game = (function (g, ff) {
    "use strict";

    // create the views namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    g.entities.Cursor = ff.Sprite.extend({
        init: function () {
            this._super("/example/textures/spaceSpriteSheet.png");
            this.setTextureCoordinates(64, 96, 32, 64);
            this.alpha = 0.5;
        },

        update: function (deltaTime) {
            this._super(deltaTime);
            this.position.x = ff.input.mouse.worldX;
            this.position.y = ff.input.mouse.worldY;

            //console.log("x: " + ff.input.mouse.worldX + ", y: " + ff.input.mouse.worldY);
        }
    });

    return g;
}(game || {}, frostFlake));
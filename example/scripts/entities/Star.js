/* ===============================================================================================

    STAR.JS
    Example game object extends Sprite and implements custom coordinates, utility
    and camera methods.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    
    "use strict";

    // create the entities namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    // add Star class to entities namespace
    g.entities.Star = ff.Sprite.extend({
        init: function () {
            // pixels to wait outside of bounds before wrapping star
            this.wrapPadding = 10;

            // call the parent, pass a callback to set the texture coordinates
            this._super("/example/textures/spaceSpriteSheet.png");

            // randomize our appearance
            this.randomize();
        },

        // randomizes the location and appearance of this star, called on start or when starfield changes
        randomize: function () {
            var scale = ff.math.randomInRange(0.2, 1),                                  // size to use for this star
                textureVariants = [                                                     // texture coordinates for star variants
                    {top: 32, bottom: 48, left: 0, right: 16},
                    {top: 48, bottom: 64, left: 0, right: 16},
                    {top: 32, bottom: 48, left: 16, right: 32},
                    {top: 48, bottom: 64, left: 16, right: 32}
                ],
                coordIndex = ff.math.randomIntInRange(0, textureVariants.length);      // randomly selected texture set

            // set random texture
            this.setTextureCoordinates(
                textureVariants[coordIndex].left,
                textureVariants[coordIndex].right,
                textureVariants[coordIndex].top,
                textureVariants[coordIndex].bottom
            );

            // randomize position on screen
            this.position = ff.game.camera.getRandomPointInView();

            // randomize brightness
            this.alpha = ff.math.randomInRange(0.2, 1.0);

            // apply parallax effect
            this.applyParallax(ff.game.camera, ff.math.randomInRange(0, 0.5));

            // randomize size
            this.setDrawScale(scale, scale);
        },

        // custom update function to wrap star if offscreen
        update: function (deltaTime) {
            this._super(deltaTime);

            // wrap if off right
            if(this.position.x > ff.game.camera.viewPort.right + this.wrapPadding) {
                this.position.x = ff.game.camera.viewPort.left - this.wrapPadding;
                this.position.y = ff.game.camera.getRandomYInView();
            }

            // wrap if off left
            else if (this.position.x < ff.game.camera.viewPort.left - this.wrapPadding) {
                this.position.x = ff.game.camera.viewPort.right + this.wrapPadding;
                this.position.y = ff.game.camera.getRandomYInView();
            }

            // wrap if off top
            if(this.position.y > ff.game.camera.viewPort.top + this.wrapPadding) {
                this.position.y = ff.game.camera.viewPort.bottom - this.wrapPadding;
                this.position.x = ff.game.camera.getRandomXInView();
            }

            // wrap if off bottom
            else if (this.position.y < ff.game.camera.viewPort.bottom - this.wrapPadding) {
                this.position.y = ff.game.camera.viewPort.top + this.wrapPadding;
                this.position.x = ff.game.camera.getRandomXInView();
            }
        }
    });

    return g;
}(game || {}, frostFlake));
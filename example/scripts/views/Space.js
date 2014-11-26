/* ===============================================================================================

    SPACE.JS
    Example game level extends View. Creates a starfield, player object and
    manages player input.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {

    "use strict";

    // create the views namespace if it doesn't exist
    if(!ff.hasValue(g.views)) {
        g.views = {};
    }
    
    // define new Space class in view namespace
    g.views.Space = ff.View.extend({

        // constructor, set up starfield, cursor and player objects
        init: function () {
            var i, star;
            this._super();
            
            // keep unique reference to star objects
            this.stars = [];

            // create starfield
            for(i = 0; i < 50; i++) {
                star = new g.entities.Star();
                this.stars.push(star);
                this.addSprite(star);
            }

            for(i = 0; i < 25; i++) {
                this.createAsteroid();
            }

            // create a space station
            this.createStation(-2000, 0);
            this.createStation(2000, 0);
            this.createStation(0, 2000);
            this.createStation(0, -2000);
            this.createStation(200, 200);

            // create ship instance for the player
            this.player = new g.entities.Ship();
            this.addSprite(this.player);

            // attach the camera to the player ship
            ff.game.camera.attachTo(this.player);

            // create mouse cursor
            this.cursor = new g.entities.Cursor();
            this.addSprite(this.cursor);

        },

        // override update to implement input handling
        update: function (deltaTime) {
            this._super(deltaTime);
            this.doPlayerInput();
        },

        createStation: function(x, y) {
            var station = new g.entities.Station();
            this.addSprite(station);
            station.position.x = x;
            station.position.y = y;
            station.rotation = ff.math.randomInRange(0, ff.math.twoPi);
        },

        createAsteroid: function() {
            var version, asteroid, coords, textureName;
            version = ff.math.randomIntInRange(1, 3);
            textureName = "asteroid0" + version;
            coords = g.textures[textureName];
            asteroid = new ff.Sprite(g.spriteSheetPath, function () {
                asteroid.setTextureCoordinates(coords.left, coords.right, coords.top, coords.bottom);
            });
            asteroid.rotation = ff.math.randomInRange(0, ff.math.twoPi);
            asteroid.position.x = ff.math.randomInRange(-2000, 2000);
            asteroid.position.y = ff.math.randomInRange(-2000, 2000);
            asteroid.rotationVelocity = ff.math.randomInRange(0, ff.math.piOver2);
            this.addSprite(asteroid);
        },

        // listen for player input and update ship instance
        doPlayerInput: function () {
            // shortcut reference to mouse object
            var m = ff.input.mouse;

            // use utility method to set rotation to mouse
            this.player.rotation = ff.math.angleBetweenPoints(
                    this.player.position,
                    {x: m.worldX, y: m.worldY}
                );

            // if mouse is pressed, turn on thrust
            if (m.buttonDown(m.buttons.Left)) {
                this.player.isThrusting = true;
            
            // if mouse is released, stop thrusting
            }
            else {
                this.player.isThrusting = false;
            }
        },

        // randomizes the starfield, called if canvas size changes
        randomizeStarfield: function () {
            var i;
            for(i = 0; i < this.stars.length; i++) {
                this.stars[i].randomize();
            }
        }
    });

    return g;
}(game || {}, frostFlake));
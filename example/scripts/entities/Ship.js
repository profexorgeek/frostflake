/* ===============================================================================================

    SHIP.JS
    Example game object extends Sprite and implements a custom animation.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    "use strict";

    // create the entities namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    // add Ship class to entities namespace
    g.entities.Ship = ff.Sprite.extend({

        // constructor: sets unique properties and loads images
        init: function () {
            var me = this;                // self reference for load callback
            me._super();                  // call to parent constructor
            me.friction = 0.5;            // set a property that belongs to Sprite
            me.isThrusting = false;       // whether the ship is actively thrusting
            me.thrustPower = 200;         // the strength of the thrust


            this.loadImage(g.spriteSheetPath, function () {
                // set this sprite texture
                me.setTextureFromNamedCoordinates("shipScout");
            });

            // create the left thruster child object
            me.thrustLeft = new g.entities.Thruster("green");
            me.thrustLeft.position.x = -7;
            me.thrustLeft.position.y = 8;
            me.addChild(me.thrustLeft);

            // create the right thruster child object
            me.thrustRight = new g.entities.Thruster("blue");
            me.thrustRight.position.x = -7;
            me.thrustRight.position.y = -8;
            me.addChild(me.thrustRight);
        },

        // override update to call custom methods
        update: function (deltaTime) {
            this._super(deltaTime);
            this.updateSpeed(deltaTime);
        },

        // leverages texture_coordinates.json to set coordinates by texture name
        setTextureFromNamedCoordinates: function (name) {
            var coord = g.textures[name];
            if(ff.hasValue(coord)) {
                this.setTextureCoordinates(coord.left, coord.right, coord.top, coord.bottom);
            }
        },

        // custom method updates animation and acceleration based on thrust state
        updateSpeed: function(deltaTime) {
            if(this.isThrusting) {
                // apply rotation and thrust power to acceleration
                this.acceleration = ff.math.velocityFromAngle(this.rotation, this.thrustPower);

                // turn on thrusters
                this.thrustLeft.thrust();
                this.thrustRight.thrust();
            } else {
                // turn off acceleration, friction will slow us down automatically
                this.acceleration = {x: 0, y: 0};

                // turn on thrusters
                this.thrustLeft.rest();
                this.thrustRight.rest();
            }
        }
    });

    return g;
}(game || {}, frostFlake));
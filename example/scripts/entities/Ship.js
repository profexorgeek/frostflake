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

        // constructor: sets unique properties and loads an animation
        init: function () {
            var me = this;                  // self reference for load callback
            this.isThrusting = false;       // whether the ship is actively thrusting
            this.thrustPower = 200;         // the strength of the thrust
            this._super();                  // call to parent constructor
            this.friction = 0.5;            // set a property that belongs to Sprite

            // load the ship animation
            this.loadAnimation("/example/data/ship_animation.json", function () {
                // set the animation sequence in a callback
                me.animation.currentSequence("resting");

                // start animating
                me.animation.start();
            });
        },

        // override update to call custom methods
        update: function (deltaTime) {
            this._super(deltaTime);
            this.updateSpeed(deltaTime);
        },

        // custom method updates animation and acceleration based on thrust state
        updateSpeed: function(deltaTime) {
            if(this.isThrusting) {
                // apply rotation and thrust power to acceleration
                this.acceleration = ff.math.velocityFromAngle(this.rotation, this.thrustPower);

                // if the animation is loaded, choose sequence
                if(ff.hasValue(this.animation)) {
                    this.animation.currentSequence("thrusting");
                }
            } else {
                // turn off acceleration, friction will slow us down automatically
                this.acceleration = {x: 0, y: 0};

                // if the animation is loaded, choose sequence
                if(ff.hasValue(this.animation)) {
                    this.animation.currentSequence("resting");
                }
            }
        }
    });

    return g;
}(game || {}, frostFlake));
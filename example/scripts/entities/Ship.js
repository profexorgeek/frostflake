var game = (function (g, ff) {
    "use strict";

    // create the views namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    g.entities.Ship = ff.Sprite.extend({
        init: function () {
            var me = this;

            this._super();

            this.isThrusting = false;
            this.thrustPower = 200;
            this.friction = 0.5;

            // load the ship animation
            this.loadAnimation("/example/data/ship_animation.json", function () {
                // set the animation sequence in a callback
                me.animation.currentSequence("resting");
                me.animation.start();
            });

            ff.game.camera.attachTo(this);
        },

        update: function (deltaTime) {
            this._super(deltaTime);
            this.updateSpeed(deltaTime);
        },

        updateSpeed: function(deltaTime) {

            // if thrusting, apply new velocities
            if(this.isThrusting) {
                this.acceleration = ff.math.velocityFromAngle(this.rotation, this.thrustPower);

                if(ff.hasValue(this.animation)) {
                    this.animation.currentSequence("thrusting");
                }
            
            // if not thrusting, automatically brake
            } else {
                this.acceleration = {x: 0, y: 0};

                if(ff.hasValue(this.animation)) {
                    this.animation.currentSequence("resting");
                }
            }
        }
    });

    return g;
}(game || {}, frostFlake));
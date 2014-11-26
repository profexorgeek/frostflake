/* ===============================================================================================

    THRUSTER.JS
    Example game object extends Sprite and implements a custom animation.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    "use strict";

    // create the entities namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    g.entities.Thruster = ff.Sprite.extend({

        // constructor: sets unique properties and loads images
        init: function(color) {
            var me = this;                  // self reference for callbacks
            me._super();                    // call to parent constructor
            me.isThrusting = false;         // whether the thrust animation is playing

            // load the JSON containing multiple animations
            ff.loadJson("/data/thrust_animations.json", function (json) {
                me.animations = json;
                me.animation = new ff.Animation();


                // choose which color of animation to play
                switch(color) {
                    case "blue" :
                        me.animation.fromJson(me.animations.blue);
                    break;
                    case "green" :
                        me.animation.fromJson(me.animations.green);
                    break;
                    case "pink" :
                        me.animation.fromJson(me.animations.pink);
                    break;
                    case "orange" :
                        me.animation.fromJson(me.animations.orange);
                    break;
                    default:
                        me.animation.fromJson(me.animations.green);
                }

                me.setAnimation(me.animation, function () {
                    me.animation.currentSequence("resting");
                    me.animation.start();
                });
            });
        },

        update: function (deltaTime) {
            this._super(deltaTime);
            if(ff.hasValue(this.animation)) {
                if(this.isThrusting === true) {
                    this.animation.currentSequence("thrusting");
                }
                else {
                    this.animation.currentSequence("resting");
                }
            }
        },

        thrust: function () {
            this.isThrusting = true;
        },

        rest: function () {
            this.isThrusting = false;
        }

    });

    return g;
}(game || {}, frostFlake));
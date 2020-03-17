/* global frostFlake */
var animationDemo = (function (ff) {
    "use strict";

    // create container for demo game
    var demo = {};

    // custom animated sprite object
    demo.AnimatedEntity = ff.Sprite.extend({

        // custom constructor loads animation
        init: function () {

            // create self reference for use in callbacks
            var me = this;

            // call super without passing a texture URL
            me._super();

            // load our animation with a custom success callback
            // callback will fire after the animation and animation texture have loaded
            me.loadAnimation("/example/data/animation.json", function () {
                console.log("Animation loaded successfully.");

                // choose the sequence to play
                me.animation.currentSequence("loading");

                // start animating
                me.animation.start();
            });
        }
    });

    // custom view contains the animation
    demo.CustomView = ff.View.extend({

        // custom constructor instantiates our entity
        init: function () {
            var animatedSprite;
            this._super();

            // instantiate our custom sprite
            animatedSprite = new demo.AnimatedEntity();

            // add it to our render list
            this.addSprite(animatedSprite);
        }
    });

    // custom game loads our custom view
    demo.Game = ff.Game.extend({
        init: function (canvas) {

            // call parent constructor with FPS and background color
            this._super(canvas, 60, "rgba(225, 235, 255, 1)");

            // use our custom view
            this.currentView = new demo.CustomView();
        }
    });

    return demo;

}(frostFlake));
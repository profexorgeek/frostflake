/* global frostFlake */
var spriteDemo = (function(ff) {
    "use strict";

    // create example application container
    var demo = {};

    // basic custom entity with texture and rotation
    demo.Flake = ff.Sprite.extend({
        // custom construct specifies texture URL
        init: function () {
            // call base constructor with sprite URL and a custom load callback
            this._super("/example/frostFlake.png");

            // set a custom rotation speed
            this.rotationVelocity = 1.5;
        }
    });

    // custom entity with no texture of its own, has two children
    demo.ParentEntity = ff.Sprite.extend({
        // custom constructor loads children
        init: function () {
            var flake1, flake2;

            this._super();

            // create two instances of our example entity
            flake1 = new demo.Flake();
            flake2 = new demo.Flake();

            // give each instance a position relative to this position
            flake1.position.x = 50;
            flake2.position.x = -50;

            // add both entities as children to this entity
            this.addChild(flake1);
            this.addChild(flake2);

            // rotate, children will rotate based on relative position
            this.rotationVelocity = -0.25;
        }
    });    

    // create a custom view that loads some FrostFlakeSprite objects
    demo.ExampleView = ff.View.extend({
        // override constructor
        init: function () {
            var parentEntityInstance;

            // call parent constructor
            this._super();

            // create a custom entity instance
            parentEntityInstance = new demo.ParentEntity();

            // add custom entity to children so it will update/render
            this.addSprite(parentEntityInstance);
        }
    });

    // extend the frostflake game object
    demo.Game = ff.Game.extend({
        // custom constructor takes canvas reference
        init: function (canvas) {

            // call parent constructor with canvas, FPS and background color
            this._super(canvas, 60, "rgba(150, 150, 150, 1)");

            // set the current view to an instance of our example view
            this.currentView = new demo.ExampleView();
        }
    });

    // return our custom demo game
    return demo;
}(frostFlake));
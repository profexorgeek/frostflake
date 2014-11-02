var game = (function (g, ff) {
    "use strict";

    // create the views namespace if it doesn't exist
    if(!ff.hasValue(g.views)) {
        g.views = {};
    }
    
    // define a custom level type
    g.views.Space = ff.View.extend({
        init: function () {
            var i;
            this._super();
            console.log("Instantiated Space view.");

            // create starfield
            for(i = 0; i < 200; i++) {
                this.addSprite(new g.entities.Star());
            }

            // create player ship
            this.player = new g.entities.Ship();
            this.addSprite(this.player);

            // create mouse cursor
            this.cursor = new g.entities.Cursor();
            this.addSprite(this.cursor);
        },

        update: function (deltaTime) {
            this._super(deltaTime);
            this.doPlayerInput();
        },

        doPlayerInput: function () {
            var m = ff.input.mouse;

            var rotationToMouse = ff.math.angleBetweenPoints(this.player.position, {x: m.worldX, y: m.worldY});
            this.player.rotation = rotationToMouse;

            if (m.buttonDown(m.buttons.Left)) {
                this.player.isThrusting = true;
            } else {
                this.player.isThrusting = false;
            }
        }
    });

    return g;
}(game || {}, frostFlake));
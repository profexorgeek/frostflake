/* ===============================================================================================

    STATION.JS
    Space station - floats in space and can be docked at by ships.

================================================================================================*/

/* global frostFlake */
var game = (function (g, ff) {
    "use strict";

    // create the entities namespace if it doesn't exist
    if(!ff.hasValue(g.entities)) {
        g.entities = {};
    }

    // add Ship class to entities namespace
    g.entities.Station = ff.Sprite.extend({

        init: function () {
            var me = this;                                              // self reference for load callback
            me._super();                                                // call to parent constructor
            me.rotationVelocity = ff.math.randomInRange(-0.05, 0.05);   // rotate

            me.loadStation();
        },

        // load all station components
        loadStation: function () {
            // row 3
            this.loadComponent("stationClamp", -3, 3, 0);
            this.loadComponent("stationClamp", -1, 3, 0);
            this.loadComponent("stationSolar", 2, 3, 0);
            this.loadComponent("stationSolar", 3, 3, 0);
            this.loadComponent("stationSolar", 4, 3, 0);

            // row 2
            this.loadComponent("stationGirderBroken", -4, 2, ff.math.piOver2);
            this.loadComponent("stationGirderHub", -3, 2, 0);
            this.loadComponent("stationGirder", -2, 2, ff.math.piOver2);
            this.loadComponent("stationGirderTee", -1, 2, ff.math.pi);
            this.loadComponent("stationGirderTee", 0, 2, 0);
            this.loadComponent("stationGirder", 1, 2, ff.math.piOver2);
            this.loadComponent("stationGirderHub", 2, 2, 0);
            this.loadComponent("stationGirderHub", 3, 2, 0);
            this.loadComponent("stationGirderHub", 4, 2, 0);
            this.loadComponent("stationSolar", 5, 2, -ff.math.piOver2);

            // row 1
            this.loadComponent("stationClampBroken", -3, 1, ff.math.pi);
            this.loadComponent("stationGirder", 0, 1, 0);
            this.loadComponent("stationSolar", 2, 1, ff.math.pi);
            this.loadComponent("stationSolar", 3, 1, ff.math.pi);
            this.loadComponent("stationSolar", 4, 1, ff.math.pi);
            
            // row 0
            this.loadComponent("stationWires", -2, 0, ff.math.piOver2);
            this.loadComponent("stationBubbles", -1, 0, ff.math.piOver2);
            this.loadComponent("stationObservatory", 0, 0, 0);
            this.loadComponent("stationBubbles", 1, 0, -ff.math.piOver2);
            
            // row -1
            this.loadComponent("stationAntenna01", -2, -1, ff.math.piOver2);
            this.loadComponent("stationPipes", -1, -1, ff.math.piOver2);
            this.loadComponent("stationHub", 0, -1, 0);
            this.loadComponent("stationPipes", 1, -1, -ff.math.piOver2);
            this.loadComponent("stationAntenna02", 2, -1, -ff.math.piOver2);

            // row -2
            this.loadComponent("stationTubeElbow", -1, -2, ff.math.piOver2);
            this.loadComponent("stationCommand", 0, -2, 0);
            this.loadComponent("stationTubeElbow", 1, -2, 0);

            // row -3
            this.loadComponent("stationTube", -1, -3, 0);
            this.loadComponent("stationTube", 1, -3, 0);

            // row -4
            this.loadComponent("stationTubeElbow", -1, -4, ff.math.pi);
            this.loadComponent("stationTubeTee", 0, -4, 0);
            this.loadComponent("stationTubeElbow", 1, -4, -ff.math.piOver2);

            // row -5
            this.loadComponent("stationWindow", -1, -5, ff.math.piOver2);
            this.loadComponent("stationDorm", 0, -5, 0);
            this.loadComponent("stationWindow", 1, -5, -ff.math.piOver2);

            // row -6
            this.loadComponent("stationWindow", 0, -6, ff.math.pi);
        },

        // load a single component sprite
        loadComponent: function (textureName, gridX, gridY, rotation) {
            var coords, component;

            coords = g.textures[textureName];
            component = new ff.Sprite(g.spriteSheetPath, function () {
                component.setTextureCoordinates(coords.left, coords.right, coords.top, coords.bottom);
            });
            component.position.x = gridX * 32;
            component.position.y = gridY * 32;
            component.rotation = rotation;
            this.addChild(component);
        },

        update: function (deltaTime) {
            this._super(deltaTime);
        }


    });

    return g;
}(game || {}, frostFlake));
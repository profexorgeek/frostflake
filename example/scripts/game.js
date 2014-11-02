var game = (function (g, ff) {
    "use strict";
    
    g.Game = ff.Game.extend({
        init: function (canvas) {
            this._super(canvas);
            console.log("Game instantiated.");

            this.currentView = new g.views.Space();
        }
    })

return g;
}(game || {}, frostFlake));
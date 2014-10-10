var frostFlake = (function (ff) {
    ff.View = Class.extend({
        init:function() {
            this.sprites = [];
            this.collision = [];
        }
    });
    return ff;
}(frostFlake || {}));
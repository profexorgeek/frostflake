var frostFlake = (function (ff) {
    ff.util = {
        getRect:function(width, height, lineColor, fillColor, filled) {
            var halfWidth = width * 0.5;
            var halfHeight = height * 0.5;
            var pts = [
                {x:-halfWidth, y:halfHeight},
                {x:halfWidth, y:halfHeight},
                {x:halfWidth, y:-halfHeight},
                {x:-halfWidth, y:-halfHeight}
            ];
            var poly = new ff.Polygon(pts, true);
            poly.lineColor = lineColor;
            poly.fillColor = fillColor;
            poly.isFilled = filled;
            return poly;
        },

        randomColorHexString:function() {
            return '#' + ff.math.randomInt(0, 16777215).toString(16);
        }
    };
    return ff;
}(frostFlake || {}));
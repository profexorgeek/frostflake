/* ===============================================================================================

    POLYGON.JS
    Special drawable that describes a primative shape as a series of points

================================================================================================*/

var frostFlake = (function (ff) {

    // todo: move this
    ff.getRect = function() {
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
    }

    ff.Polygon = ff.Drawable.extend({
        init:function(points, isClosed) {
            this._super();
            this.points = [];
            this.isClosed = true;
            this.isFilled = true;
            this.lineColor = "#FF0000";
            this.fillColor = "#FFFFFF";
            this.lineWidth = 1;

            if(points !== undefined && points !== null && points.length > 0) {
                this.points = points;
            }
            if(isClosed === undefined || isClosed === null) {
                this.isClosed = true;
            }
            else {
                this.isClosed = isClosed;
            }
        },

        // adds a point to the polygon at the specified index
        addPoint:function(index, x, y) {
            var point = {x:x, y:y};
            this.points.splice(index, 0, point);
        },

        // removes the point at "index" from the polygon
        removePoint:function(index) {
            this.points.splice(index,1);
        },

        updateDimensions:function() {
            if(!this.points.length) {
                this.height = 0;
                this.width = 0;
            }
            else {
                var left = this.points[0].x;
                var right = this.points[0].x;
                var top = this.points[0].y;
                var bottom = this.points[0].y;

                for(var i = 0; i < this.points.length; i++) {
                    left = this.points.x < left ? this.points.x : left;
                    right = this.points.x > right ? this.points.x : right;
                    top = this.points.y > top ? this.points.y : top;
                    bottom = this.points.y < bottom ? this.points.y : bottom;
                }
                this.height = top + bottom;
                this.width = right + left;
            }

            this._super();
        },

        toJson:function() {
            var saveModel = {
                type:"Polygon",
                alpha:this.alpha,
                position:this.position,
                velocity:this.velocity,
                acceleration:this.acceleration,
                rotation:this.rotation,
                rotationVelocity:this.rotationVelocity,
                layer:this.layer,
                points:this.points,
                isClosed:this.isClosed,
                lineColor:this.lineColor,
                lineWidth:this.lineWidth,
                isFilled:this.isFilled,
                fillColor:this.fillColor
            };
            return ff.toJson(saveModel);
        }
    });
    return ff;
}(frostFlake || {}));
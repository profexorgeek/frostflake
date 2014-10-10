var frostFlake = (function (ff, $) {
    ff.Renderer = Class.extend({
        init:function(canvas, camera, background) {
            this.canvas = (canvas) ? canvas : this.createCanvas();
            this.context = this.canvas.getContext("2d");
            this.camera = (camera) ? camera : new ff.Camera();
            this.background = (background) ? background : ff.constants.DEFAULT_BACKGROUND;
            this.viewBounds = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: 0,
                height: 0
            };

            this.boundsFirstUpdate = false;
        },

        setCamera:function(camera) {
            this.camera = camera;
        },

        getCamera:function() {
            return this.camera;
        },

        setCanvas:function(canvas) {
            if(!canvas) {
                throw "Attempted to set invalid canvas on renderer."
            }
            else {
                this.canvas = canvas;
                this.context = canvas.getContext("2d");
            }
        },

        getCanvas:function() {
            return this.canvas;
        },

        updateViewBounds:function () {
            this.viewBounds.top = this.camera.position.y + this.canvas.clientHeight / 2;
            this.viewBounds.left = this.camera.position.x - this.canvas.clientWidth / 2;
            this.viewBounds.bottom = this.viewBounds.top - this.canvas.clientHeight;
            this.viewBounds.right = this.viewBounds.left + this.canvas.clientWidth;
            this.viewBounds.width = this.viewBounds.right - this.viewBounds.left;
            this.viewBounds.height = this.viewBounds.top - this.viewBounds.bottom;

            this.canvas.width = this.viewBounds.width;
            this.canvas.height = this.viewBounds.height;

            this.boundsFirstUpdate = true;
        },

        draw:function(drawableList) {
            if(!this.context) {
                throw "Cannot draw: renderer has no valid context.";
            }

            if(this.viewBounds.width != this.canvas.clientWidth || this.viewBounds.height != this.canvas.clientHeight) {
                this.updateViewBounds();
            }

            var xTarget;
            var yTarget;
            this.context.fillStyle = this.background;
            this.context.fillRect(0,0, this.viewBounds.width, this.viewBounds.height);
            this.camera.start(this.context);
            for(var i = 0; i < drawableList.length; i++) {
                var currentDrawable = drawableList[i];
                xTarget = currentDrawable.position.x;
                yTarget = ff.math.invert(currentDrawable.position.y);
                this.context.save();
                this.context.translate(xTarget, yTarget);
                this.context.rotate(currentDrawable.rotation);
                this.context.globalAlpha = currentDrawable.alpha;
                if(currentDrawable instanceof ff.Sprite && currentDrawable.active) {
                    this.drawSprite(currentDrawable);
                }
                else if(currentDrawable instanceof ff.Polygon && currentDrawable.active) {
                    this.drawPolygon(currentDrawable);
                }
                this.context.restore();
            }
            this.camera.end(this.context);
        },

        drawPolygon:function(polygon) {
            if (polygon.points.length < 2) {
                return;
            }
            this.context.beginPath();
            this.context.moveTo(polygon.points[0].x, polygon.points[0].y);
            for (var p = 1; p < polygon.points.length; p++) {
                var point = polygon.points[p];
                this.context.lineTo(point.x, point.y);
            }

            if (polygon.isClosed) {
                this.context.lineTo(polygon.points[0].x, polygon.points[0].y);

                // draw to one extra point to prevent end gaps in thick strokes
                this.context.lineTo(polygon.points[1].x, polygon.points[1].y);
            }

            if (polygon.isFilled) {
                this.context.fillStyle = polygon.fillColor;
                this.context.fill();
            }

            this.context.lineWidth = polygon.lineWidth;
            this.context.strokeStyle = polygon.lineColor;
            this.context.stroke();
        },

        drawSprite:function(sprite) {
            if(sprite.img === undefined || sprite.img === null) {
                return;
            }


            if(!sprite.textureCoordinates) {
                sprite.updateDimensions();
            }

            var srcWidth = sprite.textureCoordinates.right - sprite.textureCoordinates.left;
            var srcHeight = sprite.textureCoordinates.bottom - sprite.textureCoordinates.top;

            this.context.drawImage(
                sprite.img,
                sprite.textureCoordinates.left,
                sprite.textureCoordinates.top,
                srcWidth,
                srcHeight,
                sprite.width / -2,
                sprite.height / -2,
                sprite.width,
                sprite.height);

            if (sprite.radiusVisible) {
                this.context.beginPath();
                this.context.arc(0, 0, sprite.radius, 0, ff.math.twoPi, false);
                this.context.strokeStyle = "#F00";
                this.context.stroke();
            }
        }
    });
    return ff;
}(frostFlake || {}, jQuery));
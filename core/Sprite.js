var frostFlake = (function (ff) {
    ff.Sprite = ff.Drawable.extend({

        // create the sprite, loading the image URL
        init: function (url, layer, loadedCallback) {
            this._super();

            this.url = url;
            this.img = null;
            this.drawScale = {
                x: 1,
                y: 1
            }
            this.radiusVisible = false;
            this.textureCoordinates = null;
            this.animation = null;
            this.layer = (layer !== undefined && layer !== null) ? layer : this.layer;

            if(url !== undefined && url !== null) {
                this.loadImage(url, loadedCallback);
            }
        },

        update: function (deltaTime) {
            this._super(deltaTime);
            if (this.animation != null && this.animation instanceof ff.Animation) {
                this.animation.update(deltaTime);
                this.textureCoordinates = this.animation.getTextureCoordinates();
            }
        },

        // loads the image, can be called again if url changes
        loadImage: function (url, loadedCallback) {
            var wasActive = this.active;
            this.active = false;
            if (url !== null) {
                this.url = url;
            }
            var me = this;
            this.img = ff.loadImage(this.url, function () {
                if (loadedCallback) {
                    loadedCallback();
                }
                me.updateDimensions();
                if (wasActive) {
                    me.active = true;
                }
            });
        },

        // set texture coordinates to use a single frame of a larger texture
        setTextureCoordinates: function (left, right, top, bottom) {
            this.textureCoordinates = {top: top, right: right, bottom: bottom, left: left};
            this.updateDimensions();
        },

        // sets the sprites position
        setPosition:function(x, y) {
            this.position.x = x;
            this.position.y = y;
        },

        // sets the percent the sprite will be scaled on each axis when drawn
        setDrawScale: function (xScale, yScale) {
            xScale = ff.math.max(xScale, 0);
            yScale = ff.math.max(yScale, 0);
            this.drawScale = {
                x: xScale,
                y: yScale
            };

            this.updateDimensions();
        },

        // clears texture coordinates, whole img will be drawn
        clearTextureCoordinates: function () {
            this.textureCoordinates = null;
        },

        // called to update the sprite's dimensions
        updateDimensions: function () {
            if (this.textureCoordinates === null) {
                var texDimensions = {
                    width : 0,
                    height: 0
                }
                if(this.img !== undefined && this.img !== null) {
                    texDimensions.width = this.img.width;
                    texDimensions.height = this.img.height;
                }

                this.setTextureCoordinates(0, texDimensions.width, 0, texDimensions.height);
            }

            var width = this.textureCoordinates.right - this.textureCoordinates.left;
            var height = this.textureCoordinates.bottom - this.textureCoordinates.top;

            this.width = width * this.drawScale.x;
            this.height = height * this.drawScale.y;

            this._super();
        },

        // loads an animation
        loadAnimation: function (url) {
            var anim = new ff.Animation();
            var me = this;
            anim.fromUrl(url, function () {
                me.loadImage(anim.url, function () {
                    me.animation = anim;
                    me.textureCoordinates = me.animation.getTextureCoordinates();
                    me.updateDimensions();
                    me.animation.start();
                });
            });
        },

        toModel: function () {
            var model = {
                type: "Sprite",
                alpha: this.alpha,
                position: this.position,
                velocity: this.velocity,
                acceleration: this.acceleration,
                rotation: this.rotation,
                rotationVelocity: this.rotationVelocity,
                layer: this.layer,
                url: this.url,
                textureCoordinates: this.textureCoordinates
            };
            return model;
        },

        toJson: function () {
            var model = this.toModel();
            return ff.toJson(model);
        },

        fromJson: function (json) {
            this._super(json);
            this.loadImage();
        }
    });
    return ff;
}(frostFlake || {}));
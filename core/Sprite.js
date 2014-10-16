/* ===============================================================================================

    SPRITE.JS
    A Drawable referencing texture data. Can specify texture coordinates to only draw 
    a portion of a texture or an animation that continually updates texture coordinates.

    Images can be lazy-loaded from a URL provided when instantiated or loaded later via
    the "loadImage" method.

================================================================================================*/

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

        // updates animation and texture coordinates
        update: function (deltaTime) {
            this._super(deltaTime);
            if (ff.hasValue(this.animation) && this.animation instanceof ff.Animation) {
                this.animation.update(deltaTime);
                this.textureCoordinates = this.animation.getTextureCoordinates();
            }
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
            xScale = Math.max(xScale, 0);
            yScale = Math.max(yScale, 0);
            this.drawScale = {
                x: xScale,
                y: yScale
            };

            this.updateDimensions();
        },

        // loads the image associated with an animation and sets it
        setAnimation: function(anim) {
            var me = this;
            this.animation = anim;

            this.loadImage(anim.spriteSheetUrl(), function () {
                me.animation = anim;
                me.textureCoordinates = anim.getTextureCoordinates();
                me.updateDimensions();
            });
        },

        // clears texture coordinates, whole img will be drawn
        clearTextureCoordinates: function () {
            this.textureCoordinates = null;
        },

        // called to update the sprite's dimensions
        updateDimensions: function () {
            // if we are animating, the animation will set texture coordinates
            if(!ff.hasValue(this.animation)) {
                var texDimensions = {
                    width : 0,
                    height: 0
                }
                if(ff.hasValue(this.img)) {
                    texDimensions.width = this.img.width;
                    texDimensions.height = this.img.height;
                }

                // manually set texture coordinates, calling setTextureCoordinages = infinite loop
                this.textureCoordinates = {top: 0, right: 0, bottom: texDimensions.height, left: texDimensions.width};
            }

            // calculate width/height with drawscale
            this.width = (this.textureCoordinates.right - this.textureCoordinates.left) * this.drawScale.x;
            this.height = (this.textureCoordinates.bottom - this.textureCoordinates.top) * this.drawScale.y;

            this._super();
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
                if (ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
                me.updateDimensions();
                if (wasActive) {
                    me.active = true;
                }
            });
        },

        // loads an animation
        loadAnimation: function (url, loadedCallback) {
            var me = this;
            var animation = ff.Animation.getInstanceFromUrl(url, function () {
                me.setAnimation(animation);
                if(ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
            });
            
        },
    });

    return ff;
}(frostFlake || {}));
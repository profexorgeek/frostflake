/* ===============================================================================================

    SPRITE.JS
    A Drawable referencing texture data. Can specify texture coordinates to only draw 
    a portion of a texture or an animation that continually updates texture coordinates.

    Images can be lazy-loaded from a URL provided when instantiated or loaded later via
    the "loadImage" method.

================================================================================================*/

/* global Class */
var frostFlake = (function (ff) {

    "use strict";

    ff.Sprite = Class.extend({

        // constructor: set properties and load image
        init: function (imageUrl, loadedCallback) {
            this.active = true;                 // whether update and draw should apply to this object
            this.children = [];                 // child sprites
            this.alpha = 1;                     // sprite alpha as a 0-1 float
            this.drawScale = {x: 1, y: 1};      // the x and y drawing scale as a percentage
            this.parent = null;                 // sprite parent
            this.width = 0;                     // sprite width
            this.height = 0;                    // sprite total height
            this.position = {x: 0, y: 0};       // sprite position, relative to parent if parented
            this.velocity = {x: 0, y: 0};       // sprite velocity, applied each update
            this.acceleration = {x: 0, y: 0};   // sprite acceleration, applied to velocity and position each frame
            this.friction = 0;                  // the amout of friction applied to acceleration and velocity
            this.rotation = 0;                  // sprite rotation in radians, relative to parent if parented
            this.rotationVelocity = 0;          // sprite rotation velocity, applied each update
            this.collisionRadius = 0;           // sprite collideable radius
            this.showRadius = false;            // whether or not to draw the sprite's collision radius
            this.textureUrl = "";               // url of the texture to load and display
            this.texture = null;                // the actual image data used by this sprite
            this.animation = null;              // the animation governing this sprite
            this.textureCoordinates = null;     // object representing the texture dimensions once loaded

            this.parallaxCamera = null;         // the camera to use for parallax
            this.parallaxPercent = 0;           // the amount of camera velocity to apply

            // load the texture if URL was provided
            // Sprites with null textures will be updated but not drawn
            if (ff.hasValue(imageUrl)) {
                this.textureUrl = imageUrl;
                this.loadImage(imageUrl, loadedCallback);
            }
        },

        // updates the position, rotation and children
        update: function (deltaTime) {
            if (!ff.hasValue(deltaTime)) {
                throw "Bad delta provided to update cycle!";
            }

            // inactive Sprites are not updated or drawn
            if (this.active === true) {
                var deltaSquaredDividedByTwo = deltaTime * deltaTime / 2,   // calc once for performance
                    i;                                                      // JSLint likes this here.

                // update values based on time elapsed
                this.position.x += (this.velocity.x * deltaTime) + (this.acceleration.x * deltaSquaredDividedByTwo);
                this.position.y += (this.velocity.y * deltaTime) + (this.acceleration.y * deltaSquaredDividedByTwo);
                this.velocity.x += (this.acceleration.x * deltaTime) - (this.friction * this.velocity.x * deltaTime);
                this.velocity.y += (this.acceleration.y * deltaTime) - (this.friction * this.velocity.y * deltaTime);
                this.rotation += this.rotationVelocity * deltaTime;

                if(ff.hasValue(this.parallaxCamera)) {
                    this.position.x += (this.parallaxCamera.velocity.x * this.parallaxPercent * deltaTime);
                    this.position.y += (this.parallaxCamera.velocity.y * this.parallaxPercent * deltaTime);
                }

                // update children
                for (i = 0; i < this.children.length; i += 1) {
                    this.children[i].update(deltaTime);
                }

                // clamp values
                this.clamp();

                // calculate animation
                if (ff.hasValue(this.animation) && this.animation instanceof ff.Animation) {
                    this.animation.update(deltaTime);
                    this.textureCoordinates = this.animation.getTextureCoordinates();
                }
            }
        },

        // adds a child sprite to this object
        addChild: function (sprite) {
            sprite.parent = this;
            this.children.push(sprite);
        },

        // removes a child sprite from this object
        removeChild: function (sprite) {
            var index = this.sprites.indexOf(sprite);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
            sprite.parent = null;
            return sprite;
        },

        // attaches this to another sprite as a child
        attachTo: function (parent) {
            parent.addChild(this);
        },

        // returns the absolute position of this object, taking parent positions and rotations into account
        getAbsoluteProperties: function () {
            var parentAbsolute, absoluteProperties, offsetX, offsetY;

            // if we have a parent, recurse upwards to combine properties
            if (ff.hasValue(this.parent)) {
                parentAbsolute = this.parent.getAbsoluteProperties();

                // calculate parent rotation's effect on position
                offsetX = Math.cos(parentAbsolute.rotation) * this.position.x;
                offsetY = Math.sin(parentAbsolute.rotation) * this.position.y;

                // create our absolute properties from parent and new calculations
                absoluteProperties = {
                    position: {
                        // add parent position, local position and rotation offset
                        x: offsetX + parentAbsolute.position.x,
                        y: offsetY + parentAbsolute.position.y
                    },
                    // combine rotations
                    rotation: this.rotation + parentAbsolute.rotation
                };
            }

            // if no parent, our properties are already absolute
            else {
                absoluteProperties = {
                    position: this.position,
                    rotation: this.rotation
                };
            }

            return absoluteProperties;
        },

        applyParallax: function(camera, percent) {
            this.parallaxCamera = camera;
            this.parallaxPercent = percent;
        },

        clearParallax: function() {
            this.parallaxCamera = null;
            this.parallaxPercent = 0;
        },

        // clamps values to valid ranges
        clamp: function () {
            this.alpha = Math.max(this.alpha, 0);
            this.alpha = Math.min(this.alpha, 1);
            if (this.rotation >= ff.math.twoPi) {
                this.rotation -= ff.math.twoPi;
            }
            if (this.rotation < 0) {
                this.rotation += ff.math.twoPi;
            }
        },

        // checks if this sprite's collision radius overlaps the provided sprite
        isRadiusColliding: function (sprite) {
            var overlapDistance,        // the combined radii 
                distanceBetween;        // the absolute distance between Sprites

            if (!(sprite instanceof ff.Sprite)) {
                throw "Cannot check radius collision against a non-Sprite object.";
            }

            overlapDistance = (this.radius) + (sprite.radius);
            distanceBetween = ff.math.absoluteDistanceBetween(this.position, sprite.position);
            return (overlapDistance < distanceBetween);
        },

        // recalculate the height/width based on texture coordinates, then recalculate radius
        updateDimensions: function () {
            // if we have an animation, get texture coordinates from the animation
            if (ff.hasValue(this.animation)) {
                this.textureCoordinates = this.animation.getTextureCoordinates();

            // otherwise set based on texture size
            } else {
                // if the coordinates haven't been set, use the texture size
                if(!ff.hasValue(this.textureCoordinates)) {
                    var texDimensions = {
                        width : 0,
                        height: 0
                    };
                    if (ff.hasValue(this.texture)) {
                        texDimensions.width = this.texture.width;
                        texDimensions.height = this.texture.height;
                    }
                    // manually set texture coordinates
                    // NOTE: do not call setTextureCoordinates here: infinite loop!
                    this.textureCoordinates = {top: 0, right: texDimensions.width, bottom: texDimensions.height, left: 0};
                }
        }

            // calculate width/height with drawscale
            this.width = (this.textureCoordinates.right - this.textureCoordinates.left) * this.drawScale.x;
            this.height = (this.textureCoordinates.bottom - this.textureCoordinates.top) * this.drawScale.y;

            // update the radius to match the new dimensions
            this.updateRadius();
        },

        // calculates and sets the radius. This should be called whenever dimensions change
        updateRadius: function () {
            if (this.width === 0 && this.height === 0) {
                this.radius = 0;
            } else {
                this.radius = ff.math.absoluteDistanceBetween({x: 0, y: 0}, {x: this.width * 0.5, y: this.height * 0.5});
            }
        },

        // set new texture coordinates, called automatically by animation sequence
        setTextureCoordinates: function (left, right, top, bottom) {
            this.textureCoordinates = {top: top, right: right, bottom: bottom, left: left};
            this.updateDimensions();
        },

        // resets texture coordinates to null
        clearTextureCoordinates: function () {
            this.textureCoordinates = null;
        },

        // sets the position
        setPosition: function (x, y) {
            this.position.x = x;
            this.position.y = y;
        },

        // sets the drawscale, ensuring it's not < 0 and then updates dimensions
        setDrawScale: function (xScale, yScale) {
            xScale = Math.max(xScale, 0);
            yScale = Math.max(yScale, 0);
            this.drawScale = {
                x: xScale,
                y: yScale
            };
            this.updateDimensions();
        },

        // loads and sets animation json from provided URL, calls loadedCallback on success
        loadAnimation: function (url, loadedCallback) {
            var me = this,
            animation = ff.Animation.getInstanceFromUrl(url, function() {
                me.setAnimation(animation, loadedCallback);
            });
        },

        // sets the animation and loads the animation's spritesheet URL
        setAnimation: function (anim, loadedCallback) {
            var me = this;
            this.loadImage(anim.spriteSheetUrl(), function () {
                me.animation = anim;
                me.updateDimensions();
                if(ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
            });
        },

        // loads an image texture from the provided URL, calls loadedCallback when complete
        loadImage: function (url, loadedCallback) {
            var me = this;
            this.textureUrl = url;
            this.texture = ff.loadImage(this.textureUrl, function () {
                if (ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
                me.updateDimensions();
            });
        },

        // TODO: implement this
        toJson: function () {
            throw "Not implemented";
        },

        // TODO: implement this
        fromJson: function () {
            throw "Not implemented";
        }
    });

    return ff;
}(frostFlake || {}));
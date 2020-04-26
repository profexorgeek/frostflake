class CanvasRenderer {

    #textureCache = {};
    context;

    // TODO: what about clearing texture cache
    // and images added to the DOM?

    constructor(canvas, background) {
        this.context = canvas.getContext("2d");
        this.background = background;
    }

    checkAndPreloadPositionables(positionables) {
        let preloaded = true;
        for(let i = 0; i < positionables.length; i++) {
            if(!this.textureLoaded(positionables[i].texture)) {
                preloaded = false;
            }

            if(positionables[i].children.length > 0) {
                let childrenLoaded = this.checkAndPreloadPositionables(positionables[i].children);
                if(childrenLoaded === false) {
                    preloaded = false;
                }
            }
        }

        return preloaded;
    }

    renderToTexture(textureName, positionables, width, height, success = null, background = "rgba(0,0,0,0)") {
        // cache context
        let contextCache = this.context;

        let camera = new Camera();
        camera.background = background;
        let cvs = document.createElement('canvas');
        cvs.height = height;
        cvs.width = width;
        this.context = cvs.getContext('2d');
        this.background = background;
        this.draw(positionables, camera);
        this.loadTexture(cvs.toDataURL(), success, textureName);

        // restore context
        this.context = contextCache;
    }
    
    draw(positionables, camera) {
        let scale = 1 / camera.resolution;
        let transX = MathUtil.invert(camera.x) + (this.context.canvas.width / 2) * camera.resolution;
        let transY = camera.y + (this.context.canvas.height / 2) * camera.resolution;

        this.context.save();
        this.context.imageSmoothingEnabled = camera.antialias;
        this.context.fillStyle = camera.background;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.scale(scale, scale);
        this.context.translate(transX, transY);

        for(let i = 0; i < positionables.length; i++) {

            if(!positionables[i].visible) {
                continue;
            }

            // draw sprites
            if(positionables[i] instanceof Sprite) {
                this.drawSprite(positionables[i], this.context);
            }

            // TODO: draw shapes
        }
        this.context.restore();
    }

    drawSprite(sprite, context) {
        let transX = sprite.x;
        let transY = MathUtil.invert(sprite.y);
        let transRot = -sprite.rotation;
        let alpha = sprite.alpha;

        this.context.save();
        this.context.translate(transX, transY);
        this.context.rotate(transRot);
        this.context.globalAlpha = alpha;

        // draw texture
        if(this.textureLoaded(sprite.texture)) {
            let tex = this.#textureCache[sprite.texture];

            // if null frame, force sprite to have a frame matching its width
            if(sprite.frame == null) {
                sprite.frame = new Frame();
                sprite.frame.width = tex.width;
                sprite.frame.height = tex.height;
            }

            this.context.drawImage(
                tex,
                sprite.frame.left,
                sprite.frame.top,
                sprite.frame.width,
                sprite.frame.height,
                sprite.frame.width / -2 * sprite.scale,
                sprite.frame.height / -2 * sprite.scale,
                sprite.frame.width * sprite.scale,
                sprite.frame.height * sprite.scale
            );

            // draw debug visualizations
            if(FrostFlake.Game.showDebug) {
                
                // draw sprite bounds
                this.context.strokeStyle = sprite.color;
                this.context.strokeRect(
                    -sprite.frame.width / 2 * sprite.scale,
                    -sprite.frame.height / 2 * sprite.scale,
                    sprite.frame.width * sprite.scale,
                    sprite.frame.height * sprite.scale);
            }
        }
        // texture hasn't been loaded, load it now
        else {
            this.loadTexture(sprite.texture);
        }

        // reset alpha
        this.context.globalAlpha = 1;

        // draw collision shapes
        if(FrostFlake.Game.showDebug) {
            this.context.strokeStyle = sprite.collision.color;
            if(sprite.collision instanceof Circle) {
                this.context.beginPath();
                this.context.arc(
                    0,
                    0,
                    sprite.collision.radius,
                    0,
                    Math.PI * 2
                );
                this.context.stroke();
            }
            else if(sprite.collision instanceof Rectangle) {
                this.context.save();
                this.strokeStyle = sprite.collision.color;
                this.context.rotate(sprite.collision.absolutePosition.rotation);
                this.context.strokeRect(
                    -sprite.collision.width / 2,
                    -sprite.collision.height / 2,
                    sprite.collision.width,
                    sprite.collision.height
                )
                this.context.restore();
            }
        }

        // recurse on children
        if(sprite.children.length > 0) {
            for(let i = 0; i < sprite.children.length; i++) {
                this.drawSprite(sprite.children[i], this.context);
            }
        }

        // restore context
        this.context.restore();
    }

    textureLoaded(url) {
        if(url !== null &&
            url in this.#textureCache &&
            this.#textureCache[url] instanceof HTMLImageElement === true &&
            this.#textureCache[url].complete === true) {
                return true;
            }
        return false;
    }

    loadTexture(url, success = null, keyName = null) {
        
        let me = this;

        keyName = (keyName == null) ? url : keyName;

        // EARLY OUT: bad URL or loading in progress
        if(keyName == '' || keyName == null || keyName in this.#textureCache) {
            return;
        }

        // insert placeholder so images aren't loaded
        // multiple times if load requests are fired quickly
        me.#textureCache[keyName] = "...";

        Data.load(url, 'blob',
            // success
            function(response) {
                let img = document.createElement('img');
                img.onload = () => {
                    me.#textureCache[keyName] = img;
                    if(success) {
                        success(keyName);
                    }
                }
                img.src = URL.createObjectURL(response);
            },
            // fail
            function(response) {
                FrostFlake.Log.error(`Failed to load image ${keyName}`);
            });
    }
}
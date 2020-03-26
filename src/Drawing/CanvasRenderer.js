class CanvasRenderer {

    #textureCache = {};
    context;
    background = "rgb(0,0,0)";

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
    
    draw(positionables, camera) {
        this.context;
        this.background;
        let scale = 1 / camera.resolution;
        let transX = MathUtil.invert(camera.x) + (this.context.canvas.width / 2) * camera.resolution;
        let transY = camera.y + (this.context.canvas.height / 2) * camera.resolution;

        this.context.save();
        this.context.imageSmoothingEnabled = camera.antialias;
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.scale(scale, scale);
        this.context.translate(transX, transY);

        for(let i = 0; i < positionables.length; i++) {

            // draw sprites
            if(positionables[i] instanceof Sprite) {
                this.drawSprite(positionables[i], this.context);
            }
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
                this.context.strokeStyle = "LightGray";
                this.context.strokeRect(
                    -sprite.frame.width / 2 * sprite.scale,
                    -sprite.frame.height / 2 * sprite.scale,
                    sprite.frame.width * sprite.scale,
                    sprite.frame.height * sprite.scale);

                // draw collision
                this.context.strokeStyle = "Red";
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
                    this.strokeStyle = "Red";
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
        }
        // texture hasn't been loaded, load it now
        else {
            this.loadTexture(sprite.texture);
        }

        // reset alpha
        this.context.globalAlpha = 1;

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

    loadTexture(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // return on bad URL or loading in progress
        if(url == '' || url == null || url in this.#textureCache) {
            return;
        }

        // insert placeholder so images aren't loaded
        // multiple times if load requests are fired quickly
        me.#textureCache[url] = "...";
        
        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(xhr.response);
                    me.#textureCache[url] = img;
                }
                else {
                    throw `Failed to load ${url}`;
                }
            }
        });

        xhr.responseType = 'blob';
        xhr.open('GET', url, true);
        xhr.send();
    }
}
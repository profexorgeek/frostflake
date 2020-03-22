class CanvasRenderer {

    #textureCache = {};

    // TODO: what about clearing texture cache
    // and images added to the DOM?

    checkAndPreloadSprites(sprites) {
        let preloaded = true;
        for(let i = 0; i < sprites.length; i++) {
            if(!this.textureLoaded(sprites[i].texture)) {
                preloaded = false;
            }

            if(sprites[i].children.length > 0) {
                let childrenLoaded = this.checkAndPreloadSprites(sprites[i].children);
                if(childrenLoaded === false) {
                    preloaded = false;
                }
            }
        }

        return preloaded;
    }
    
    draw(sprites, camera, canvas, background = "rgb(0, 0, 0)", antialias = false) {
        let ctx = canvas.getContext("2d");
        let transX = MathUtil.invert(camera.x) + (ctx.canvas.width / 2);
        let transY = camera.y + (ctx.canvas.height / 2);

        ctx.imageSmoothingEnabled = antialias;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        ctx.translate(transX, transY);
        for(let i = 0; i < sprites.length; i++) {
            this.drawSprite(sprites[i], ctx);
        }
        ctx.restore();
    }

    drawSprite(sprite, ctx) {
        let transX = sprite.x;
        let transY = MathUtil.invert(sprite.y);
        let transRot = -sprite.rotation;
        let alpha = sprite.alpha;

        ctx.save();

        ctx.translate(transX, transY);
        ctx.rotate(transRot);
        ctx.globalAlpha = alpha;

        // draw texture
        if(this.textureLoaded(sprite.texture)) {
            let tex = this.#textureCache[sprite.texture];
            let frame = sprite.frame;

            // if null frame, default to sprite width
            if(frame == null) {
                frame = new Frame();
                frame.width = tex.width;
                frame.height = tex.height;
            }

            ctx.drawImage(
                tex,
                frame.left,
                frame.top,
                frame.width,
                frame.height,
                frame.width / -2 * sprite.scale,
                frame.height / -2 * sprite.scale,
                frame.width * sprite.scale,
                frame.height * sprite.scale
            );

            // draw debug visualizations
            if(FrostFlake.Game.showDebug) {
                ctx.strokeStyle = "rgb(255, 0, 0)";
                ctx.strokeRect(-frame.width / 2, -frame.height / 2, frame.width, frame.height);
            }
        }
        // texture hasn't been loaded, load it now
        else {
            this.loadTexture(sprite.texture);
        }

        // reset alpha
        ctx.globalAlpha = 1;

        // recurse on children
        if(sprite.children.length > 0) {
            for(let i = 0; i < sprite.children.length; i++) {
                this.drawSprite(sprite.children[i], ctx);
            }
        }

        // restore context
        ctx.restore();
    }

    textureLoaded(url) {
        if(url !== null &&
            url in this.#textureCache &&
            this.#textureCache[url] instanceof HTMLImageElement === true) {
                return true;
            }
        return false;
    }

    loadTexture(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // return if we've already started loading this
        if(url in this.#textureCache) {
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
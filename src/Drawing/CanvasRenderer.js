class CanvasRenderer {

    #textureCache = {};

    // TODO: what about clearing texture cache
    // and images added to the DOM?
    
    draw(sprites, camera, canvas, background = "rgb(0, 0, 0)") {
        let ctx = canvas.getContext("2d");
        let transX = MathUtil.invert(camera.x) + (ctx.canvas.width / 2);
        let transY = camera.y + (ctx.canvas.height / 2);

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
        if(sprite.texture !== null &&
            sprite.texture in this.#textureCache &&
            this.#textureCache[sprite.texture] instanceof HTMLImageElement === true) {
            let tex = this.#textureCache[sprite.texture];
            let coords = sprite.coords;
            ctx.drawImage(
                tex,
                coords.left,
                coords.top,
                coords.width,
                coords.height,
                coords.width / -2,
                coords.height / -2,
                coords.width,
                coords.height
            );
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
                this.drawEntity(sprite.children[i]);
            }
        }

        // restore context
        ctx.restore();
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
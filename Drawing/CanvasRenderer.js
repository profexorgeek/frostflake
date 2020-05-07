import FrostFlake from '../FrostFlake.js';
import Sprite from '../Positionables/Sprite.js';
import Positionable from '../Positionables/Positionable.js';
import Circle from '../Positionables/Circle.js';
import Rectangle from '../Positionables/Rectangle.js';
import Camera from '../Positionables/Camera.js';
import Frame from './Frame.js'
import MathUtil from '../Utility/MathUtil.js';
import Data from '../Data/Data.js';

export default class CanvasRenderer {
    context;

    constructor(canvas, background) {
        this.context = canvas.getContext("2d");
        this.background = background;
    }

    async renderCustomImage(imageName, positionables, width, height, background = "rgba(0,0,0,0)") {
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

        // restore context
        this.context = contextCache;

        await Data.loadImage(cvs.toDataURL(), imageName);
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
            this.drawPositionable(positionables[i]);
        }
        this.context.restore();
    }

    drawPositionable(positionable) {
        if(positionable instanceof Positionable && positionable.visible) {
            if(positionable instanceof Sprite) {
                this.drawSprite(positionable);
            }

            else if(positionable instanceof Circle) {
                this.drawCircle(positionable);
            }

            else if(positionable instanceof Rectangle) {
                this.drawRect(positionable);
            }
        }
    }

    drawCircle(circle) {
        let transX = circle.x;
        let transY = MathUtil.invert(circle.y);
        this.context.save();
        this.context.translate(transX, transY);

        this.context.strokeStyle = circle.color;
        this.context.beginPath();
                this.context.arc(
                    0,
                    0,
                    circle.radius,
                    0,
                    Math.PI * 2
                );
                this.context.stroke();
        this.context.restore();
    }

    drawRect(rect, axisAligned = true) {
        let transX = rect.x;
        let transY = MathUtil.invert(rect.y);

        this.context.save();
        this.context.translate(transX, transY);

        if(axisAligned) {
            this.context.rotate(rect.absolutePosition.rotation);
        }

        this.context.strokeStyle = rect.color;
        this.context.strokeRect(
            -rect.width / 2,
            -rect.height / 2,
            rect.width,
            rect.height);

        this.context.restore();
    }

    drawSprite(sprite) {
        let transX = sprite.x;
        let transY = MathUtil.invert(sprite.y);
        let transRot = -sprite.rotation;
        let alpha = sprite.alpha;

        this.context.save();
        this.context.translate(transX, transY);
        this.context.rotate(transRot);
        this.context.globalAlpha = alpha;

        let tex = Data.getItem(sprite.texture);
        if(tex == null) {
            const msg = `Tried to render bad texture: ${sprite.texture}. ` +
                `Sprite wasn't given a texture or texture wasn't preloaded`;
            FrostFlake.Log.error(msg);
            throw Error(msg);
        }

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

        // reset alpha
        this.context.globalAlpha = 1;

        // draw collision shapes
        if(FrostFlake.Game.showDebug) {
            this.drawPositionable(sprite.collision);
        }

        // recurse on children
        if(sprite.children.length > 0) {
            for(let i = 0; i < sprite.children.length; i++) {
                this.drawPositionable(sprite.children[i], this.context);
            }
        }

        // restore context
        this.context.restore();
    }
}
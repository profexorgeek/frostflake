import FrostFlake from '../FrostFlake';
import Text from '../Positionables/Text';
import Sprite from '../Positionables/Sprite';
import Positionable from '../Positionables/Positionable';
import Circle from '../Positionables/Circle';
import Rectangle from '../Positionables/Rectangle';
import Line from '../Positionables/Line';
import Camera from '../Positionables/Camera';
import Frame from './Frame'
import MathUtil from '../Utility/MathUtil';
import Data from '../Data/Data';

export default class CanvasRenderer {

    context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d");
    }

    // renders an image to a new canvas and returns the image name, which can be used as the source for a texture
    // this allows drawing to a render target to create custom sprite textures
    async renderCustomImage(customImageName: string, positionables: Array<Positionable>, width: number, height: number): Promise<string> {

        const defaultContext: CanvasRenderingContext2D = this.context;
        const camera: Camera = new Camera(width, height);
        const cvs: HTMLCanvasElement = document.createElement('canvas');

        cvs.height = height;
        cvs.width = width;
        this.context = cvs.getContext('2d');

        this.draw(positionables, camera);

        // restore default context
        this.context = defaultContext;

        // get the base64 encoded image data and load into the data cache
        // with the provided key name as if it were a normal texture
        await Data.loadImage(cvs.toDataURL(), customImageName);

        return customImageName;
    }
    
    // root draw call, sets canvas state and starts recursive drawing process
    draw(positionables: Array<Positionable>, camera: Camera): void {
        const scale: number         = 1 / camera.resolution;
        const transX: number        = MathUtil.invert(camera.x) + (this.context.canvas.width / 2) * camera.resolution;
        const transY: number        = camera.y + (this.context.canvas.height / 2) * camera.resolution;

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

    drawPositionable(positionable: Positionable, isCollision: boolean = false): void {

        // EARLY OUT: not visible or null
        if(positionable === null || positionable.visible === false)
        {
            return;
        }

        const xTranslation: number      = positionable.x;
        const yTranslation: number      = MathUtil.invert(positionable.y);
        const rotTranslation: number    = -positionable.rotation;
        
        this.context.save();
        this.context.translate(xTranslation, yTranslation);

        if(positionable.ignoreParentRotation === false)
        {
            this.context.rotate(rotTranslation);
        }
        
        // set alpha
        this.context.globalAlpha = positionable.alpha;

        // custom drawing by type
        if(positionable instanceof Sprite) {
            this.drawSprite(positionable);
        }
        else if(positionable instanceof Circle) {
            this.drawCircle(positionable);
        }
        else if(positionable instanceof Rectangle) {
            this.drawRect(positionable, isCollision);
        }
        else if(positionable instanceof Line) {
            this.drawLine(positionable);
        }
        else if(positionable instanceof Text) {
            this.drawText(positionable);
        }

        // restore alpha before drawing children
        this.context.globalAlpha = 1;

        // recurse into children
        if(positionable.children.length > 0) {
            for(let i = 0; i < positionable.children.length; i++) {
                this.drawPositionable(positionable.children[i]);
            }
        }

        this.context.restore();
    }

    // draws a text string
    drawText(text: Text): void {        
        this.context.font = text.font;
        this.context.fillStyle = text.fillStyle;
        this.context.strokeStyle = text.strokeStyle;
        this.context.lineWidth = text.strokeWeight;
        this.context.textAlign = text.textAlign;
        this.context.textBaseline = text.textBaseline;
        this.context.direction = text.textDirection;
        this.context.fillText(text.content, 0, 0);
        this.context.strokeText(text.content, 0, 0);
    }

    drawCircle(circle: Circle): void {
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
    }

    drawRect(rect: Rectangle, isCollision: boolean = false): void {
        // collision rectangles cannot rotate reverse translation rotation
        if(isCollision === true) {
            this.context.rotate(rect.absolutePosition.rotation);
        }
        this.context.strokeStyle = rect.color;
        this.context.strokeRect(
            -rect.width / 2,
            -rect.height / 2,
            rect.width,
            rect.height);

        if(isCollision === true)
        {
            this.context.restore();
        }
    }

    drawLine(line: Line) : void{
        this.context.strokeStyle = line.color;
        this.context.lineWidth = line.thickness;
        this.context.beginPath();
        this.context.moveTo(-(line.length / 2), 0);
        this.context.lineTo(line.length / 2, 0);
        this.context.stroke();
    }

    // draws a sprite object, will draw additional debug shapes if
    // game has showDebug turned on
    drawSprite(sprite: Sprite): void {
        const texture: HTMLCanvasElement = <HTMLCanvasElement>Data.getItem(sprite.texture);
        if(texture == null) {
            const msg = `Tried to render bad texture: ${sprite.texture}. ` +
                `Sprite wasn't given a texture or texture wasn't preloaded`;
            FrostFlake.Log.error(msg);
            throw Error(msg);
        }

        // if null frame, force sprite to have a frame matching its width
        if(sprite.frame == null) {
            sprite.frame = new Frame();
            sprite.frame.width = texture.width;
            sprite.frame.height = texture.height;
        }

        this.context.drawImage(
            texture,
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

        // draw collision shapes
        if(FrostFlake.Game.showDebug && sprite.collision != null) {
            this.drawPositionable(sprite.collision, true);
        }
    }
}
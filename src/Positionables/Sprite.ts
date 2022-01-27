import Animation from '../Drawing/Animation';
import Circle from './Circle';
import Frame from '../Drawing/Frame';
import FrostFlake from '../FrostFlake';
import Positionable from './Positionable';
import Shape from './Shape';
import Camera from './Camera';

export default class Sprite extends Positionable{

    alpha                       = 1;
    frame: Frame                        = null;
    texture: string                     = null;
    animation: Animation                = null;
    scale                       = 1;
    parallax                    = 1;
    private _collisionShape: Shape      = null;

    get collision(): Shape {
        return this._collisionShape;
    }

    set collision(shape: Shape) {
        if(this._collisionShape) {
            this._collisionShape.parent = null;
        }

        this._collisionShape = shape;
        this._collisionShape.parent = this;
    }

    constructor(texture: string = null) {
        super();
        this.texture = texture;
        this.collision = new Circle();

        // set sprite outlines to faint color
        this.color = "rgba(255, 255, 255, 0.2)";
    }

    update(): void {
        super.update();

        // play animation
        if(this.animation) {
            this.animation.update();
            this.texture = this.animation.texture;
            this.frame = this.animation.currentFrame;
        }

        // do parallax
        const cam: Camera = FrostFlake.Game.camera;
        const movePercent: number = 1 - this.parallax;
        this.x += movePercent * (cam.position.x - cam.lastPosition.x);
        this.y += movePercent * (cam.position.y - cam.lastPosition.y);
    }
}
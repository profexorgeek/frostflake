import Positionable from './Positionable.js';
import Circle from './Circle.js';
import FrostFlake from '../FrostFlake.js';

export default class Sprite extends Positionable{

    alpha = 1;
    frame = null;
    texture = null;
    animation = null;
    scale = 1;
    #collisionShape = null;
    parallax = 1;

    get collision() {
        return this.#collisionShape;
    }

    set collision(shape) {
        if(this.#collisionShape) {
            this.#collisionShape.parent = null;
        }

        this.#collisionShape = shape;
        this.#collisionShape.parent = this;
    }

    constructor(texture = null) {
        super();
        this.texture = texture;
        this.collision = new Circle();

        // set sprite outlines to faint color
        this.color = "rgba(255, 255, 255, 0.2)";
    }

    getAbsolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.getAbsolutePosition();
            let magnitude = MathUtil.length(this.x, this.y);
            absPos.x = Math.cos(parentAbsPos.rotation) * magnitude + parentAbsPos.x;
            absPos.y = Math.sin(parentAbsPos.rotation) * magnitude + parentAbsPos.y;
            absPos.rotation = parentAbsPos.rotation + this.rotation;
        }
        else {
            absPos.x = this.x;
            absPos.y = this.y;
            absPos.rotation = this.rotation;
        }

        return absPos;
    }

    update() {
        super.update();

        // play animation
        if(this.animation) {
            this.animation.update();
            this.texture = this.animation.texture;
            this.frame = this.animation.currentFrame;
        }

        // do parallax
        let cam = FrostFlake.Game.camera;
        let movePercent = 1 - this.parallax;
        this.x += movePercent * (cam.position.x - cam.lastPosition.x);
        this.y += movePercent * (cam.position.y - cam.lastPosition.y);
    }
}
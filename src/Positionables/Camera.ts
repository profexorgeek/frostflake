import MathUtil from '../Utility/MathUtil';
import Rectangle from './Rectangle';

export default class Camera extends Rectangle{
    resolution = 1;
    antialias = false;
    lastPosition = {x: 0, y: 0, rotation: 0}

    get randomPositionInView() {
        return {
            x: MathUtil.randomInRange(this.width / -2, this.width / 2),
            y: MathUtil.randomInRange(this.height / -2, this.height / 2),
            rotation: 0
        };
    }

    constructor(width, height) {
        super(width, height);
    }

    update() {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.lastPosition.rotation = this.position.rotation;
        super.update();
    }

    reset() {
        this.resolution = 1;
        this.antialias = false;
        this.position = {x: 0, y: 0, rotation: 0}
        this.velocity = {x: 0, y: 0, rotation: 0}
        this.acceleration = {x: 0, y: 0, rotation: 0}
        this.drag = 0;
    }
}
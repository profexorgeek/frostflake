import MathUtil from '../Utility/MathUtil';
import Position from './Position';
import Rectangle from './Rectangle';

export default class Camera extends Rectangle{
    resolution      = 1;
    antialias      = false;
    lastPosition: Position  = new Position();
    background      = "rgba(0,0,0,1)";

    get randomPositionInView(): Position {
        return new Position(
            MathUtil.randomInRange(this.width / -2, this.width / 2),
            MathUtil.randomInRange(this.height / -2, this.height / 2),
            0
        );
    }

    constructor(width, height) {
        super(width, height);
    }

    update(): void {

        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.lastPosition.rotation = this.position.rotation;

        super.update();
    }

    reset(): void {
        this.resolution = 1;
        this.antialias = false;
        this.position.reset();
        this.velocity.reset();
        this.acceleration.reset();
        this.drag = 0;
    }
}
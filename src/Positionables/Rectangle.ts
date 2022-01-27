import Shape from './Shape';
import Circle from './Circle';
import RepositionType from './RepositionType';
import Position from './Position';
import Positionable from './Positionable';

export default class Rectangle extends Shape {
    width: number;
    height: number;

    get left(): number {
        return this.absolutePosition.x - this.width / 2;
    }

    get right(): number {
        return this.absolutePosition.x + this.width / 2;
    }

    get top(): number {
        return this.absolutePosition.y + this.height / 2;
    }

    get bottom(): number {
        return this.absolutePosition.y - this.height / 2;
    }

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    collideWith(
        shape: Shape,
        repoType: RepositionType = RepositionType.None,
        thisWeight = 1,
        targetWeight = 0,
        repoForce = 1
        ): boolean {

        if(shape instanceof Circle) {
            return Shape.collideCircleVsRect(shape, this, repoType, targetWeight, thisWeight, repoForce);
        }
        else if(shape instanceof Rectangle) {
            return Shape.collideRectVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }

    isPointInside(x: number, y: number): boolean {
        const test = new Position(x, y, 0);
        const abs:Position = this.absolutePosition;
        const delta = test.subtract(abs);

        if(delta.x < this.width / 2 && delta.y < this.height / 2) {
            return true;
        }

        return false;
    }
}
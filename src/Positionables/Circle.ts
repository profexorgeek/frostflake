import MathUtil from '../Utility/MathUtil';
import Shape from './Shape';
import Rectangle from './Rectangle';
import RepositionType from './RepositionType';
import FrostFlake from '../FrostFlake';
import Position from './Position';

export default class Circle extends Shape {
    private _radius: number;

    set radius(size: number) {
        this._radius = size;
    }
    get radius(): number {
        return this._radius;
    }

    constructor(radius: number = 16) {
        super();
        this.radius = radius;
    }

    collideWith(
        shape: Shape,
        repoType: RepositionType = RepositionType.None,
        thisWeight: number = 1,
        targetWeight: number = 0,
        repoForce: number = 1
        ): boolean {

        if (shape instanceof Circle) {
            return Shape.collideCircleVsCircle(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
        else if (shape instanceof Rectangle) {
            return Shape.collideCircleVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }

    isPointInside(x: number, y: number): boolean {
        const abs: Position = this.absolutePosition;
        const delta: number = MathUtil.length(x - abs.x, y - abs.y);
        
        if (delta < this.radius) {
            return true;
        }
        return false;
    }
}
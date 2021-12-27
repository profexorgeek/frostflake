import Shape from './Shape';
import Rectangle from './Rectangle';
import RepositionType from './RepositionType';

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

    collideWith(shape, repoType = RepositionType.None, thisWeight = 1, targetWeight = 0, repoForce = 1) {
        if(shape instanceof Circle) {
            return Shape.collideCircleVsCircle(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
        else if(shape instanceof Rectangle) {
            return Shape.collideCircleVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }
}
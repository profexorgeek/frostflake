import Shape from './Shape.js';
import Rectangle from './Rectangle.js';

export default class Circle extends Shape {
    radius;

    constructor(radius = 16) {
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
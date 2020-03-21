class Circle extends Shape {
    radius;

    constructor(radius = 16) {
        super();
        this.radius = radius;
    }

    collidesWith(shape) {
        if(shape instanceof Circle) {
            let vector1 = this.getAbsolutePosition();
            let vector2 = shape.getAbsolutePosition();
            let delta = MathUtil.vectorSubtract(vector1, vector2);
            let len = MathUtil.length(delta.x, delta.y);
            let threshold = this.radius + shape.radius;
            return len < threshold;
        }
    }
}
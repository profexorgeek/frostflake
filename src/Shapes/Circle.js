class Circle extends Shape {
    radius;

    constructor(radius = 16) {
        super();
        this.radius = radius;
    }

    collidesWith(shape, repositionOutside = false) {
        if(shape instanceof Circle) {
            let shape1Position = this.getAbsolutePosition();
            let shape2Position = shape.getAbsolutePosition();
            let delta = MathUtil.vectorSubtract(shape1Position, shape2Position);
            let distanceApart = MathUtil.length(delta.x, delta.y);
            let collideDistance = this.radius + shape.radius;

            // circles are colliding if the sum of their radii is
            // smaller than their distance apart
            let didCollide = distanceApart < collideDistance;

            if(didCollide && repositionOutside) {
                let overlapAmount = collideDistance - distanceApart;
                let collisionAngle = MathUtil.angleTo(shape1Position, shape2Position);
                let reverseAngle = MathUtil.normalizeAngle(collisionAngle - Math.PI);

                // to stop colliding we need to move in the reverse direction
                // by the magnitude of the overlap amount
                if(this.parent) {
                    this.parent.x += Math.cos(reverseAngle) * overlapAmount;
                    this.parent.y += Math.sin(reverseAngle) * overlapAmount;
                }
                else {
                    this.x += Math.cos(reverseAngle) * overlapAmount;
                    this.y += Math.cos(reverseAngle) * overlapAmount;
                }
            }

            return didCollide;
        }
    }
}
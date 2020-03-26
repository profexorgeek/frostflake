class Rectangle extends Shape {
    width;
    height;

    get left() {
        return this.absolutePosition.x - this.width / 2;
    }

    get right() {
        return this.absolutePosition.x + this.width / 2;
    }

    get top() {
        return this.absolutePosition.y + this.height / 2;
    }

    get bottom() {
        return this.absolutePosition.y - this.height / 2;
    }

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    collideWith(shape, repoType = RepositionType.None, thisWeight = 1, targetWeight = 0, repoForce = 1) {
        if(shape instanceof Circle) {
            return Shape.collideCircleVsRect(shape, this, repoType, targetWeight, thisWeight, repoForce);
        }
        else if(shape instanceof Rectangle) {
            return Shape.collideRectVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }
}
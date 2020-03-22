class Rectangle extends Shape {
    width;
    height;

    get left() {
        return this.getAbsolutePosition.x - this.width / 2;
    }

    get right() {
        return this.getAbsolutePosition.x + this.width / 2;
    }

    get top() {
        return this.getAbsolutePosition.y + this.height / 2;
    }

    get bottom() {
        return this.getAbsolutePosition.y - this.height / 2;
    }

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    collidesWith(shape, repositionOutside = false) {
        if(shape instanceof Circle) {

        }
        else if(shape instanceof Rectangle) {
            this.collideWithRect(shape, repositionOutside);
        }
    }

    collideWithRect(rect, repositionOutside = false) {
        let didCollide = false;

        if(this.bottom < rect.top) {
            didCollide = true;
            if(repositionOutside) {
                this.moveAbsoluteY(rect.top - this.bottom);
            }
        }
        else if(this.top > rect.bottom) {
            didCollide = true;
            if(repositionOutside) {
                this.moveAbsoluteY(rect.bottom - this.top);
            }
        }
    }
}
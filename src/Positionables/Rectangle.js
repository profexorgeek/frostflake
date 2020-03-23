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

    // TODO: not yet working
    collidesWith(shape, repositionOutside = false) {
        if(shape instanceof Circle) {
            throw new "Not implemented yet!";
        }
        else if(shape instanceof Rectangle) {
            this.collideWithRect(shape, repositionOutside);
        }
    }

    // TODO: not yet working
    collideWithRect(rect, repositionOutside = false) {

        throw new "Not implemented yet!";
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
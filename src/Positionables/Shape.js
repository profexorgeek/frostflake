class Shape extends Positionable {

    constructor() {
        super();
    }

    get absolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.absolutePosition;
            let magnitude = MathUtil.length(this.x, this.y);
            absPos.x = Math.cos(parentAbsPos.rotation) * magnitude + parentAbsPos.x;
            absPos.y = Math.sin(parentAbsPos.rotation) * magnitude + parentAbsPos.y;
            absPos.rotation = parentAbsPos.rotation + this.rotation;
        }
        else {
            absPos.x = this.x;
            absPos.y = this.y;
            absPos.rotation = this.rotation;
        }

        return absPos;
    }

    moveAbsoluteX(amount) {
        if(this.parent) {
            this.parent.x += amount;
        }
        else {
            this.x += amount;
        }
    }

    moveAbsoluteY(amount) {
        if(this.parent) {
            this.parent.y += amount;
        }
        else {
            this.y += amount;
        }
    }
}
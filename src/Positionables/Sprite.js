class Sprite extends Positionable{

    alpha = 1;
    frame = null;
    texture = null;
    animation = null;
    scale = 1;

    constructor(texture = null) {
        super();
        let me = this;
        this.texture = texture;
    }

    getAbsolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.getAbsolutePosition();
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

    update() {
        super.update();

        // play animation
        if(this.animation) {
            this.animation.update();
            this.texture = this.animation.texture;
            this.frame = this.animation.currentFrame;
        }
    }
}
class Sprite {

    x = 0;
    y = 0;
    rotation = 0;
    velocityX = 0;
    velocityY = 0;
    rotationVelocity = 0;
    accelX = 0
    accelY = 0;
    alpha = 1;
    drag = 0;
    layer = 0;
    parent = null;
    children = [];
    coords = null;
    texture = null;

    constructor(texture) {
        let me = this;
        this.texture = texture;
    }

    addChild(sprite) {
        sprite.parent = this;
        this.children.push(sprite);
    }

    removeChild(sprite) {
        let i = this.children.indexOf(sprite);
        if(i > -1) {
            this.children.splice(i, 1);
        }
        sprite.parent = null;
    }

    attach(sprite) {
        sprite.addChild(this);
    }

    detach() {
        if(this.parent != null) {
            this.parent.removeChild(this);
        }
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
        let delta = FrostFlake.Game.time.frameSeconds;

        let deltaSquaredHalved = delta * delta / 2;
        let twoPi = Math.PI * 2;

        this.x += (this.velocityX * delta) + (this.accelX * deltaSquaredHalved);
        this.y += (this.velocityY * delta) + (this.accelY * deltaSquaredHalved);
        
        this.velocityX += (this.accelX * delta) - (this.drag * this.velocityX * delta);
        this.velocityY += (this.accelY * delta) - (this.drag * this.velocityY * delta);

        this.rotation += this.rotationVelocity * delta;
        this.rotation = MathUtil.normalizeAngle(this.rotation);

        // sort children by layer
        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }
}
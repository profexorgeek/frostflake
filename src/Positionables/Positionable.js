class Positionable {
    position = {x: 0, y: 0, rotation: 0}
    velocity = {x: 0, y: 0, rotation: 0}
    acceleration = {x: 0, y: 0, rotation: 0}
    drag = 0;
    layer = 0;
    parent = null;
    children = [];
    
    get x() {
        return this.position.x;
    }

    set x(val) {
        this.position.x = val;
    }

    get y() {
        return this.position.y;
    }

    set y(val) {
        this.position.y = val;
    }

    get rotation() {
        return this.position.rotation;
    }

    set rotation(val) {
        this.position.rotation = val;
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

    constructor(x = 0, y = 0) {
        
    }

    addChild(positionable) {
        positionable.parent = this;
        this.children.push(positionable);

        //sort children by layer
        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

    removeChild(positionable) {
        let i = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
        positionable.parent = null;
    }

    attach(positionable) {
        positionable.addChild(this);
    }

    detach() {
        if(this.parent instanceof Positionable) {
            this.parent.removeChild(this);
        }
    }

    moveRootX(amt) {
        var obj = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.x += amt;
    }

    moveRootY(amt) {
        var obj = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.y += amt;
    }

    update() {
        this.preUpdate();

        let delta = FrostFlake.Game.time.frameSeconds;
        let deltaSquaredHalved = delta * delta / 2;

        this.position.x += (this.velocity.x * delta) + (this.acceleration.x * deltaSquaredHalved);
        this.position.y += (this.velocity.y * delta) + (this.acceleration.y * deltaSquaredHalved);
        this.position.rotation += (this.velocity.rotation * delta) + (this.acceleration.rotation * deltaSquaredHalved);

        this.velocity.x += (this.acceleration.x * delta) - (this.drag * this.velocity.x * delta);
        this.velocity.y += (this.acceleration.y * delta) - (this.drag * this.velocity.y * delta);
        this.velocity.rotation += (this.acceleration.rotation * delta) - (this.drag * this.velocity.rotation * delta);

        this.position.rotation = MathUtil.normalizeAngle(this.position.rotation);

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    // this method is intentionally empty so devs can inject custom logic into the update cycle
    preUpdate() {}
}
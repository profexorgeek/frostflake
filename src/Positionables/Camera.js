class Camera extends Rectangle{
    resolution = 1;
    antialias = false;

    constructor(width, height) {
        super(width, height);
    }

    reset() {
        this.resolution = 1;
        this.antialias = false;
        this.position = {x: 0, y: 0, rotation: 0}
        this.velocity = {x: 0, y: 0, rotation: 0}
        this.acceleration = {x: 0, y: 0, rotation: 0}
        this.drag = 0;
    }
}
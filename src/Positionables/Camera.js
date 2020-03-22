class Camera {
    x;
    y;
    resolution = 1;
    antialias = false;

    get width() {
        return FrostFlake.Game.canvas.width;
    }

    get height() {
        return FrostFlake.Game.canvas.height;
    }

    get right() {
        return this.x + (FrostFlake.Game.canvas.width / 2);
    }

    get left() {
        return this.x - (FrostFlake.Game.canvas.width / 2);
    }

    get top() {
        return this.y + (FrostFlake.Game.canvas.height / 2);
    }

    get bottom() {
        return this.y - (FrostFlake.Game.canvas.height / 2);
    }

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update() {
    }
}
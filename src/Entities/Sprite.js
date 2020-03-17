class Sprite {
    x = 0;
    y = 0;
    rotation = 0;
    alpha = 1;

    children = [];
    loaded = false;
    coords;
    texture;

    constructor(texture) {
        let me = this;
        this.texture = texture;
    }
}
class View {
    sprites = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update();
        }
    }

}
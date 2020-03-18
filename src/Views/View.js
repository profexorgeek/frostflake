class View {
    sprites = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update();
        }
    }

    renderToTexture(width, height) {
        let camera = new Camera();
        let target = document.createElement('canvas');
        target.width = width;
        target.height = height;
        FrostFlake.Game.renderer.draw(this.sprites, camera, target, "rgba(0,0,0,0)");
        return target.toDataURL();
    }
}
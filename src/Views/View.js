class View {
    children = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    renderToTexture(width, height) {
        let camera = new Camera();
        let target = document.createElement('canvas');
        target.width = width;
        target.height = height;
        FrostFlake.Game.renderer.draw(this.children, camera, target, "rgba(0,0,0,0)");
        return target.toDataURL();
    }

    addChild(positionable) {
        if(this.children.indexOf(positionable) > -1) {
            throw "positionable has already been added to view."
        }

        this.children.push(positionable);
    }

    removeChild(positionable) {
        let i = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
    }

    clearChildren() {
        this.children = [];
    }
}
class View {
    children = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    addChild(positionable) {
        if(this.children.indexOf(positionable) > -1) {
            throw "positionable has already been added to view."
        }

        this.children.push(positionable);

        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

    removeChild(positionable) {
        this.removeItem(positionable, this.children);
    }

    removeItem(item, list) {
        let i = list.indexOf(item);
        if(i > -1) {
            list.splice(i, 1);
        }
    }

    destroyChild(positionable) {
        positionable.destroy();
        this.removeChild(positionable);
    }

    clearChildren() {
        this.children = [];
    }

    destroy() {
        for(let i = this.children.length - 1; i > -1; i--) {
            this.destroyChild(this.children[i]);
        }
    }
}
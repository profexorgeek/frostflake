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
        let i = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
    }

    clearChildren() {
        this.children = [];
    }
}
import FrostFlake from "../FrostFlake";

export default class View {
    children = [];
    sortNeeded = false;
    initialized = false;

    constructor() {
        this.initialized = false;
        FrostFlake.Log.trace(`View ${this.constructor.name} created.`);

    }

    async initialize() {
        FrostFlake.Log.trace(`View ${this.constructor.name} initializing...`);
    }

    start() {
        (async () => {
            await this.initialize();
            this.initialized = true;
        })();
        FrostFlake.Log.trace(`View ${this.constructor.name} initialized.`);
    }

    update() {
        if(this.sortNeeded) {
            this.children.sort((a, b) => {
                return a.layer - b.layer;
            });

            this.sortNeeded = false;
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    addChild(positionable) {
        if (this.children.indexOf(positionable) > -1) {
            throw "positionable has already been added to view."
        }

        this.children.push(positionable);

        // We can't sort the list here because we could be
        // in the middle of updating, make sure the list is
        // sorted before the next frame
        this.sortNeeded = true;
    }

    removeChild(positionable) {
        this.tryRemoveItem(positionable, this.children);
    }

    tryRemoveItem(item, list) {
        const i = list.indexOf(item);
        if (i > -1) {
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
        for (let i = this.children.length - 1; i > -1; i--) {
            this.destroyChild(this.children[i]);
        }

        // TODO: clear texture cache?
        FrostFlake.Log.trace(`View ${this.constructor.name} destroyed.`);
    }
}
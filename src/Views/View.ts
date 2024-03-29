import FrostFlake from "../FrostFlake";
import Positionable from "../Positionables/Positionable";

export default class View {
    children: Array<Positionable>       = [];
    sortNeeded                 = false;
    initialized                = false;

    constructor() {
        this.initialized = false;
        FrostFlake.Log.trace(`View ${this.constructor.name} created.`);

    }

    async initialize(): Promise<void> {
        FrostFlake.Log.trace(`View ${this.constructor.name} initializing...`);
    }

    start(): void {
        (async () => {
            await this.initialize();
            this.initialized = true;
        })();
        FrostFlake.Log.trace(`View ${this.constructor.name} initialized.`);
    }

    update(): void {
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

    addChild(positionable: Positionable): void {
        if (this.children.indexOf(positionable) > -1) {
            throw "positionable has already been added to view."
        }

        positionable.parent = this;
        this.children.push(positionable);

        // We can't sort the list here because we could be
        // in the middle of updating, make sure the list is
        // sorted before the next frame
        this.sortNeeded = true;
    }

    removeChild(positionable: Positionable): void {
        if(this.tryRemoveItem(positionable, this.children)) {
            positionable.parent = null;
        }
    }

    tryRemoveItem(item: unknown, list: Array<unknown>): boolean {
        const i = list.indexOf(item);
        if (i > -1) {
            list.splice(i, 1);
            return true;
        }
        else {
            FrostFlake.Log.warn("Tried to remove item that wasn't found in collection.");
            return false;
        }
    }

    destroyChild(positionable: Positionable): void {
        this.removeChild(positionable);
        positionable.destroy();
    }

    clearChildren(): void {
        for(let i = this.children.length - 1; i >= 0; i--) {
            this.removeChild(this.children[i]);
        }
    }

    destroy(): void {
        for (let i = this.children.length - 1; i > -1; i--) {
            this.destroyChild(this.children[i]);
        }

        // TODO: clear texture cache?
        FrostFlake.Log.trace(`View ${this.constructor.name} destroyed.`);
    }
}
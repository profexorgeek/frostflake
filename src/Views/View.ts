import FrostFlake from "../FrostFlake";
import Positionable from "../Positionables/Positionable";

export default class View {
    children: Array<Positionable>       = [];
    sortNeeded: boolean                 = false;
    initialized: boolean                = false;

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
        this.tryRemoveItem(positionable, this.children);
    }

    tryRemoveItem(item: any, list: Array<any>): boolean {
        let i = list.indexOf(item);
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
        positionable.destroy();
        this.removeChild(positionable);
    }

    clearChildren(): void {
        this.children = [];
    }

    destroy(): void {
        for (let i = this.children.length - 1; i > -1; i--) {
            this.destroyChild(this.children[i]);
        }

        // TODO: clear texture cache?
        FrostFlake.Log.trace(`View ${this.constructor.name} destroyed.`);
    }
}
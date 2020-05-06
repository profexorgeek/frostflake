import FrostFlake from '../src/FrostFlake.js';
import Sprite from '../src/Positionables/Sprite.js';
import View from '../src/Views/View.js';
import Data from '../src/Data/Data.js';

// This class demonstrates how the FrostFlake
// scene graph works. Every Postionable object
// (including Sprite) can have a parent and children.
// When an object has a parent, it's coordinates and
// rotation become relative to the parent.

export default class ParentChildDemo extends View {
    parentFlake;
    childFlake1;
    childFlake2;

    async initialize() {
        await super.initialize();

        // load data required by this view
        await Data.loadImage('/content/frostflake.png');

        // create a parent sprite and add it to the View sprites
        this.parentFlake = new Sprite('/content/frostflake.png');
        this.parentFlake.velocity.rotation = 3;
        this.addChild(this.parentFlake);

        // create and attach a child sprite
        this.childFlake1 = new Sprite('/content/frostflake.png');
        this.childFlake1.x = -40;
        this.childFlake1.velocity.rotation = -5;
        this.parentFlake.addChild(this.childFlake1);

        // create and attach a child sprite
        this.childFlake2 = new Sprite('/content/frostflake.png');
        this.childFlake2.x = 40;
        this.childFlake2.velocity.rotation = 5;
        this.parentFlake.addChild(this.childFlake2);
    }

    update() {
        super.update();

        // log a child's relative versus absolute positions
        let child = this.childFlake1;
        FrostFlake.Log.info(`Relative vs absolute position: ${child.x},${child.y} - ${child.absolutePosition.x},${child.absolutePosition.y}`);
    }
}
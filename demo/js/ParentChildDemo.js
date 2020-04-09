// This class demonstrates how the FrostFlake
// scene graph works. Every Postionable object
// (including Sprite) can have a parent and children.
// When an object has a parent, it's coordinates and
// rotation become relative to the parent.

class ParentChildDemo extends View {
    parentFlake;
    childFlake1;
    childFlake2;

    constructor() {
        super();

        // create a parent sprite and add it to the View sprites
        this.parentFlake = new Sprite('/demo/content/frostflake.png');
        this.parentFlake.velocity.rotation = 3;
        this.addChild(this.parentFlake);

        // create and attach a child sprite
        this.childFlake1 = new Sprite('/demo/content/frostflake.png');
        this.childFlake1.x = -40;
        this.childFlake1.velocity.rotation = -5;
        this.parentFlake.addChild(this.childFlake1);

        // create and attach a child sprite
        this.childFlake2 = new Sprite('/demo/content/frostflake.png');
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
import FrostFlake from '../src/FrostFlake.js';
import Sprite from '../src/Positionables/Sprite.js';
import View from '../src/Views/View.js';
import MathUtil from '../src/Utility/MathUtil.js';

// This class demonstrates how to create sprites,
// add the sprites to the current view,
// and give them a few custom properties.
// This view also serves as a load test

export default class ManySpritesDemo extends View {

    constructor() {
        super();

        // Create 2000 sprites in a loop
        for (let i = 0; i < 2000; i++) {

            // create a new sprite, passing a path to an image file
            let s = new Sprite('/content/frostflake.png');

            // randomize the sprite's position
            s.x = MathUtil.randomInRange(-300, 300);
            s.y = MathUtil.randomInRange(-200, 200);

            // randomize the alpha (transparency)
            s.alpha = MathUtil.randomInRange(0.2, 0.85);

            // randomize the rotation velocity
            s.velocity.rotation = MathUtil.randomInRange(-3, 3);

            // add the sprite to this view so it is updated and rendered
            this.addChild(s);
        }

    }

    update() {
        super.update();

        // get the ave FPS from the GameTime instance and log it
        FrostFlake.Log.info(FrostFlake.Game.time.aveFps());
    }
}
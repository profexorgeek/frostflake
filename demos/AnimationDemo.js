import View from '../src/Views/View.js';
import Sprite from '../src/Positionables/Sprite.js';
import Frame from '../src/Drawing/Frame.js';
import Animation from '../src/Drawing/Animation.js';
import Data from '../src/Data/Data.js';

// This class demonstrates frame-based animation.
// The animation class stores a series of frames and
// frame timings. Setting an animation on a sprite
// overrides any existing frame or texture data.

export default class AnimationDemo extends View {

    async initialize() {
        await super.initialize();

        // load content used by this view
        await Data.loadImage('/content/spritesheet.png');

        // create an animation object with 8, 0.1 second frames
        let runCycle = new Animation();
        runCycle.texture = '/content/spritesheet.png';
        runCycle.frames = [
            new Frame(0, 160, 16, 16, 0.1),
            new Frame(16, 160, 16, 16, 0.1),
            new Frame(32, 160, 16, 16, 0.1),
            new Frame(48, 160, 16, 16, 0.1),
            new Frame(64, 160, 16, 16, 0.1),
            new Frame(80, 160, 16, 16, 0.1),
            new Frame(96, 160, 16, 16, 0.1),
            new Frame(112, 160, 16, 16, 0.1)
        ];

        // create a sprite and set the animation
        let sprite = new Sprite();
        sprite.animation = runCycle;

        // the sprite is only 16x16, increase it's scale
        // for easier visibility
        sprite.scale = 3;

        this.addChild(sprite);
    }
}
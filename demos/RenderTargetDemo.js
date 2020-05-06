import FrostFlake from '../src/FrostFlake.js';
import Sprite from '../src/Positionables/Sprite.js';
import View from '../src/Views/View.js';
import MathUtil from '../src/Utility/MathUtil.js';
import Data from '../src/Data/Data.js';

export default class RenderTargetDemo extends View {

    static TEXTURE = '/content/frostflake.png';
    static TARGETNAME = 'renderTarget';

    async initialize() {
        super.initialize();

        // array to hold all of our sprites
        let sprites = [];
        let spriteCount = 100000;

        // load the image we use for rendering our one-time texture
        await Data.loadImage(RenderTargetDemo.TEXTURE);

        // add a ton of sprites
        FrostFlake.Log.info(`Adding ${spriteCount} sprites for one-time render`);
        for (let i = 0; i < spriteCount; i++) {
            let s = new Sprite(RenderTargetDemo.TEXTURE);
            s.x = MathUtil.randomInRange(-300, 300);
            s.y = MathUtil.randomInRange(-200, 200);
            s.alpha = MathUtil.randomInRange(0.2, 0.85);
            s.scale = MathUtil.randomInRange(0.15, 0.2);
            s.position.rotation = MathUtil.randomInRange(-3, 3);

            // add the sprite to the array
            sprites.push(s);
        }

        // now render all of the sprites to a new custom image
        await FrostFlake.Game.renderer.renderCustomImage(RenderTargetDemo.TARGETNAME, sprites, 640, 480);

        // finally create a sprite that uses the custom image
        let renderedSprite = new Sprite(RenderTargetDemo.TARGETNAME);
        renderedSprite.velocity.rotation = MathUtil.randomInRange(-3, 3);
        this.addChild(renderedSprite);
    }

    update() {
        super.update();
    }

}
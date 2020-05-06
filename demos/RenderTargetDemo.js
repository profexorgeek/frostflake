import FrostFlake from '../src/FrostFlake.js';
import Sprite from '../src/Positionables/Sprite.js';
import View from '../src/Views/View.js';
import MathUtil from '../src/Utility/MathUtil.js';

export default class RenderTargetDemo extends View {

    static TEXTURE = '/content/frostflake.png';
    static TARGETNAME = 'renderTarget';

    constructor() {
        super();

        FrostFlake.Log.info("Starting render target demo...");

        // First ensure any textures required 
        FrostFlake.Game.renderer.loadTexture(RenderTargetDemo.TEXTURE, () => {
            FrostFlake.Log.info("Texture loaded, rendering");
            this.createSpriteTexture();
        });
    }

    createSpriteTexture() {

        // array to hold all of our sprites
        let sprites = [];
        let spriteCount = 100000;

        FrostFlake.Log.info(`Adding ${spriteCount} sprites for one-time render`);

        // create a lot of sprites, this is too many to
        // render every frame
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

        // render all sprites a single time to a new texture
        // this texture must be given a name
        FrostFlake.Log.info("Rendering...");
        FrostFlake.Game.renderer.renderToTexture(RenderTargetDemo.TARGETNAME, sprites, 640, 480);

        FrostFlake.Log.info("Rendered. Now setting render target as new sprite texture.");
        // create a new sprite referencing the one-time render target by name (instead of URL)
        let renderedSprite = new Sprite(RenderTargetDemo.TARGETNAME);

        // give it rotation velocity so you can see all sprites moving as one texture
        renderedSprite.velocity.rotation = MathUtil.randomInRange(-3, 3);

        this.addChild(renderedSprite);
    }

    update() {
        super.update();
    }

}
class RenderTargetDemo extends View {

    static TEXTURE = '/demo/content/frostflake.png';
    static TARGETNAME = 'renderTarget';

    constructor() {
        super();

        // First ensure any textures required 
        FrostFlake.Game.renderer.loadTexture(RenderTargetDemo.TEXTURE, () => {
            this.createSpriteTexture();
        });
    }

    createSpriteTexture() {

        // array to hold all of our sprites
        let sprites = [];

        // create a lot of sprites, this is too many to
        // render every frame
        for (var i = 0; i < 100000; i++) {
            var s = new Sprite(RenderTargetDemo.TEXTURE);
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
        FrostFlake.Game.renderer.renderToTexture(RenderTargetDemo.TARGETNAME, sprites, 640, 480);

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
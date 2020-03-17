class FrostFlake {

    static Game;

    timer;
    gameTime;
    fps;
    camera;
    canvas;
    renderer;
    view;
    background;


    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.view = new View();
        FrostFlake.Game = this;
    }

    start() {
        this.gameTime = new GameTime();
        this.camera = new Camera();
        this.renderer = new CanvasRenderer();

        let me = this;
        this.timer = window.setInterval( function () {
            me.update();
        }, 1000 / this.fps);
    }

    update() {
        this.gameTime.update();
        this.camera.update();
        this.renderer.draw(this.view.sprites, this.camera, this.canvas, this.background);
    }

}
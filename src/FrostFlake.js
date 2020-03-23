class FrostFlake {

    static Game;
    static Log;

    #timer;
    time;
    fps;
    camera;
    canvas;
    renderer;
    view;
    background;
    input;
    showDebug = false;

    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = new Log();

        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.input = new Input();
        this.view = new View();

        FrostFlake.Log.info("FrostFlake instance created...");
    }

    start() {
        FrostFlake.Log.info("Starting FrostFlake...");

        this.time = new GameTime();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.renderer = new CanvasRenderer(this.canvas);

        let me = this;
        this.#timer = window.setInterval( function () {
            me.update();
        }, 1000 / this.fps);
    }

    update() {
        this.time.update();
        this.camera.update();
        this.view.update();
        this.input.update();
        this.renderer.draw(this.view.children, this.camera, this.canvas, this.background);
    }

}
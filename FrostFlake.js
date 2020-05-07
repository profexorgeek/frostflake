import Input from './Input/Input.js';
import View from './Views/View.js';
import Audio from './Audio/Audio.js';
import Camera from './Positionables/Camera.js';
import CanvasRenderer from './Drawing/CanvasRenderer.js';
import Log from './Logging/Log.js';
import GameTime from './Utility/GameTime.js';
import Sprite from './Positionables/Sprite.js';
import Data from './Data/Data.js';
import EmbeddedImages from './Drawing/EmbeddedImages.js';

export default class FrostFlake {
    static Game;
    static Log;

    #timer;
    #view;

    time;
    fps;
    camera;
    canvas;
    renderer;
    background;
    input;
    audio;
    showDebug = false;
    defaultLoadingSprite;

    set view(newView) {
        newView.start();
        this.#view = newView;
    }

    get view() {
        return this.#view;
    }

    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = new Log();

        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.view = new View();
        this.input = new Input();
        this.audio = new Audio();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.camera.background = background;
        this.renderer = new CanvasRenderer(this.canvas);


        FrostFlake.Log.info("FrostFlake instance created...");
    }

    start() {
        FrostFlake.Log.info("Starting FrostFlake...");

        (async () => {
            await Data.loadImage(EmbeddedImages.Loading, "loadImage");
            this.defaultLoadingSprite = new Sprite("loadImage");

            this.time = new GameTime();
            let me = this;
            this.#timer = window.setInterval( function () {
                me.update();
            }, 1000 / this.fps);
        })();
    }

    update() {
        this.time.update();
        this.camera.update();

        if(this.view.initialized) {
            this.view.update();
        }
        else {
            this.defaultLoadingSprite.alpha = (Math.sin(this.time.gameTimeSeconds) + 1) / 2;
        }

        // Note: input must be updated after the view
        // this is because an input could come in and
        // be cleared before the view is updated and
        // can respond in the game loop
        this.input.update();

        if(this.view.initialized) {
            this.renderer.draw(this.view.children, this.camera, this.canvas, this.background);
        }
        else {
            this.renderer.draw([this.defaultLoadingSprite], this.camera, this.canvas, this.background);
        }
    }
}
import Input from './Input/Input';
import View from './Views/View';
import Audio from './Audio/Audio';
import Camera from './Positionables/Camera';
import CanvasRenderer from './Drawing/CanvasRenderer';
import Log from './Logging/Log';
import GameTime from './Utility/GameTime';
import Sprite from './Positionables/Sprite';
import Data from './Data/Data';
import EmbeddedImages from './Drawing/EmbeddedImages';

export default class FrostFlake {
    static Game;
    static Log;

    private _timer;
    private _view;

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
        this._view = newView;
    }

    get view() {
        return this._view;
    }

    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = Log;

        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.view = new View();
        this.input = new Input();
        this.audio = new Audio();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.camera.background = background;
        this.renderer = new CanvasRenderer(this.canvas, background);


        FrostFlake.Log.info("FrostFlake instance created...");
    }

    start() {
        FrostFlake.Log.info("Starting FrostFlake...");

        (async () => {
            await Data.loadImage(EmbeddedImages.Loading, "loadImage");
            this.defaultLoadingSprite = new Sprite("loadImage");

            this.time = new GameTime();
            let me = this;
            this._timer = window.setInterval( function () {
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
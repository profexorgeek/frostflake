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
import ILog from './Logging/ILog';

export default class FrostFlake {
    static Game: FrostFlake;
    static Log: ILog;

    private _timer: number;
    private _view: View;

    audio: Audio;
    camera: Camera;
    canvas: HTMLCanvasElement;
    defaultLoadingSprite: Sprite;
    fps: number;
    input: Input;
    renderer: CanvasRenderer;
    showDebug = false;
    time: GameTime;

    set view(newView: View) {
        if(this._view != null) {
            this._view.destroy();
        }
        
        newView.start();
        this._view = newView;
    }

    get view(): View {
        return this._view;
    }

    constructor(canvas: HTMLCanvasElement, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = new Log();

        this.canvas = canvas;
        this.fps = fps;
        this.input = new Input();
        this.audio = new Audio();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.camera.background = background;
        this.renderer = new CanvasRenderer(this.canvas);

        FrostFlake.Log.trace("FrostFlake instance created...");
    }

    start(): void {
        FrostFlake.Log.trace("Starting FrostFlake...");

        (async () => {
            await Data.loadImage(EmbeddedImages.Loading, "loadImage");
            this.defaultLoadingSprite = new Sprite("loadImage");

            this.time = new GameTime();
            const me = this;
            this._timer = window.setInterval( function () {
                me.update();
            }, 1000 / this.fps);
        })();
    }

    update(): void {
        this.time.update();
        this.camera.update();

        if(this.view != null && this.view.initialized) {
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

        if(this.view != null && this.view.initialized) {
            this.renderer.draw(this.view.children, this.camera);
        }
        else {
            this.renderer.draw([this.defaultLoadingSprite], this.camera);
        }
    }
}
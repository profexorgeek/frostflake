import FrostFlake from '../FrostFlake';
import Frame from './Frame';

export default class Animation {

    name                = '';
    frames: Array<Frame>        = [];
    texture             = '';
    playing            = true;
    looping            = true;
    frameIndex          = -1;

    private _secondsLeftInFrame = 0;

    get currentFrame(): Frame {
        return this.frames[this.frameIndex];
    }

    start(): void {
        if(this.frameIndex < 0) {
            this.restart();
        }
        this.playing = true;
    }

    stop(): void {
        this.playing = false;
    }

    restart(): void {
        this.frameIndex = 0;
        this._secondsLeftInFrame = this.currentFrame.seconds;
        this.playing = true;
    }

    update(): void {
        const delta: number = FrostFlake.Game.time.frameSeconds;

        if(this.playing && this.frames && this.frames.length > 1) {
            this._secondsLeftInFrame -= delta;

            while(this._secondsLeftInFrame <= 0) {
                if(this.frameIndex < this.frames.length - 1) {
                    this.frameIndex += 1;
                }
                else {
                    if(this.looping) {
                        this.frameIndex = 0;
                    }
                }

                this._secondsLeftInFrame += this.currentFrame.seconds;

                // we can never exit this loop because this frame is zero seconds long
                // force exit
                if(this._secondsLeftInFrame < 0 && this.currentFrame.seconds <= 0) {
                    break;
                }
            }
        }
    }
}
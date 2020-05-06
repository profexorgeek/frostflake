import FrostFlake from '../FrostFlake.js';

export default class Animation {
    name = '';
    frames = [];
    texture = '';
    playing = true;
    looping = true;

    frameIndex = -1;
    #secondsLeftInFrame = 0;

    get currentFrame() {
        return this.frames[this.frameIndex];
    }

    start() {
        if(this.frameIndex < 0) {
            this.restart();
        }
        this.playing = true;
    }

    stop() {
        this.playing = false;
    }

    restart() {
        this.frameIndex = 0;
        this.#secondsLeftInFrame = this.currentFrame.seconds;
        this.playing = true;
    }

    update() {
        let delta = FrostFlake.Game.time.frameSeconds;
        if(this.playing && this.frames && this.frames.length > 1) {
            this.#secondsLeftInFrame -= delta;

            while(this.#secondsLeftInFrame <= 0) {
                if(this.frameIndex < this.frames.length - 1) {
                    this.frameIndex += 1;
                }
                else {
                    if(this.looping) {
                        this.frameIndex = 0;
                    }
                }

                this.#secondsLeftInFrame += this.currentFrame.seconds;

                // we can never exit this loop because this frame is zero seconds long
                // force exit
                if(this.#secondsLeftInFrame < 0 && this.currentFrame.seconds <= 0) {
                    break;
                }
            }
        }
    }
}
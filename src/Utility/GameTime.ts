export default class GameTime {

    // number of milliseconds that can elapse between
    // frames before the GameTime will reset the delta
    // to zero. Prevents runaway game behavior if major
    // hiccups happen
    static readonly MAX_FRAME_DELTA: number = 500;
    static readonly FPS_SAMPLES: number = 120;

    startTime: Date                 = new Date();
    lastFrameTime: Date             = new Date();
    frameSeconds: number            = 0;
    gameTimeSeconds: number         = 0;
    recentFrames: Array<number>     = [];

    constructor() {

    }

    update(): void {
        const lastFrame = this.lastFrameTime.getTime();
        const currentFrame = new Date();
        const frameDelta = currentFrame.getTime() - lastFrame;

        if(frameDelta < GameTime.MAX_FRAME_DELTA) {
            // convert delta (milliseconds) into seconds
            this.frameSeconds = frameDelta / 1000;
        }
        else {
            this.frameSeconds = 0;
        }

        this.gameTimeSeconds += this.frameSeconds;
        this.lastFrameTime = currentFrame;

        this.recentFrames.push(this.frameSeconds);
        if(this.recentFrames.length > GameTime.FPS_SAMPLES) {
            this.recentFrames.shift()
        }
    }

    aveFps(): number {
        let ave: number = 0;
        for(let i = 0; i < this.recentFrames.length; i++) {
            ave += this.recentFrames[i];
        }
        return 1 / (ave / this.recentFrames.length);
    }
}
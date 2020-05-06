export default class GameTime {

    // number of milliseconds that can elapse between
    // frames before the GameTime will reset the delta
    // to zero. Prevents runaway game behavior if major
    // hiccups happen
    static MAX_FRAME_DELTA = 500;
    static FPS_SAMPLES = 120;

    startTime;
    lastFrameTime;
    frameSeconds;
    gameTimeSeconds;
    recentFrames = [];

    constructor() {
        this.startTime = new Date();
        this.lastFrameTime = new Date();
        this.frameSeconds = 0;
        this.gameTimeSeconds = 0;
    }

    update() {
        let lastFrame = this.lastFrameTime.getTime();
        let currentFrame = new Date();
        let frameDelta = currentFrame - lastFrame;

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

    aveFps() {
        let ave = 0;
        for(let i = 0; i < this.recentFrames.length; i++) {
            ave += this.recentFrames[i];
        }
        return 1 / (ave / this.recentFrames.length);
    }
}
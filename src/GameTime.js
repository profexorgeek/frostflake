class GameTime {

    // number of milliseconds that can elapse between
    // frames before the GameTime will reset the delta
    // to zero. Prevents runaway game behavior if major
    // hiccups happen
    static MAX_FRAME_DELTA = 500;

    startTime;
    lastFrameTime;
    frameSeconds;
    gameTimeSeconds;

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
    }
}
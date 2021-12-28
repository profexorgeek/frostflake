export default class Frame {
    top: number         = 0;
    left: number        = 0;
    width: number       = 0;
    height: number      = 0;
    seconds: number     = 0;

    constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0, seconds: number = 0) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.seconds = seconds;
    }
}
export default class Frame {
    top = 0;
    left = 0;
    width = 0;
    height = 0;
    seconds = 0;

    constructor(left = 0, top = 0, width = 0, height = 0, seconds = 0) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.seconds = seconds;
    }
}
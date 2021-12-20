

// Things learned in conversion
// - Use bang varName!:type to avoid required init in constructor

export default class FrostFlake {

    #timer!: number;                    // game loop interval timer handle
    canvas: HTMLCanvasElement;          // canvas object where game will be drawn
    fps: number;                        // frame rate of the game
    background: string;                 // background color of the canvas 


    constructor(canvas: HTMLCanvasElement, fps: number = 30, background: string = "rgb(0,0,0)") {
        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
    }

    start() {
        (async () => {
            // load data here

            // start the timer
            const me = this;
            this.#timer = window.setInterval( function () {
                me.update();
            }, 1000 / this.fps);
        })();
    }

    update() {
        console.log("Update was called.");
    }

}
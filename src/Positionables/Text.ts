import Positionable from "./Positionable";

export default class Text extends Positionable {
    font: string            = '24px sans-serif'
    content: string         = 'Hello world';
    fillStyle: string       = 'white';
    strokeStyle: string     = 'black';
    strokeWeight: number    = 1;
    textAlign: string       = 'start';
    textBaseline: string    = 'alphabetic';
    textDirection: string   = 'ltf';
    ignoreRotation: boolean = false;

    constructor(str: string) {
        super();
        this.content = str;
    }
}
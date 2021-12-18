import Positionable from "./Positionable";

export default class Text extends Positionable {
    font = '24px sans-serif'
    content = 'Hello world';
    fillStyle = 'white';
    strokeStyle = 'black';
    strokeWeight = 1;
    textAlign = 'start';
    textBaseline = 'alphabetic';
    textDirection = 'ltf';
    ignoreRotation = false;

    constructor(str) {
        super();

        this.content = str;
    }
}
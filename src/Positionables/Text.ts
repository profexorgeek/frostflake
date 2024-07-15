import Positionable from "./Positionable";

export default class Text extends Positionable {

    font = '24px sans-serif'
    content = 'Hello world';
    fillStyle = 'white';
    strokeStyle = 'black';
    strokeWeight = 1;
    textAlign: CanvasTextAlign = 'start';
    textBaseline: CanvasTextBaseline = 'alphabetic';
    textDirection: CanvasDirection = 'ltr';

    constructor(str: string) {
        super();
        this.content = str;
    }
}
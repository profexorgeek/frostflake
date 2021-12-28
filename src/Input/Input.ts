import FrostFlake from '../FrostFlake';
import Cursor from './Cursor'
import Mouse from './Mouse';
import Keys from './Keys';

export default class Input {

    cursor;

    private _keysDown = {};
    private _keysPushed = {};
    private _buttonsDown = {};
    private _buttonsPushed = {};

    constructor() {
        this.cursor = new Cursor();

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));        

        FrostFlake.Game.canvas.addEventListener("mouseenter", (e) => this.onEnterCanvas(e));
        FrostFlake.Game.canvas.addEventListener("mouseleave", (e) => this.onExitCanvas(e));

        // disable context menu on the canvas so we can use right click
        FrostFlake.Game.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    update() {
        this.cursor.update();

        // clear pushed keys
        for(let key in this._keysPushed) {
            this._keysPushed[key] = false;
        }

        // clear buttons pushed array
        for(let btn in this._buttonsPushed) {
            this._buttonsPushed[btn] = false;
        }
    }

    keyDown(charCode) {
        let keyName = Keys["char" + charCode];
        return this._keysDown[keyName] === true;
    }

    keyPushed(charCode) {
        let keyName = Keys["char" + charCode];
        return this._keysPushed[keyName] === true;
    }

    buttonDown(btnCode) {
        let btnName = Mouse["button" + btnCode];
        return this._buttonsDown[btnName] === true;
    }

    buttonPushed(btnCode) {
        let btnName = Mouse["button" + btnCode];
        return this._buttonsPushed[btnName] === true;
    }

    stopPropagation(e) {
        // HACK: browsers require a user interaction
        // before they can play audio. When we stop
        // event propagation, we also make sure audio
        // is enabled
        FrostFlake.Game.audio.enable();

        if(this.cursor.isInFrame) {
            e.preventDefault();
        }
    }

    // EVENT HANDLERS
    onEnterCanvas(e) {
        this.cursor.isInFrame = true;
    }

    onExitCanvas(e) {
        this.cursor.isInFrame = false;
    }

    onMouseMove(e) {
        this.cursor.setHardwarePosition(e.offsetX, e.offsetY);
    }

    onMouseDown(e) {
        let btnName = Mouse["button" + e.which];
        this._buttonsDown[btnName] = true;
        this.stopPropagation(e);
    }

    onMouseUp(e) {
        let btnName = Mouse["button" + e.which];
        this._buttonsDown[btnName] = false;
        this._buttonsPushed[btnName] = true;
        this.stopPropagation(e);
    }


    onKeyDown(e) {
        let keyName = Keys["char" + e.keyCode];
        this._keysDown[keyName] = true;
        this.stopPropagation(e);
    }

    onKeyUp(e) {
        let keyName = Keys["char" + e.keyCode];
        this._keysDown[keyName] = false;
        this._keysPushed[keyName] = true;
        this.stopPropagation(e);
    }
}
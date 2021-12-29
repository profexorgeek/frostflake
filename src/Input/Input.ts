import FrostFlake from '../FrostFlake';
import Cursor from './Cursor'
import Mouse from './Mouse';
import Keys from './Keys';

export default class Input {

    cursor: Cursor;

    private _keysDown: Map<string, boolean>         = new Map<string, boolean>();
    private _keysPushed: Map<string, boolean>       = new Map<string, boolean>();
    private _buttonsDown: Map<string, boolean>      = new Map<string, boolean>();
    private _buttonsPushed: Map<string, boolean>    = new Map<string, boolean>();

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

    update(): void {
        this.cursor.update();

        // clear pushed keys
        for(const key in this._keysPushed) {
            this._keysPushed[key] = false;
        }

        // clear buttons pushed array
        for(const btn in this._buttonsPushed) {
            this._buttonsPushed[btn] = false;
        }
    }

    keyDown(charCode: number): boolean {
        const keyName = Keys["char" + charCode];
        return this._keysDown[keyName] === true;
    }

    keyPushed(charCode: number): boolean {
        const keyName = Keys["char" + charCode];
        return this._keysPushed[keyName] === true;
    }

    buttonDown(btnCode: number): boolean {
        const btnName = Mouse["button" + btnCode];
        return this._buttonsDown[btnName] === true;
    }

    buttonPushed(btnCode: number): boolean {
        const btnName = Mouse["button" + btnCode];
        return this._buttonsPushed[btnName] === true;
    }



    private stopPropagation(e: Event): void {
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
    private onEnterCanvas(): void {
        this.cursor.isInFrame = true;
    }

    private onExitCanvas(): void {
        this.cursor.isInFrame = false;
    }

    private onMouseMove(e: MouseEvent): void {
        this.cursor.setHardwarePosition(e.offsetX, e.offsetY);
    }

    private onMouseDown(e: MouseEvent): void {
        const btnName = Mouse["button" + e.button];
        this._buttonsDown[btnName] = true;
        this.stopPropagation(e);
    }

    private onMouseUp(e: MouseEvent) {
        const btnName = Mouse["button" + e.button];
        this._buttonsDown[btnName] = false;
        this._buttonsPushed[btnName] = true;
        this.stopPropagation(e);
    }

    private onKeyDown(e: KeyboardEvent): void {
        // NOTE: official MDN docs recommend against using "which"
        // but none of the other properties return the same thing
        // and have less reliable support! 
        const keyName = Keys["char" + e.which];
        this._keysDown[keyName] = true;
        this.stopPropagation(e);
    }

    private onKeyUp(e: KeyboardEvent): void {
        // NOTE: official MDN docs recommend against using "which"
        // but none of the other properties return the same thing
        // and have less reliable support!
        const keyName = Keys["char" + e.which];
        this._keysDown[keyName] = false;
        this._keysPushed[keyName] = true;
        this.stopPropagation(e);
    }
}
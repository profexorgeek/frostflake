import FrostFlake from '../FrostFlake';
import Cursor from './Cursor'
import {Keys, MouseButtons} from './Codes';

export type InputMap = {[key:number]: string};

export default class Input {

    cursor: Cursor;

    private _keysDown: Map<string, boolean>         = new Map<string, boolean>();
    private _keysPushed: Map<string, boolean>       = new Map<string, boolean>();
    private _buttonsDown: Map<string, boolean>      = new Map<string, boolean>();
    private _buttonsPushed: Map<string, boolean>    = new Map<string, boolean>();

    private _buttonMap: InputMap = 
    {
        0: "Left",
        1: "Middle",
        2: "Right"
    };

    private _keyMap: InputMap = 
    {
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "PauseBreak",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        45: "Insert",
        46: "Delete",
        48: "Oem0",
        49: "Oem1",
        50: "Oem2",
        51: "Oem3",
        52: "Oem4",
        53: "Oem5",
        54: "Oem6",
        55: "Oem7",
        56: "Oem8",
        57: "Oem9",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        91: "Windows",
        93: "RightClick",
        96: "Num0",
        97: "Num1",
        98: "Num2",
        99: "Num3",
        100: "Num4",
        101: "Num5",
        102: "Num6",
        103: "Num7",
        104: "Num8",
        105: "Num9",
        106: "NumStar",
        107: "NumPlus",
        109: "NumMinus",
        110: "NumPeriod",
        111: "NumSlash",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        182: "MyComputer",
        183: "MyCalculator",
        186: "Semicolon",
        187: "Equal",
        188: "Comma",
        189: "Dash",
        190: "Period",
        191: "ForwardSlash",
        192: "Tick",
        219: "LeftBracket",
        220: "Backslash",
        221: "RightBracket",
        222: "SingleQuote"
    }

    constructor() {
        this.cursor = new Cursor();

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));        

        FrostFlake.Game.canvas.addEventListener("mouseenter", () => this.onEnterCanvas());
        FrostFlake.Game.canvas.addEventListener("mouseleave", () => this.onExitCanvas());

        // disable context menu on the canvas so we can use right click
        FrostFlake.Game.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    update(): void {
        this.cursor.update();

        // clear pushed keys
        for(const [key, value] of this._keysPushed) {
            this._keysPushed.set(key, false);
        }

        // clear buttons pushed array
        for(const [key, value] of this._buttonsPushed) {
            this._buttonsPushed.set(key, false);
        }
    }

    getKeyForCode(code: number) : string | undefined
    {
        return this._keyMap[code];
    }

    getCodeForKey(key: keyof typeof Keys) : number | undefined
    {
        return Keys[key];
    }

    getButtonForCode(code: number): string | undefined
    {
        return this._buttonMap[code];
    }

    getCodeForButton(button: keyof typeof MouseButtons): number | undefined
    {
        return MouseButtons[button];
    }

    keyDown(charCode: number): boolean {
        const keyName = this.getKeyForCode(charCode);
        return this._keysDown.get(keyName) === true;
    }

    keyPushed(charCode: number): boolean {
        const keyName = this.getKeyForCode(charCode);
        return this._keysPushed.get(keyName) === true;
    }

    buttonDown(btnCode: number): boolean {
        const btnName = this.getButtonForCode(btnCode);
        return this._buttonsDown.get(btnName) === true;
    }

    buttonPushed(btnCode: number): boolean {
        const btnName = this.getButtonForCode(btnCode);
        return this._buttonsPushed.get(btnName) === true;
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
        const btnName = this.getButtonForCode(e.button);
        this._buttonsDown.set(btnName, true);
        this.stopPropagation(e);
    }

    private onMouseUp(e: MouseEvent) {
        const btnName = this.getButtonForCode(e.button);
        this._buttonsDown.set(btnName, false);
        this._buttonsPushed.set(btnName, true);
        this.stopPropagation(e);
    }

    private onKeyDown(e: KeyboardEvent): void {
        // NOTE: official MDN docs recommend against using "which"
        // but none of the other properties return the same thing
        // and have less reliable support! 
        const keyName = this.getKeyForCode(e.which);
        this._keysDown.set(keyName, true);
        this.stopPropagation(e);
    }

    private onKeyUp(e: KeyboardEvent): void {
        // NOTE: official MDN docs recommend against using "which"
        // but none of the other properties return the same thing
        // and have less reliable support!
        const keyName = this.getKeyForCode(e.which);
        this._keysDown.set(keyName, false);
        this._keysPushed.set(keyName, true);
        this.stopPropagation(e);
    }
}
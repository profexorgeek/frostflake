class Input {

    cursor;

    #keysDown = {};
    #keysPushed = {};
    #buttonsDown = {};
    #buttonsPushed = {};

    constructor() {
        this.cursor = new Cursor();

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));

        FrostFlake.Game.canvas.addEventListener("mouseenter", (e) => this.onEnterCanvas(e));
        FrostFlake.Game.canvas.addEventListener("mouseleave", (e) => this.onExitCanvas(e));
    }

    update() {
        this.cursor.update();

        // clear pushed keys
        for(let key in this.#keysPushed) {
            this.#keysPushed[key] = false;
        }

        // clear buttons pushed array
        for(let btn in this.#buttonsPushed) {
            this.#buttonsPushed[btn] = false;
        }
    }

    keyDown(charCode) {
        let keyName = Keys["char" + charCode];
        return this.#keysDown[keyName] === true;
    }

    keyPushed(charCode) {
        let keyName = Keys["char" + charCode];
        return this.#keysPushed[keyName] === true;
    }

    buttonDown(btnCode) {
        let btnName = Mouse["button" + btnCode];
        return this.#buttonsDown[btnName] === true;
    }

    buttonPushed(btnCode) {
        let btnName = Mouse["button" + btnCode];
        return this.#buttonsPushed[btnName] === true;
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
        this.#buttonsDown[btnName] = true;
        this.stopPropagation(e);
    }

    onMouseUp(e) {
        let btnName = Mouse["button" + e.which];
        this.#buttonsDown[btnName] = false;
        this.#buttonsPushed[btnName] = true;
        this.stopPropagation(e);
    }


    onKeyDown(e) {
        let keyName = Keys["char" + e.keyCode];
        this.#keysDown[keyName] = true;
        this.stopPropagation(e);
    }

    onKeyUp(e) {
        let keyName = Keys["char" + e.keyCode];
        this.#keysDown[keyName] = false;
        this.#keysPushed[keyName] = true;
        this.stopPropagation(e);
    }
}
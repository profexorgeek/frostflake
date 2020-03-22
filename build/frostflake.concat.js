class GameTime {

    // number of milliseconds that can elapse between
    // frames before the GameTime will reset the delta
    // to zero. Prevents runaway game behavior if major
    // hiccups happen
    static MAX_FRAME_DELTA = 500;

    startTime;
    lastFrameTime;
    frameSeconds;
    gameTimeSeconds;

    constructor() {
        this.startTime = new Date();
        this.lastFrameTime = new Date();
        this.frameSeconds = 0;
        this.gameTimeSeconds = 0;
    }

    update() {
        let lastFrame = this.lastFrameTime.getTime();
        let currentFrame = new Date();
        let frameDelta = currentFrame - lastFrame;

        if(frameDelta < GameTime.MAX_FRAME_DELTA) {

            // convert delta (milliseconds) into seconds
            this.frameSeconds = frameDelta / 1000;
        }
        else {
            this.frameSeconds = 0;
        }

        this.gameTimeSeconds += this.frameSeconds;
        this.lastFrameTime = currentFrame;
    }
}
class MathUtil {

    static invert(num) {
        return 0 - num;
    }

    static normalizeAngle(angle) {
        const twoPi = Math.PI * 2;

        while(angle < 0) {
            angle += twoPi;
        }

        while(angle > twoPi) {
            angle -= twoPi;
        }

        return angle;
    }

    static angleTo(v1, v2) {
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        return MathUtil.normalizeAngle(Math.atan2(dy, dx));
    }

    static randomInRange(min, max) {
        const range = max - min;
        const val = Math.random() * range;
        return val + min;
    }

    static vectorSubtract(v1, v2) {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        return {x: dx, y: dy};
    }

    static length(x, y) {
        let len = Math.pow(x, 2) + Math.pow(y, 2);
        return Math.abs(Math.sqrt(len));
    }

    static clamp(val, min, max) {
        val = Math.min(max, val);
        val = Math.max(min, val);
        return val;
    }
}
class Sprite {

    x = 0;
    y = 0;
    rotation = 0;
    velocityX = 0;
    velocityY = 0;
    rotationVelocity = 0;
    accelX = 0
    accelY = 0;
    alpha = 1;
    drag = 0;
    layer = 0;
    parent = null;
    children = [];
    frame = null;
    texture = null;
    animation = null;
    #collisionShape = null;

    set collision(shape) {
        if(this.#collisionShape) {
            this.#collisionShape.parent = null;
        }

        this.#collisionShape = shape;
        this.#collisionShape.parent = this;
    }

    get collision() {
        return this.#collisionShape;
    }

    constructor(texture = null) {
        let me = this;
        this.texture = texture;
        this.collision = new Circle();

        // call runtime-appended logic
        this.customConstruct();
    }

    addChild(sprite) {
        sprite.parent = this;
        this.children.push(sprite);
    }

    removeChild(sprite) {
        let i = this.children.indexOf(sprite);
        if(i > -1) {
            this.children.splice(i, 1);
        }
        sprite.parent = null;
    }

    attach(sprite) {
        sprite.addChild(this);
    }

    detach() {
        if(this.parent != null) {
            this.parent.removeChild(this);
        }
    }

    getAbsolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.getAbsolutePosition();
            let magnitude = MathUtil.length(this.x, this.y);
            absPos.x = Math.cos(parentAbsPos.rotation) * magnitude + parentAbsPos.x;
            absPos.y = Math.sin(parentAbsPos.rotation) * magnitude + parentAbsPos.y;
            absPos.rotation = parentAbsPos.rotation + this.rotation;
        }
        else {
            absPos.x = this.x;
            absPos.y = this.y;
            absPos.rotation = this.rotation;
        }

        return absPos;
    }

    update() {
        let delta = FrostFlake.Game.time.frameSeconds;

        let deltaSquaredHalved = delta * delta / 2;

        this.x += (this.velocityX * delta) + (this.accelX * deltaSquaredHalved);
        this.y += (this.velocityY * delta) + (this.accelY * deltaSquaredHalved);
        
        this.velocityX += (this.accelX * delta) - (this.drag * this.velocityX * delta);
        this.velocityY += (this.accelY * delta) - (this.drag * this.velocityY * delta);

        this.rotation += this.rotationVelocity * delta;
        this.rotation = MathUtil.normalizeAngle(this.rotation);

        // sort children by layer
        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }

        // play animation
        if(this.animation) {
            this.animation.update();
            this.texture = this.animation.texture;
            this.frame = this.animation.currentFrame();
        }

        // call runtime-appended logic
        this.customUpdate();
    }

    // These methods allow custom logic to be appended to the constructor
    // and update methods without overwriting the core logic
    customConstruct() {}
    customUpdate() {}
}
class Camera {
    x;
    y;

    get width() {
        return FrostFlake.Game.canvas.width;
    }

    get height() {
        return FrostFlake.Game.canvas.height;
    }

    get right() {
        return this.x + (FrostFlake.Game.canvas.width / 2);
    }

    get left() {
        return this.x - (FrostFlake.Game.canvas.width / 2);
    }

    get top() {
        return this.y + (FrostFlake.Game.canvas.height / 2);
    }

    get bottom() {
        return this.y - (FrostFlake.Game.canvas.height / 2);
    }

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update() {
    }
}
class CanvasRenderer {

    #textureCache = {};

    // TODO: what about clearing texture cache
    // and images added to the DOM?

    checkAndPreloadSprites(sprites) {
        let preloaded = true;
        for(let i = 0; i < sprites.length; i++) {
            if(!this.textureLoaded(sprites[i].texture)) {
                preloaded = false;
            }

            if(sprites[i].children.length > 0) {
                let childrenLoaded = this.checkAndPreloadSprites(sprites[i].children);
                if(childrenLoaded === false) {
                    preloaded = false;
                }
            }
        }

        return preloaded;
    }
    
    draw(sprites, camera, canvas, background = "rgb(0, 0, 0)") {
        let ctx = canvas.getContext("2d");
        let transX = MathUtil.invert(camera.x) + (ctx.canvas.width / 2);
        let transY = camera.y + (ctx.canvas.height / 2);

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        ctx.translate(transX, transY);
        for(let i = 0; i < sprites.length; i++) {
            this.drawSprite(sprites[i], ctx);
        }
        ctx.restore();
    }

    drawSprite(sprite, ctx) {
        let transX = sprite.x;
        let transY = MathUtil.invert(sprite.y);
        let transRot = -sprite.rotation;
        let alpha = sprite.alpha;

        ctx.save();

        ctx.translate(transX, transY);
        ctx.rotate(transRot);
        ctx.globalAlpha = alpha;

        // draw texture
        if(this.textureLoaded(sprite.texture)) {
            let tex = this.#textureCache[sprite.texture];
            let frame = sprite.frame;

            // if null frame, default to sprite width
            if(frame == null) {
                frame = new Frame();
                frame.width = tex.width;
                frame.height = tex.height;
            }

            ctx.drawImage(
                tex,
                frame.left,
                frame.top,
                frame.width,
                frame.height,
                frame.width / -2,
                frame.height / -2,
                frame.width,
                frame.height
            );

            // draw debug visualizations
            if(FrostFlake.Game.showDebug) {
                ctx.strokeStyle = "rgb(255, 0, 0)";
                ctx.strokeRect(-frame.width / 2, -frame.height / 2, frame.width, frame.height);
            }
        }
        // texture hasn't been loaded, load it now
        else {
            this.loadTexture(sprite.texture);
        }

        // reset alpha
        ctx.globalAlpha = 1;

        // recurse on children
        if(sprite.children.length > 0) {
            for(let i = 0; i < sprite.children.length; i++) {
                this.drawSprite(sprite.children[i], ctx);
            }
        }

        // restore context
        ctx.restore();
    }

    textureLoaded(url) {
        if(url !== null &&
            url in this.#textureCache &&
            this.#textureCache[url] instanceof HTMLImageElement === true) {
                return true;
            }
        return false;
    }

    loadTexture(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // return if we've already started loading this
        if(url in this.#textureCache) {
            return;
        }

        // insert placeholder so images aren't loaded
        // multiple times if load requests are fired quickly
        me.#textureCache[url] = "...";
        
        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(xhr.response);
                    me.#textureCache[url] = img;
                }
                else {
                    throw `Failed to load ${url}`;
                }
            }
        });

        xhr.responseType = 'blob';
        xhr.open('GET', url, true);
        xhr.send();
    }
}
class Frame {
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
class Animation {
    name = '';
    frames = [];
    texture = '';
    playing = true;
    looping = true;

    frameIndex = -1;
    #secondsLeftInFrame = 0;

    currentFrame() {
        return this.frames[this.frameIndex];
    }

    start() {
        if(this.frameIndex < 0) {
            this.restart();
        }
        this.playing = true;
    }

    stop() {
        this.playing = false;
    }

    restart() {
        this.frameIndex = 0;
        this.#secondsLeftInFrame = this.currentFrame().seconds;
        this.playing = true;
    }

    update() {
        let delta = FrostFlake.Game.time.frameSeconds;
        if(this.playing && this.frames && this.frames.length > 1) {
            this.#secondsLeftInFrame -= delta;

            while(this.#secondsLeftInFrame <= 0) {
                if(this.frameIndex < this.frames.length - 1) {
                    this.frameIndex += 1;
                }
                else {
                    if(this.looping) {
                        this.frameIndex = 0;
                    }
                }

                this.#secondsLeftInFrame += this.currentFrame().seconds;

                // TODO: check to make sure we're not stuck in this loop if
                // frames have non-sane second values?
            }
        }
    }


}
class Shape {
    x = 0;
    y = 0;
    rotation;
    parent = null;

    constructor() {}

    getAbsolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.getAbsolutePosition();
            let magnitude = MathUtil.length(this.x, this.y);
            absPos.x = Math.cos(parentAbsPos.rotation) * magnitude + parentAbsPos.x;
            absPos.y = Math.sin(parentAbsPos.rotation) * magnitude + parentAbsPos.y;
            absPos.rotation = parentAbsPos.rotation + this.rotation;
        }
        else {
            absPos.x = this.x;
            absPos.y = this.y;
            absPos.rotation = this.rotation;
        }

        return absPos;
    }
}
class Circle extends Shape {
    radius;

    constructor(radius = 16) {
        super();
        this.radius = radius;
    }

    collidesWith(shape, repositionOutside = false) {
        if(shape instanceof Circle) {
            let shape1Position = this.getAbsolutePosition();
            let shape2Position = shape.getAbsolutePosition();
            let delta = MathUtil.vectorSubtract(shape1Position, shape2Position);
            let distanceApart = MathUtil.length(delta.x, delta.y);
            let collideDistance = this.radius + shape.radius;

            // circles are colliding if the sum of their radii is
            // smaller than their distance apart
            let didCollide = distanceApart < collideDistance;

            if(didCollide && repositionOutside) {
                let overlapAmount = collideDistance - distanceApart;
                let collisionAngle = MathUtil.angleTo(shape1Position, shape2Position);
                let reverseAngle = MathUtil.normalizeAngle(collisionAngle - Math.PI);

                // to stop colliding we need to move in the reverse direction
                // by the magnitude of the overlap amount
                if(this.parent) {
                    this.parent.x += Math.cos(reverseAngle) * overlapAmount;
                    this.parent.y += Math.sin(reverseAngle) * overlapAmount;
                }
                else {
                    this.x += Math.cos(reverseAngle) * overlapAmount;
                    this.y += Math.cos(reverseAngle) * overlapAmount;
                }
            }

            return didCollide;
        }
    }
}
class View {
    sprites = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update();
        }
    }

    renderToTexture(width, height) {
        let camera = new Camera();
        let target = document.createElement('canvas');
        target.width = width;
        target.height = height;
        FrostFlake.Game.renderer.draw(this.sprites, camera, target, "rgba(0,0,0,0)");
        return target.toDataURL();
    }

    addSprite(sprite) {
        if(this.sprites.indexOf(sprite) > -1) {
            throw "Sprite has already been added to view."
        }

        this.sprites.push(sprite);
    }

    removeSprite(sprite) {
        let i = this.sprites.indexOf(sprite);
        if(i > -1) {
            this.sprites.splice(i, 1);
        }
    }

    clearSprites() {
        this.sprites = [];
    }
}
class Log {
    #level;

    #levels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    #reverseLevels = {
        0: "debug",
        1: "info",
        2: "warn",
        3: "error"
    };

    constructor(level = "debug") {
        this.setLevel(level);
    }

    setLevel(level) {
        if(level in this.#levels) {
            this.#level = level;
        }
        else {
            throw `${level} is not a valid debug level`;
        }
    }

    debug(msg) {
        this.write(this.#levels.debug, msg);
    }

    info(msg) {
        this.write(this.#levels.info, msg);
    }

    warn(msg) {
        this.write(this.#levels.warn, msg);
    }

    error(msg) {
        this.write(this.#levels.error, msg);
    }

    write(level, msg) {
        if(this.#levels[this.#level] < level) {
            let levelName = this.#reverseLevels[level];
            console.log(`${levelName}: ${msg}`);
        }
    }
}
class Cursor {
    x;
    y;
    changeX;
    changeY;
    worldX;
    worldY;
    isInFrame;

    update() {
        this.worldX = FrostFlake.Game.camera.x + this.x;
        this.worldY = FrostFlake.Game.camera.y + this.y;
    }

    setHardwarePosition(x, y) {
        let cursorX = x - (FrostFlake.Game.canvas.width / 2);
        let cursorY = MathUtil.invert(y) + (FrostFlake.Game.canvas.height / 2);
        this.changeX = this.x - cursorX;
        this.changeY = this.y - cursorY;
        this.x = cursorX;
        this.y = cursorY;
    }
}
class Keys {
    static Backspace = 8;
    static Tab = 9;
    static Enter = 13;
    static Shift = 16;
    static Ctrl = 17;
    static Alt = 18;
    static PauseBreak = 19;
    static CapsLock = 20;
    static Esc = 27;
    static Space = 32;
    static PageUp = 33;
    static PageDown = 34;
    static End = 35;
    static Home = 36;
    static Left = 37;
    static Up = 38;
    static Right = 39;
    static Down = 40;
    static Insert = 45;
    static Delete = 46;
    static Oem0 = 48;
    static Oem1 = 49;
    static Oem2 = 50;
    static Oem3 = 51;
    static Oem4 = 52;
    static Oem5 = 53;
    static Oem6 = 54;
    static Oem7 = 55;
    static Oem8 = 56;
    static Oem9 = 57;
    static A = 65;
    static B = 66;
    static C = 67;
    static D = 68;
    static E = 69;
    static F = 70;
    static G = 71;
    static H = 72;
    static I = 73;
    static J = 74;
    static K = 75;
    static L = 76;
    static M = 77;
    static N = 78;
    static O = 79;
    static P = 80;
    static Q = 81;
    static R = 82;
    static S = 83;
    static T = 84;
    static U = 85;
    static V = 86;
    static W = 87;
    static X = 88;
    static Y = 89;
    static Z = 90;
    static Windows = 91;
    static RightClick = 93;
    static Num0 = 96;
    static Num1 = 97;
    static Num2 = 98;
    static Num3 = 99;
    static Num4 = 100;
    static Num5 = 101;
    static Num6 = 102;
    static Num7 = 103;
    static Num8 = 104;
    static Num9 = 105;
    static NumStar = 106;
    static NumPlus = 107;
    static NumMinus = 109;
    static NumPeriod = 110;
    static NumSlash = 111;
    static F1 = 112;
    static F2 = 113;
    static F3 = 114;
    static F4 = 115;
    static F5 = 116;
    static F6 = 117;
    static F7 = 118;
    static F8 = 119;
    static F9 = 120;
    static F10 = 121;
    static F11 = 122;
    static F12 = 123;
    static NumLock = 144;
    static ScrollLock = 145;
    static MyComputer = 182;
    static MyCalculator = 183;
    static Semicolon = 186;
    static Equal = 187;
    static Comma = 188;
    static Dash = 189;
    static Period = 190;
    static ForwardSlash = 191;
    static Tick = 192;
    static LeftBracket = 219;
    static Backslash = 220;
    static RightBracket = 221;
    static SingleQuote = 222;
    static char8 = "Backspace";
    static char9 = "Tab";
    static char13 = "Enter";
    static char16 = "Shift";
    static char17 = "Ctrl";
    static char18 = "Alt";
    static char19 = "PauseBreak";
    static char20 = "CapsLock";
    static char27 = "Esc";
    static char32 = "Space";
    static char33 = "PageUp";
    static char34 = "PageDown";
    static char35 = "End";
    static char36 = "Home";
    static char37 = "Left";
    static char38 = "Up";
    static char39 = "Right";
    static char40 = "Down";
    static char45 = "Insert";
    static char46 = "Delete";
    static char48 = "Oem0";
    static char49 = "Oem1";
    static char50 = "Oem2";
    static char51 = "Oem3";
    static char52 = "Oem4";
    static char53 = "Oem5";
    static char54 = "Oem6";
    static char55 = "Oem7";
    static char56 = "Oem8";
    static char57 = "Oem9";
    static char65 = "A";
    static char66 = "B";
    static char67 = "C";
    static char68 = "D";
    static char69 = "E";
    static char70 = "F";
    static char71 = "G";
    static char72 = "H";
    static char73 = "I";
    static char74 = "J";
    static char75 = "K";
    static char76 = "L";
    static char77 = "M";
    static char78 = "N";
    static char79 = "O";
    static char80 = "P";
    static char81 = "Q";
    static char82 = "R";
    static char83 = "S";
    static char84 = "T";
    static char85 = "U";
    static char86 = "V";
    static char87 = "W";
    static char88 = "X";
    static char89 = "Y";
    static char90 = "Z";
    static char91 = "Windows";
    static char93 = "RightClick";
    static char96 = "Num0";
    static char97 = "Num1";
    static char98 = "Num2";
    static char99 = "Num3";
    static char100 = "Num4";
    static char101 = "Num5";
    static char102 = "Num6";
    static char103 = "Num7";
    static char104 = "Num8";
    static char105 = "Num9";
    static char106 = "NumStar";
    static char107 = "NumPlus";
    static char109 = "NumMinus";
    static char110 = "NumPeriod";
    static char111 = "NumSlash";
    static char112 = "F1";
    static char113 = "F2";
    static char114 = "F3";
    static char115 = "F4";
    static char116 = "F5";
    static char117 = "F6";
    static char118 = "F7";
    static char119 = "F8";
    static char120 = "F9";
    static char121 = "F10";
    static char122 = "F11";
    static char123 = "F12";
    static char144 = "NumLock";
    static char145 = "ScrollLock";
    static char182 = "MyComputer";
    static char183 = "MyCalculator";
    static char186 = "Semicolon";
    static char187 = "Equal";
    static char188 = "Comma";
    static char189 = "Dash";
    static char190 = "Period";
    static char191 = "ForwardSlash";
    static char192 = "Tick";
    static char219 = "LeftBracket";
    static char220 = "Backslash";
    static char221 = "RightBracket";
    static char222 = "SingleQuote"
}
class Mouse {
    static Left = 1;
    static Middle = 2;
    static Right = 3;
    static button1 = "Left";
    static button2 = "Middle";
    static button3 = "Right"
}
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
class FrostFlake {

    static Game;
    static Log;

    #timer;
    time;
    fps;
    camera;
    canvas;
    renderer;
    view;
    background;
    input;
    showDebug = false;

    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = new Log();

        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.input = new Input();
        this.view = new View();

        FrostFlake.Log.info("FrostFlake instance created...");
    }

    start() {
        FrostFlake.Log.info("Starting FrostFlake...");

        this.time = new GameTime();
        this.camera = new Camera();
        this.renderer = new CanvasRenderer();

        let me = this;
        this.#timer = window.setInterval( function () {
            me.update();
        }, 1000 / this.fps);
    }

    update() {
        this.time.update();
        this.camera.update();
        this.view.update();
        this.input.update();
        this.renderer.draw(this.view.sprites, this.camera, this.canvas, this.background);
    }

}
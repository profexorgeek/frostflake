class GameTime {

    // number of milliseconds that can elapse between
    // frames before the GameTime will reset the delta
    // to zero. Prevents runaway game behavior if major
    // hiccups happen
    static MAX_FRAME_DELTA = 500;
    static FPS_SAMPLES = 60;

    startTime;
    lastFrameTime;
    frameSeconds;
    gameTimeSeconds;
    recentFrames = [];

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

        this.recentFrames.push(this.frameSeconds);
        if(this.recentFrames.length > GameTime.FPS_SAMPLES) {
            this.recentFrames.shift()
        }
    }

    aveFps() {
        let ave = 0;
        for(let i = 0; i < this.recentFrames.length; i++) {
            ave += this.recentFrames[i];
        }
        return 1 / (ave / this.recentFrames.length);
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
        if(typeof v2 === "number") {
            return {
                x: v1.x - v2,
                y: v1.y - v2
            };
        }
        else {
            return {
                x: v1.x - v2.x,
                y: v1.y - v2.y
            };
        }
    }

    static vectorMultiply(v1, v2) {
        if(typeof v2 === "number") {
            return {
                x: v1.x * v2,
                y: v1.y * v2
            };
        }
        else {
            return {
                x: v1.x * v2.x,
                y: v1.y * v2.y
            };
        }
    }

    static vectorNormalize(v1) {
        let len = MathUtil.vectorLength(v1);
        return len == 0 ? v1 : {x: (v1.x / len), y: (v1.y / len)};
    }

    static vectorDot(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y);
    }

    static vectorLength(v1) {
        return MathUtil.length(v1.x, v1.y);
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
// pseudo enum
class RepositionType {
    static None = 0;
    static Move = 1;
    static Bounce = 2;
}
class Positionable {
    position = {x: 0, y: 0, rotation: 0}
    velocity = {x: 0, y: 0, rotation: 0}
    acceleration = {x: 0, y: 0, rotation: 0}
    drag = 0;
    layer = 0;
    parent = null;
    children = [];
    
    get x() {
        return this.position.x;
    }

    set x(val) {
        this.position.x = val;
    }

    get y() {
        return this.position.y;
    }

    set y(val) {
        this.position.y = val;
    }

    get rotation() {
        return this.position.rotation;
    }

    set rotation(val) {
        this.position.rotation = val;
    }

    get absolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.absolutePosition;
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

    get root() {
        var obj = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        return obj;
    }

    constructor(x = 0, y = 0) {
        
    }

    addChild(positionable) {
        positionable.parent = this;
        this.children.push(positionable);

        //sort children by layer
        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

    removeChild(positionable) {
        let i = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
        positionable.parent = null;
    }

    attach(positionable) {
        positionable.addChild(this);
    }

    detach() {
        if(this.parent instanceof Positionable) {
            this.parent.removeChild(this);
        }
    }

    moveRootX(amt) {
        var obj = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.x += amt;
    }

    moveRootY(amt) {
        var obj = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.y += amt;
    }

    update() {
        this.preUpdate();

        let delta = FrostFlake.Game.time.frameSeconds;
        let deltaSquaredHalved = delta * delta / 2;

        this.position.x += (this.velocity.x * delta) + (this.acceleration.x * deltaSquaredHalved);
        this.position.y += (this.velocity.y * delta) + (this.acceleration.y * deltaSquaredHalved);
        this.position.rotation += (this.velocity.rotation * delta) + (this.acceleration.rotation * deltaSquaredHalved);

        this.velocity.x += (this.acceleration.x * delta) - (this.drag * this.velocity.x * delta);
        this.velocity.y += (this.acceleration.y * delta) - (this.drag * this.velocity.y * delta);
        this.velocity.rotation += (this.acceleration.rotation * delta) - (this.drag * this.velocity.rotation * delta);

        this.position.rotation = MathUtil.normalizeAngle(this.position.rotation);

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    // this method is intentionally empty so devs can inject custom logic into the update cycle
    preUpdate() {}
}
class Sprite extends Positionable{

    alpha = 1;
    frame = null;
    texture = null;
    animation = null;
    scale = 1;
    #collisionShape = null;

    get collision() {
        return this.#collisionShape;
    }

    set collision(shape) {
        if(this.#collisionShape) {
            this.#collisionShape.parent = null;
        }

        this.#collisionShape = shape;
        this.#collisionShape.parent = this;
    }

    constructor(texture = null) {
        super();
        let me = this;
        this.texture = texture;
        this.collision = new Circle();
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
        super.update();

        // play animation
        if(this.animation) {
            this.animation.update();
            this.texture = this.animation.texture;
            this.frame = this.animation.currentFrame;
        }
    }
}
class Shape extends Positionable {

    constructor() {
        super();
    }

    get absolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.absolutePosition;
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

    static collideCircleVsCircle(circle1, circle2, repositionType = RepositionType.None, circle1Weight = 1, circle2Weight = 0, forceScale = 1) {
        // figure out if we're overlapping by calculating
        // if the distance apart is less than the sum of the radii
        let delta = MathUtil.vectorSubtract(circle2.absolutePosition, circle1.absolutePosition);
        let distApart = MathUtil.length(delta.x, delta.y);
        let collideDist = circle1.radius + circle2.radius;
        let overlap = collideDist - distApart;
        let didCollide = overlap > 0;

        if(didCollide && repositionType != RepositionType.None) {
            let normalDelta = MathUtil.vectorNormalize(delta);

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }
            
            let circle1Factor = circle2Weight / (circle1Weight + circle2Weight);
            let circle2Factor = circle1Weight / (circle1Weight + circle2Weight);

            circle1.root.position.x += normalDelta.x * -(overlap * circle1Factor);
            circle1.root.position.y += normalDelta.y * -(overlap * circle1Factor);

            circle2.root.position.x += normalDelta.x * (overlap * circle2Factor);
            circle2.root.position.y += normalDelta.y * (overlap * circle2Factor);

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle1.root.velocity, circle2.root.velocity), normalDelta) * forceScale;
                
                let circle1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle1Factor);
                circle1.root.velocity.x -= circle1VelocityAdjust.x * 2;
                circle1.root.velocity.y -= circle1VelocityAdjust.y * 2;

                let circle2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle2Factor);
                circle2.root.velocity.x += circle2VelocityAdjust.x * 2;
                circle2.root.velocity.y += circle2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideCircleVsRect(circle, rect, repositionType = RepositionType.None, circleWeight = 1, rectWeight = 0, forceScale = 1) {
        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        let xCollisionDist = circle.radius + (rect.width / 2);
        let xDist = circle.absolutePosition.x - rect.absolutePosition.x;
        let xOverlap = xCollisionDist - Math.abs(xDist);

        let yCollisionDist = circle.radius + (rect.height / 2);
        let yDist = circle.absolutePosition.y - rect.absolutePosition.y;
        let yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        let didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            // TODO: handle corners!

            let normalDelta = {
                x: (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                y: (xOverlap >= yOverlap ? 1 : 0) * Math.sign(yDist)
            };

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            let circleFactor = rectWeight / (circleWeight + rectWeight);
            let rectFactor = circleWeight / (circleWeight + rectWeight);

            circle.root.position.x += normalDelta.x * xOverlap * circleFactor;
            circle.root.position.y += normalDelta.y * yOverlap * circleFactor;

            rect.root.position.x -= normalDelta.x * xOverlap * rectFactor;
            rect.root.position.y -= normalDelta.y * yOverlap * rectFactor;

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle.root.velocity, rect.root.velocity), normalDelta) * forceScale;
                
                let circleVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circleFactor);
                circle.root.velocity.x -= circleVelocityAdjust.x * 2;
                circle.root.velocity.y -= circleVelocityAdjust.y * 2;

                let rectVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rectFactor);
                rect.root.velocity.x += rectVelocityAdjust.x * 2;
                rect.root.velocity.y += rectVelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideRectVsRect(rect1, rect2, repositionType = RepositionType.None, rect1Weight = 1, rect2Weight = 0, forceScale = 1) {
        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        let xCollisionDist = (rect1.width / 2) + (rect2.width / 2);
        let xDist = rect1.absolutePosition.x - rect2.absolutePosition.x;
        let xOverlap = xCollisionDist - Math.abs(xDist);

        let yCollisionDist = (rect1.height / 2) + (rect2.height / 2);
        let yDist = rect1.absolutePosition.y - rect2.absolutePosition.y;
        let yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        let didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            let normalDelta = {
                x: (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                y: (xOverlap <= yOverlap ? 0 : 1) * Math.sign(yDist)
            };

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            let rect1Factor = rect2Weight / (rect1Weight + rect2Weight);
            let rect2Factor = rect1Weight / (rect1Weight + rect2Weight);

            rect1.root.position.x += normalDelta.x * xOverlap * rect1Factor;
            rect1.root.position.y += normalDelta.y * yOverlap * rect1Factor;

            rect2.root.position.x -= normalDelta.x * xOverlap * rect2Factor;
            rect2.root.position.y -= normalDelta.y * yOverlap * rect2Factor;

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(rect1.root.velocity, rect2.root.velocity), normalDelta) * forceScale;
                
                let r1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect1Factor);
                rect1.root.velocity.x -= r1VelocityAdjust.x * 2;
                rect1.root.velocity.y -= r1VelocityAdjust.y * 2;

                let r2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect2Factor);
                rect2.root.velocity.x += r2VelocityAdjust.x * 2;
                rect2.root.velocity.y += r2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }
}
class Circle extends Shape {
    radius;

    constructor(radius = 16) {
        super();
        this.radius = radius;
    }

    collideWith(shape, repoType = RepositionType.None, thisWeight = 1, targetWeight = 0, repoForce = 1) {
        if(shape instanceof Circle) {
            return Shape.collideCircleVsCircle(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
        else if(shape instanceof Rectangle) {
            return Shape.collideCircleVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }
}
class Rectangle extends Shape {
    width;
    height;

    get left() {
        return this.absolutePosition.x - this.width / 2;
    }

    get right() {
        return this.absolutePosition.x + this.width / 2;
    }

    get top() {
        return this.absolutePosition.y + this.height / 2;
    }

    get bottom() {
        return this.absolutePosition.y - this.height / 2;
    }

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    collideWith(shape, repoType = RepositionType.None, thisWeight = 1, targetWeight = 0, repoForce = 1) {
        if(shape instanceof Circle) {
            return Shape.collideCircleVsRect(shape, this, repoType, targetWeight, thisWeight, repoForce);
        }
        else if(shape instanceof Rectangle) {
            return Shape.collideRectVsRect(this, shape, repoType, thisWeight, targetWeight, repoForce);
        }
    }
}
class CanvasRenderer {

    #textureCache = {};
    context;
    background = "rgb(0,0,0)";

    // TODO: what about clearing texture cache
    // and images added to the DOM?

    constructor(canvas, background) {
        this.context = canvas.getContext("2d");
        this.background = background;
    }

    checkAndPreloadPositionables(positionables) {
        let preloaded = true;
        for(let i = 0; i < positionables.length; i++) {
            if(!this.textureLoaded(positionables[i].texture)) {
                preloaded = false;
            }

            if(positionables[i].children.length > 0) {
                let childrenLoaded = this.checkAndPreloadPositionables(positionables[i].children);
                if(childrenLoaded === false) {
                    preloaded = false;
                }
            }
        }

        return preloaded;
    }
    
    draw(positionables, camera) {
        this.context;
        this.background;
        let scale = 1 / camera.resolution;
        let transX = MathUtil.invert(camera.x) + (this.context.canvas.width / 2) * camera.resolution;
        let transY = camera.y + (this.context.canvas.height / 2) * camera.resolution;

        this.context.save();
        this.context.imageSmoothingEnabled = camera.antialias;
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.scale(scale, scale);
        this.context.translate(transX, transY);

        for(let i = 0; i < positionables.length; i++) {

            // draw sprites
            if(positionables[i] instanceof Sprite) {
                this.drawSprite(positionables[i], this.context);
            }
        }
        this.context.restore();
    }

    drawSprite(sprite, context) {
        let transX = sprite.x;
        let transY = MathUtil.invert(sprite.y);
        let transRot = -sprite.rotation;
        let alpha = sprite.alpha;

        this.context.save();
        this.context.translate(transX, transY);
        this.context.rotate(transRot);
        this.context.globalAlpha = alpha;

        // draw texture
        if(this.textureLoaded(sprite.texture)) {
            let tex = this.#textureCache[sprite.texture];

            // if null frame, force sprite to have a frame matching its width
            if(sprite.frame == null) {
                sprite.frame = new Frame();
                sprite.frame.width = tex.width;
                sprite.frame.height = tex.height;
            }

            this.context.drawImage(
                tex,
                sprite.frame.left,
                sprite.frame.top,
                sprite.frame.width,
                sprite.frame.height,
                sprite.frame.width / -2 * sprite.scale,
                sprite.frame.height / -2 * sprite.scale,
                sprite.frame.width * sprite.scale,
                sprite.frame.height * sprite.scale
            );

            // draw debug visualizations
            if(FrostFlake.Game.showDebug) {
                
                // draw sprite bounds
                this.context.strokeStyle = "rgba(255, 255, 255, 0.3)";
                this.context.strokeRect(
                    -sprite.frame.width / 2 * sprite.scale,
                    -sprite.frame.height / 2 * sprite.scale,
                    sprite.frame.width * sprite.scale,
                    sprite.frame.height * sprite.scale);
            }
        }
        // texture hasn't been loaded, load it now
        else {
            this.loadTexture(sprite.texture);
        }

        // reset alpha
        this.context.globalAlpha = 1;

        // draw collision shapes
        if(FrostFlake.Game.showDebug) {
            this.context.strokeStyle = "Red";
            if(sprite.collision instanceof Circle) {
                this.context.beginPath();
                this.context.arc(
                    0,
                    0,
                    sprite.collision.radius,
                    0,
                    Math.PI * 2
                );
                this.context.stroke();
            }
            else if(sprite.collision instanceof Rectangle) {
                this.context.save();
                this.strokeStyle = "Red";
                this.context.rotate(sprite.collision.absolutePosition.rotation);
                this.context.strokeRect(
                    -sprite.collision.width / 2,
                    -sprite.collision.height / 2,
                    sprite.collision.width,
                    sprite.collision.height
                )
                this.context.restore();
            }
        }

        // recurse on children
        if(sprite.children.length > 0) {
            for(let i = 0; i < sprite.children.length; i++) {
                this.drawSprite(sprite.children[i], this.context);
            }
        }

        // restore context
        this.context.restore();
    }

    textureLoaded(url) {
        if(url !== null &&
            url in this.#textureCache &&
            this.#textureCache[url] instanceof HTMLImageElement === true &&
            this.#textureCache[url].complete === true) {
                return true;
            }
        return false;
    }

    loadTexture(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // return on bad URL or loading in progress
        if(url == '' || url == null || url in this.#textureCache) {
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
class Camera extends Rectangle{
    resolution = 1;
    antialias = false;

    constructor(width, height) {
        super(width, height);
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

    get currentFrame() {
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
        this.#secondsLeftInFrame = this.currentFrame.seconds;
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

                this.#secondsLeftInFrame += this.currentFrame.seconds;

                // we can never exit this loop because this frame is zero seconds long
                // force exit
                if(this.#secondsLeftInFrame < 0 && this.currentFrame.seconds <= 0) {
                    break;
                }
            }
        }
    }
}
class View {
    children = [];

    constructor() {
    }

    update() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    renderToTexture(width, height) {
        let camera = new Camera();
        let target = document.createElement('canvas');
        target.width = width;
        target.height = height;
        FrostFlake.Game.renderer.draw(this.children, camera, target, "rgba(0,0,0,0)");
        return target.toDataURL();
    }

    addChild(positionable) {
        if(this.children.indexOf(positionable) > -1) {
            throw "positionable has already been added to view."
        }

        this.children.push(positionable);
    }

    removeChild(positionable) {
        let i = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
    }

    clearChildren() {
        this.children = [];
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
    x = 0;
    y = 0;
    changeX = 0;
    changeY = 0;
    worldX = 0;
    worldY = 0;
    isInFrame = false;

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
class Audio {
    context;

    #audioCache = {};

    constructor() {
        this.context = new AudioContext();
    }

    enable() {
        if(this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playSound(url) {
        // TODO: cache created buffers for reuse?
        if(this.audioLoaded(url)) {
            let src = this.context.createBufferSource();
            src.buffer = this.#audioCache[url];
            src.connect(this.context.destination);
            src.start(0);
            return src;
        }
        else {
            FrostFlake.Log.warn(`Audio not loaded ${url}, attempting to load now.`);
            this.loadSound(url);
            return null;
        }
    }

    audioLoaded(url) {
        if(url !== null && 
            url !== '' &&
            url in this.#audioCache && 
            this.#audioCache[url] instanceof AudioBuffer) {
                return true;
            }
        return false;
    }

    loadSound(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // EARLY OUT: bad URL, audio context, or loading in progress
        if(url == '' || 
            url == null || 
            url in this.#audioCache ||
            this.context.state != 'running') {
            return;
        }

        // insert placeholder so audio isn't loaded multiple times
        // if load requests fire quickly
        me.#audioCache[url] = "...";

        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState == XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    if(xhr.response instanceof ArrayBuffer) {
                        me.context.decodeAudioData(xhr.response,
                            // decode succeeded
                            function(decoded) {
                                me.#audioCache[url] = decoded;
                            },
                            // failed to decode
                            function() {
                                FrostFlake.Log.error(`Failed to decode audio for: ${url}`);
                            });
                    }
                    else {
                        FrostFlake.Log.error(`Response was not an ArrayBuffer: ${url}`);
                    }
                }
                else {
                    FrostFlake.Log.error(`Failed to load ${url} with response ${xhr.status}`);
                }
            }
        });

        xhr.responseType = 'arraybuffer';
        xhr.open('GET', url, true);
        xhr.send();
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
    audio;
    showDebug = false;

    constructor(canvas, fps = 30, background = "rgb(0,0,0)") {
        FrostFlake.Game = this;
        FrostFlake.Log = new Log();

        this.canvas = canvas;
        this.fps = fps;
        this.background = background;
        this.input = new Input();
        this.view = new View();
        this.audio = new Audio();

        FrostFlake.Log.info("FrostFlake instance created...");
    }

    start() {
        FrostFlake.Log.info("Starting FrostFlake...");

        this.time = new GameTime();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.renderer = new CanvasRenderer(this.canvas);

        let me = this;
        this.#timer = window.setInterval( function () {
            me.update();
        }, 1000 / this.fps);
    }

    update() {
        this.time.update();
        this.camera.update();
        this.view.update();

        // Note: input must be updated after the view
        // this is because an input could come in and
        // be cleared before the view is updated and
        // can respond in the game loop
        this.input.update();

        this.renderer.draw(this.view.children, this.camera, this.canvas, this.background);
    }

}
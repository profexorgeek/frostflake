import FrostFlake from '../FrostFlake';
import View from '../Views/View';
import Position from './Position';

export default class Positionable {

    color                              = "rgba(255,0,0,0.25)";
    position: Position                 = new Position();
    velocity: Position                 = new Position();
    acceleration: Position             = new Position();
    visible                            = true;
    drag                               = 0;
    layer                              = 0;
    parent: Positionable | View        = null;
    children: Array<Positionable>      = [];
    destroyed                          = false;
    applyRotationAccelerationAndDrag   = false;
    
    get x(): number {
        return this.position.x;
    }
    set x(val: number) {
        this.position.x = val;
    }

    get y(): number {
        return this.position.y;
    }
    set y(val: number) {
        this.position.y = val;
    }

    get rotation(): number {
        return this.position.rotation;
    }
    set rotation(val) {
        this.position.rotation = val;
    }

    constructor() {
        // intentionally empty
    }

    get absolutePosition(): Position {
        const absPos = new Position();

        if(this.parent != null && this.parent instanceof Positionable) {
            const parentAbsPos = this.parent.absolutePosition;
            const magnitude = this.position.length;
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

    get root(): Positionable {
        let obj: Positionable = this;
        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        return obj;
    }

    

    addChild(positionable: Positionable): void {
        positionable.parent = this;
        this.children.push(positionable);

        //sort children by layer
        this.children.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

    removeChild(positionable: Positionable): void {
        const i: number = this.children.indexOf(positionable);
        if(i > -1) {
            this.children.splice(i, 1);
        }
        else {
            FrostFlake.Log.warn("Tried to call removeChild but positionable wasn't found in children collecion.");
        }
        positionable.parent = null;
    }

    attach(positionable: Positionable): void {
        positionable.addChild(this);
    }

    detach(): void {
        if(this.parent instanceof Positionable) {
            this.parent.removeChild(this);
        }

        else if(this.parent instanceof View) {
            this.parent.removeChild(this);
        }

        else {
            // NOTE 07/2024: these used to throw errors but detach should be safe to call in any context because its
            // called every time destroy is called which means that many Positionable subtypes may not be attached
            // to anything when destroy->detach is called.
            if(this.parent != null) {
                //throw `Attempted to deatch ${this.constructor.name} but parent is not a View or Positionable!`;
            }
            else {
                //throw `Attempted to deatch ${this.constructor.name} but parent is null!`;
            }
            
        }
    }

    moveRootX(amt: number): void {
        let obj: Positionable = this;

        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.x += amt;
    }

    moveRootY(amt: number): void {
        let obj: Positionable = this;

        while(obj.parent instanceof Positionable) {
            obj = obj.parent;
        }
        obj.position.y += amt;
    }

    update(): void {
        this.preUpdate();

        const delta = FrostFlake.Game.time.frameSeconds;
        const deltaSquaredHalved = delta * delta / 2;

        this.position.x += (this.velocity.x * delta) + (this.acceleration.x * deltaSquaredHalved);
        this.position.y += (this.velocity.y * delta) + (this.acceleration.y * deltaSquaredHalved);
        this.position.rotation += (this.velocity.rotation * delta) + (this.acceleration.rotation * deltaSquaredHalved);

        this.velocity.x += (this.acceleration.x * delta) - (this.drag * this.velocity.x * delta);
        this.velocity.y += (this.acceleration.y * delta) - (this.drag * this.velocity.y * delta);

        if(this.applyRotationAccelerationAndDrag) {
            this.velocity.rotation += (this.acceleration.rotation * delta) - (this.drag * this.velocity.rotation * delta);
        }

        this.position.rotation = Position.normalizeAngle(this.position.rotation);

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    // this method is intentionally empty so devs can inject custom logic into the update cycle
    /* eslint-disable @typescript-eslint/no-empty-function */
    preUpdate(): void {}
    /* eslint-enable @typescript-eslint/no-empty-function */

    destroy(): void {

        // EARLY OUT: already destroyed, this can happen when destroy is
        // called multiple times in a frame.
        if(this.destroyed === true) {
            return;
        }

        this.detach();

        // cascade destroy to children
        if(this.children.length > 0) {
            for(let i = this.children.length - 1; i > -1; i--) {
                this.children[i].destroy();
                this.children.splice(i, 1);
            }
        }

        this.destroyed = true;
    }
}
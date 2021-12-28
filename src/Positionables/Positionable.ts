import FrostFlake from '../FrostFlake';
import Position from './Position';
import { length, normalizeAngle } from '../Utility/MathUtil';

export default class Positionable {

    color: string                               = "rgba(255,0,0,0.25)";
    position: Position                          = new Position();
    velocity: Position                          = new Position();
    acceleration: Position                      = new Position();
    visible: boolean                            = true;
    drag: number                                = 0;
    layer: number                               = 0;
    parent: Positionable                        = null;
    children: Array<Positionable>               = [];
    destroyed: boolean                          = false;
    applyRotationAccelerationAndDrag: boolean   = false;
    
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
        let absPos = new Position();

        if(this.parent != null) {
            let parentAbsPos = this.parent.absolutePosition;
            let magnitude = length(this.x, this.y);
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
        positionable.parent = null;
    }

    attach(positionable: Positionable): void {
        positionable.addChild(this);
    }

    detach(): void {
        if(this.parent instanceof Positionable) {
            this.parent.removeChild(this);
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

        this.position.rotation = normalizeAngle(this.position.rotation);

        // update children
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    // this method is intentionally empty so devs can inject custom logic into the update cycle
    preUpdate(): void {}

    destroy(): void {
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
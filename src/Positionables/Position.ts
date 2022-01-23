import FrostFlake from "../FrostFlake";

export default class Position {
    private _x: number         = 0;
    private _y: number         = 0;
    private _rotation: number  = 0;


    get x(): number {
        return this._x;
    }
    set x(newValue: number) {
        this._x = newValue;
    }

    get y(): number {
        return this._y;
    }
    set y(newValue: number) {
        this._y = newValue;
    }

    get rotation(): number {
        return this._rotation;
    }
    set rotation(newValue: number) {
        this._rotation = newValue;
    }

    get length(): number {
        let len = Math.pow(this.x, 2) + Math.pow(this.y, 2);
        return Math.abs(Math.sqrt(len));
    }

    constructor(x: number = 0, y:number = 0, rotation:number = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    reset(): void {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
    }

    clone(): Position {
        return new Position(this.x, this.y, this.rotation);
    }

    distanceTo(target: Position): number {
        const delta = target.subtract(this);
        return delta.length;
    }

    angleTo(target: Position): number {
        const delta = target.subtract(this);
        return Math.atan2(delta.y, delta.x);
    }

    subtract(pos: Position): Position {
        return new Position(
            this.x - pos.x,
            this.y - pos.y,
            pos.rotation - this.rotation);
    }

    multiply(pos: Position): Position {
        return new Position(
            pos.x * this.x,
            pos.y * this.y,
            pos.rotation * this.rotation);
    }

    multiplySingle(num: number): Position {
        return new Position(
            this.x * num,
            this.y * num,
            this.rotation
        );
    }

    normalize(): Position {
        const length = this.length;
        
        if(length === 0) {
            return new Position(
                this.x,
                this.y,
                this.rotation
            );
        }
        else {
            return new Position(
                this.x / length,
                this.y / length,
                this.rotation
            );
        }
    }

    dot(pos: Position): number {
        return (this.x * pos.x) + (this.y * pos.y);
    }

    static normalizeAngle(incomingAngle: number): number {
        const twoPi = Math.PI * 2;
        let angle = incomingAngle;

        while(angle < 0) {
            angle += twoPi;
        }

        while(angle > twoPi) {
            angle -= twoPi;
        }

        return angle;
    }
}
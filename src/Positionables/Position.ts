import MathUtil from "../Utility/MathUtil";

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
        this._rotation = MathUtil.normalizeAngle(newValue);
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

    length(): number {
        return MathUtil.vectorLength(this);
    }

    distanceTo(pos: Position): number {
        let dV = MathUtil.vectorSubtract(this, pos);
        return MathUtil.length(dV.x, dV.y);
    }
}
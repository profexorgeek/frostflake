import FrostFlake from '../FrostFlake';
import Position from '../Positionables/Position';
import MathUtil from '../Utility/MathUtil';

export default class Cursor {

    private _position: Position         = new Position();
    private _lastPosition: Position     = new Position();
    private _change:Position            = new Position();
    private _world: Position            = new Position();
    isInFrame                  = false;

    get worldX(): number {
        return this._world.x;
    }

    get worldY(): number {
        return this._world.y;
    }

    get changeX(): number {
        return this._change.x;
    }

    get changeY(): number {
        return this._change.y;
    }

    get changeScroll(): number {
        return this._change.rotation;
    }

    get x(): number {
        return this._position.x;
    }

    get y(): number {
        return this._position.y;
    }

    update(): void {
        this._world.x = FrostFlake.Game.camera.x + this.x;
        this._world.y = FrostFlake.Game.camera.y + this.y;

        this._change.x = this._position.x - this._lastPosition.x;
        this._change.y = this._position.y - this._lastPosition.y;
        this._lastPosition.x = this._position.x;
        this._lastPosition.y = this._position.y;

        this._change.rotation = 0;
    }

    setHardwarePosition(x: number, y: number): void {
        this._position.x = x - (FrostFlake.Game.canvas.width / 2);;
        this._position.y = MathUtil.invert(y) + (FrostFlake.Game.canvas.height / 2);;
    }

    notifyWheelChange(amount: number) {
        this._change.rotation = amount;
    }
}
import FrostFlake from '../FrostFlake';
import Position from '../Positionables/Position';
import MathUtil from '../Utility/MathUtil';

export default class Cursor {

    private _position: Position         = new Position();
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

    get x(): number {
        return this._position.x;
    }

    get y(): number {
        return this._position.y;
    }

    update(): void {
        this._world.x = FrostFlake.Game.camera.x + this.x;
        this._world.y = FrostFlake.Game.camera.y + this.y;
    }

    setHardwarePosition(x: number, y: number): void {
        const cursorX: number = x - (FrostFlake.Game.canvas.width / 2);
        const cursorY: number = MathUtil.invert(y) + (FrostFlake.Game.canvas.height / 2);
        this._change.x = this.x - cursorX;
        this._change.y = this.y - cursorY;
        this._position.x = cursorX;
        this._position.y = cursorY;
    }
}
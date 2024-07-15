import MathUtil from "../Utility/MathUtil";
import Line from "./Line";
import Positionable from "./Positionable";


export default class Grid extends Positionable {

    private _gridCount: number      = 0;
    private _pixelSpacing: number   = 16;

    override get alpha() {
        return this._alpha;
    }
    override set alpha(a: number) {
        this._alpha = a;
        this.calculateChildren();
    }

    override get color() {
        return this._color;
    }
    override set color(c: string) {
        this._color = c;
        this.calculateChildren();
    }

    get pixelSpacing(): number {
        return this._pixelSpacing;
    }

    set pixelSpacing(ps: number) {
        this._pixelSpacing = ps;
        this.calculateChildren();
    }

    constructor(gridCount: number, pixelSpacing: number, color: string = "white") {
        super();

        this._gridCount = gridCount;
        this._pixelSpacing = pixelSpacing;
        this._color = color;
        this.calculateChildren();
    }

    calculateChildren(): void {

        this.removeAllChildren();

        const startX = this._gridCount / -2 * this._pixelSpacing;
        const startY = this._gridCount / -2 * this._pixelSpacing;
        const lineLength = this._gridCount * this._pixelSpacing;
        for(let i = 0; i < this._gridCount + 1; i++)
        {
            let horizontalLine = new Line(lineLength);
            horizontalLine.position.y = startY + (i * this._pixelSpacing);
            horizontalLine.color = this.color;
            horizontalLine.alpha = this.alpha;

            let verticalLine = new Line(lineLength);
            verticalLine.position.x = startX + (i * this._pixelSpacing);
            verticalLine.rotation = MathUtil.toRadians(90);
            verticalLine.color = this.color;
            verticalLine.alpha = this.alpha;

            this.addChild(horizontalLine);
            this.addChild(verticalLine);
        }
    }
}
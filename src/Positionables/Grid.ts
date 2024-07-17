import MathUtil from "../Utility/MathUtil";
import Line from "./Line";
import Positionable from "./Positionable";


export default class Grid extends Positionable {

    private _gridCount: number = 0;
    private _pixelSpacing: number = 16;
    private _highlightIncrements: boolean = true;
    private _highlightSpacing:number = 4;

    private _xAxisColor: string = "red";
    private _yAxisColor: string = "green";
    private _alphaMultiplier: number = 0.5;


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

    get highlightIncrements(): boolean {
        return this._highlightIncrements;
    }
    set highlightIncrements(highlight: boolean) {
        this._highlightIncrements = highlight;
        this.calculateChildren();
    }

    get highlightSpacing(): number {
        return this._highlightSpacing;
    }
    set highlightSpacing(spacing: number) {
        this._highlightSpacing = Math.abs(spacing);
        this.calculateChildren();
    }

    constructor(gridCount: number, pixelSpacing: number, color: string = "gray") {
        super();

        this._gridCount = gridCount;
        this._pixelSpacing = pixelSpacing;
        this._color = color;
        this.calculateChildren();
    }

    setLineColors(gridColor:string, xColor: string, yColor: string, alphaMultiplier: number)
    {
        this.color = gridColor;
        this._xAxisColor = xColor;
        this._yAxisColor = yColor;
        this._alphaMultiplier = alphaMultiplier;
    }

    calculateChildren(): void {

        this.removeAllChildren();

        const startX = this._gridCount / -2 * this._pixelSpacing;
        const startY = this._gridCount / -2 * this._pixelSpacing;
        const lineLength = this._gridCount * this._pixelSpacing;
        for(let i = 0; i < this._gridCount + 1; i++)
        {
            let targetAlpha = this._highlightIncrements === false || i % this._highlightSpacing == 0 ?
                this.alpha :
                this.alpha * this._alphaMultiplier;

            let horizontalLine = new Line(lineLength);
            horizontalLine.position.y = startY + (i * this._pixelSpacing);
            horizontalLine.color = this.color;

            let verticalLine = new Line(lineLength);
            verticalLine.position.x = startX + (i * this._pixelSpacing);
            verticalLine.rotation = MathUtil.toRadians(90);
            verticalLine.color = this.color;

            // override color and target alpha for x/y axis center lines
            if(i == Math.floor(this._gridCount / 2))
            {
                verticalLine.color = this._yAxisColor;
                horizontalLine.color = this._xAxisColor;
                targetAlpha = this.alpha;
            }           

            horizontalLine.alpha = targetAlpha;
            verticalLine.alpha = targetAlpha;

            this.addChild(horizontalLine);
            this.addChild(verticalLine);
        }
    }
}
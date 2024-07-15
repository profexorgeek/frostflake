import MathUtil from '../Utility/MathUtil';
import Position from './Position';
import RepositionType from './RepositionType';
import Shape from './Shape';

export default class Line extends Shape {
    
    private _length: number      = 16;
    private _thickness: number = 1;

    get length() : number{
        return this._length;
    }

    set length(len: number) {
        this._length = len;
    }

    get thickness(): number {
        return this._thickness;
    }

    set thickness(thicknessPixels: number) {
        this._thickness = thicknessPixels;
    }

    constructor(length: number, thickness: number = 1) {
        super();

        this._length = length;
        this._thickness = thickness;
    }

    isPointInside(x: number, y: number): boolean {
        throw "Collision-related methods are not implemented for Line yet!";
    }

    collideWith(shape: Shape, repoType: RepositionType, thisWeight: number, targetWeight: number, repoForce: number): boolean {
        throw "Collision-related methods are not implemented for Line yet!";
    }
}
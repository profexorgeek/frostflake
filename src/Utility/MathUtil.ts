export function invert(num: number): number {
    return 0 - num;
}

export function randomInRange(min: number, max: number): number {
    const range = max - min;
    const val = Math.random() * range;
    return val + min;
}

export function randomIntInRange(min: number, max: number): number {
    return Math.floor(randomInRange(min, max));
}

export function length(x: number, y: number) {
    const len = Math.pow(x, 2) + Math.pow(y, 2);
    return Math.abs(Math.sqrt(len));
}

export function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

export function clamp(val: number, min: number, max: number) {
    val = Math.min(max, val);
    val = Math.max(min, val);
    return val;
}

export default {
    invert,
    randomInRange,
    randomIntInRange,
    length,
    clamp,
    toRadians,
    toDegrees
}
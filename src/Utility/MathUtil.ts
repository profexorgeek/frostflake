export function invert(num) {
    return 0 - num;
}

export function normalizeAngle(angle) {
    const twoPi = Math.PI * 2;

    while(angle < 0) {
        angle += twoPi;
    }

    while(angle > twoPi) {
        angle -= twoPi;
    }

    return angle;
}

export function angleTo(v1, v2) {
    let dx = v2.x - v1.x;
    let dy = v2.y - v1.y;
    return normalizeAngle(Math.atan2(dy, dx));
}

export function randomInRange(min, max) {
    const range = max - min;
    const val = Math.random() * range;
    return val + min;
}

export function randomIntInRange(min, max) {
    return Math.floor(randomInRange(min, max));
}

export function vectorSubtract(v1, v2) {
    if(typeof v2 === "number") {
        return {
            x: v1.x - v2,
            y: v1.y - v2
        };
    }
    else {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    }
}

export function vectorMultiply(v1, v2) {
    if(typeof v2 === "number") {
        return {
            x: v1.x * v2,
            y: v1.y * v2
        };
    }
    else {
        return {
            x: v1.x * v2.x,
            y: v1.y * v2.y
        };
    }
}

export function vectorNormalize(v1) {
    let len = vectorLength(v1);
    return len == 0 ? v1 : {x: (v1.x / len), y: (v1.y / len)};
}

export function vectorDot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
}

export function length(x, y) {
    let len = Math.pow(x, 2) + Math.pow(y, 2);
    return Math.abs(Math.sqrt(len));
}

export function vectorLength(v1) {
    return length(v1.x, v1.y);
}

export function clamp(val, min, max) {
    val = Math.min(max, val);
    val = Math.max(min, val);
    return val;
}

export default {
    invert,
    normalizeAngle,
    angleTo,
    randomInRange,
    randomIntInRange,
    vectorSubtract,
    vectorMultiply,
    vectorNormalize,
    vectorDot,
    length,
    vectorLength,
    clamp,
}
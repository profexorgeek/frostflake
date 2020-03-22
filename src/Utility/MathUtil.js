class MathUtil {

    static invert(num) {
        return 0 - num;
    }

    static normalizeAngle(angle) {
        const twoPi = Math.PI * 2;

        while(angle < 0) {
            angle += twoPi;
        }

        while(angle > twoPi) {
            angle -= twoPi;
        }

        return angle;
    }

    static angleTo(v1, v2) {
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        return MathUtil.normalizeAngle(Math.atan2(dy, dx));
    }

    static randomInRange(min, max) {
        const range = max - min;
        const val = Math.random() * range;
        return val + min;
    }

    static vectorSubtract(v1, v2) {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        return {x: dx, y: dy};
    }

    static length(x, y) {
        let len = Math.pow(x, 2) + Math.pow(y, 2);
        return Math.abs(Math.sqrt(len));
    }

    static clamp(val, min, max) {
        val = Math.min(max, val);
        val = Math.max(min, val);
        return val;
    }
}
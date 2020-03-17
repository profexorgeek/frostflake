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

    static randomInRange(min, max) {
        const range = max - min;
        const val = Math.random() * range;
        return val + min;
    }
    
}
var frostFlake = (function (ff) {
    ff.math = {
        e:Math.E,
        log10E: 0.4342945,
        log2E: 1.442695,
        pi: Math.PI,
        piOver2: (Math.PI * 0.5),
        piOver4: (Math.PI * 0.25),
        twoPi: (Math.PI * 2.0),

        // returns the opposite of value
        invert: function (value) {
            return 0 - value;
        },

        max:function(value1, value2) {
            if(value1 > value2) {
                return value1;
            }
            return value2;
        },

        min:function(value1, value2) {
            if(value1 < value2) {
                return value1;
            }
            return value2;
        },

        // clamps a value to the min or max possible value
        clamp: function (value, min, max) {
            if (value < min) return min;
            else if (value > max) return max;
            else return value;
        },

        // linear interpolation between two values
        lerp: function(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        },

        square: function(value) {
            return value * value;
        },

        sqrt:function(value) {
            return Math.sqrt(value);
        },

        randomInRange:function(min, max) {
            var range = max - min;
            var rand = Math.random() * range;
            var returnValue =  min + rand;
            return returnValue;
        },

        distanceBetween:function(pt1, pt2) {
            var dX = pt1.x - pt2.x;
            var dY = pt1.y - pt2.y;
            var dist = this.sqrt(this.square(dX) + this.square(dY));
            return dist;
        },

        absoluteDistanceBetween:function(pt1, pt2) {
            return Math.abs(this.distanceBetween(pt1, pt2));
        },

        velocityFromAngle:function(angle, speed) {
            var velocity = {
                x:Math.sin(angle) * speed,
                y:Math.cos(angle) * speed
            };
            return velocity;
        },

        angleBetweenPoints:function(pt1, pt2) {
            var dX = pt2.x - pt1.x;
            var dY = pt2.y - pt1.y;
            return Math.atan2(dY, dX);
        },

        randomInt:function(min,max) {
            return Math.round(this.random(min,max));
        },

        // converts radians to degrees
        toDegrees: function(radians) {
            return (radians * 57.295779513082320876798154814105);
        },

        // converts degrees to radians
        toRadians: function(degrees) {
            return (degrees * 0.017453292519943295769236907684886);
        }
    };
    return ff;
}(frostFlake || {}));
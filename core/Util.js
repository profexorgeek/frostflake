/* ===============================================================================================

    UTIL.JS
    Provides utility methods to make common game tasks easier, including a math
    utility that performs a lot of common calculations

================================================================================================*/

var frostFlake = (function (ff) {

    // Checks if provided variable is not undefined or null
    ff.hasValue = function(variable) {
        if(variable !== undefined && variable !== null && variable != "") {
            return true;
        }

        return false;
    }

    // Returns a default values if provided variable has no value
    ff.defaultIfNoValue = function(variable, defaultValue) {
        if(ff.hasValue(variable)) {
            return variable;
        }
        return defaultValue;
    }

    // Gets a randomized hex color as a string
    ff.randomHexColor = function() {
        return '#' + ff.math.randomInt(0, 16777215).toString(16);
    }

    // Provides a collection of common values and utilities for math operations in games
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

        // returns the square of the provided value
        square: function(value) {
            return Math.pow(value, 2);
        },

        // returns a random number within the provided range
        randomInRange:function(min, max) {
            var range = max - min;
            var rand = Math.random() * range;
            var returnValue =  min + rand;
            return returnValue;
        },

        // returns a random integer between min and max, exclusive of max
        randomIntInRange:function(min,max) {
            return Math.floor(this.randomInRange(min,max));
        },

        // finds the distance between two points
        distanceBetween:function(pt1, pt2) {
            var dX = pt1.x - pt2.x;
            var dY = pt1.y - pt2.y;
            var dist = this.hypotenuseLength(dX, dY);
            return dist;
        },

        // gets hypoteneus length
        hypotenuseLength: function (a, b) {
            return Math.sqrt(this.square(a) + this.square(b));
        },

        // finds the absolute distance between two points
        absoluteDistanceBetween:function(pt1, pt2) {
            return Math.abs(this.distanceBetween(pt1, pt2));
        },

        // returns a velocity {x,y} given an angle and a speed
        velocityFromAngle:function(angle, speed) {
            var velocity = {x: 0, y: 0};
            angle = this.regulateAngle(angle);
            if (ff.hasValue(angle) && !isNaN(angle)) {
                velocity = {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                };
            }
            return velocity;
        },

        // returns the angle between two points
        angleBetweenPoints:function(pt1, pt2) {
            var dX = pt2.x - pt1.x,
                dY = pt2.y - pt1.y,
                angle = this.regulateAngle(Math.atan2(dY, dX));
            return isNaN(angle) ? 0 : angle;
        },

        // converts radians to degrees
        toDegrees: function(radians) {
            radians = this.regulateAngle();
            return (radians * 57.295779513082320876798154814105);
        },

        // converts degrees to radians
        toRadians: function(degrees) {
            return this.regulateAngle((degrees * 0.017453292519943295769236907684886));
        },

        // converts an angle to a value between 0 and Math.PI * 2
        regulateAngle: function(angle) {
            while(angle > this.twoPi) {
                angle -= this.twoPi;
            }

            while(angle < 0) {
                angle += this.twoPi;
            }

            return angle;
        }
    };

    return ff;
}(frostFlake || {}));
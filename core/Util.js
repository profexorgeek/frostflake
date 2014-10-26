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

        // returns a random integer between min and max
        randomIntInRange:function(min,max) {
            return Math.round(this.random(min,max));
        },

        // finds the distance between two points
        distanceBetween:function(pt1, pt2) {
            var dX = pt1.x - pt2.x;
            var dY = pt1.y - pt2.y;
            var dist = Math.sqrt(this.square(dX) + this.square(dY));
            return dist;
        },

        // finds the absolute distance between two points
        absoluteDistanceBetween:function(pt1, pt2) {
            return Math.abs(this.distanceBetween(pt1, pt2));
        },

        // returns a velocity {x,y} given an angle and a speed
        velocityFromAngle:function(angle, speed) {
            var velocity = {
                x:Math.sin(angle) * speed,
                y:Math.cos(angle) * speed
            };
            return velocity;
        },

        // returns the angle between two points
        angleBetweenPoints:function(pt1, pt2) {
            var dX = pt2.x - pt1.x;
            var dY = pt2.y - pt1.y;
            return Math.atan2(dY, dX);
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
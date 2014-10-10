var frostFlake = (function (ff) {
    ff.Drawable = Class.extend({
        init: function () {
            this.active = true;
            this.alpha = 1;
            this.width = 0;
            this.height = 0;
            this.position = {x: 0, y: 0};
            this.velocity = {x: 0, y: 0};
            this.acceleration = {x: 0, y: 0};
            this.rotation = 0;
            this.rotationVelocity = 0;
            this.layer = 0;
            this.radius = 0;
        },

        // updates the Drawables position and rotation
        update: function (deltaTime) {
            if (deltaTime === undefined || deltaTime === null) {
                throw "Bad delta provided!";
            }
            var deltaSquaredDividedByTwo = deltaTime * deltaTime / 2;
            this.position.x += (this.velocity.x * deltaTime) + (this.acceleration.x * deltaSquaredDividedByTwo);
            this.position.y += (this.velocity.y * deltaTime) + (this.acceleration.y * deltaSquaredDividedByTwo);
            this.velocity.x += (this.acceleration.x * deltaTime);
            this.velocity.y += (this.acceleration.y * deltaTime);
            this.rotation += this.rotationVelocity * deltaTime;
            this.customUpdate(deltaTime);
            this.clamp();
        },

        // custom code can be defined here and will be automatically called
        customUpdate: function (deltaTime) {

        },

        // clamps properties to sane values
        clamp: function () {
            this.alpha = ff.math.clamp(this.alpha, 0, 1);
            if (this.rotation >= ff.math.twoPi) {
                this.rotation -= ff.math.twoPi;
            }
            if (this.rotation < 0) {
                this.rotation += ff.math.twoPi;
            }
        },


        // overridden by children to recalculate their bounds
        updateDimensions: function () {
            // child classes should perform logic here and then call _super()
            this.updateRadius();
        },

        // called to recalculate radius
        updateRadius: function () {
            if(this.width === 0 && this.height ===0) {
                this.radius = 0;
            }
            else {
                this.radius = ff.math.absoluteDistanceBetween(
                    {x:0,y:0},
                    {x:this.width * 0.5, y:this.height * 0.5}
                );
            }
        },

        // basic collision test for overlapping spheres
        collidesWith: function (drawable) {
            var overlapDistance = (this.radius * 0.5) + (drawable.radius * 0.5);
            var distanceBetween = ff.math.absoluteDistanceBetween(this.position, drawable.position);
            return (overlapDistance < distanceBetween);
        },

        // creates a savable model and serializes it to JSON
        toJson: function () {
            var model = {
                type: "Drawable",
                alpha: this.alpha,
                position: this.position,
                velocity: this.velocity,
                acceleration: this.acceleration,
                rotation: this.rotation,
                rotationVelocity: this.rotationVelocity,
                layer: this.layer
            };
            return ff.toJson(model);
        },

        // sets properties from a deserialized model
        fromJson: function (json) {
            var saveModel = ff.fromJson(json);
            for (var property in saveModel) {
                this[property] = saveModel[property];
            }
        }
    });
    return ff;
}(frostFlake || {}));
/* ===============================================================================================

    CAMERA.JS
    Represents a view of the game area. Used by the renderer to translate object
    coordinates during the drawing cycle.

================================================================================================*/

/*global Class */
var frostFlake = (function (ff) {
    "use strict";

    ff.Camera = Class.extend({
        init: function (viewWidth, viewHeight) {
            // positionable object the camera is attached to
            this.attachTarget = null;

            // describes the camera's current viewable area
            this.viewPort = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: viewWidth,
                height: viewHeight
            };

            // the camera's rate of movement
            this.velocity = {
                x: 0,
                y: 0
            };

            // the camera position
            this.position = {
                x: 0,
                y: 0
            };

            this.updateViewPort();
        },

        // updates position and viewport
        update: function (deltaTime) {
            if (ff.hasValue(this.attachTarget)) {
                this.velocity = this.attachTarget.velocity;
                this.position = this.attachTarget.position;
            } else {
                this.position.x = this.position.x + (this.velocity.x * deltaTime);
                this.position.y = this.position.y + (this.velocity.y * deltaTime);
            }
            this.updateViewPort();
        },

        // updates the viewport based on position and dimensions
        updateViewPort: function () {
            var halfWidth = this.viewPort.width / 2,
                halfHeight = this.viewPort.height / 2;

            this.viewPort.left = this.position.x - halfWidth;
            this.viewPort.right = this.position.x + halfWidth;
            this.viewPort.top = this.position.y + halfHeight;
            this.viewPort.bottom = this.position.y - halfHeight;
        },

        // checks for position property and attaches camera if valid target
        attachTo: function (positionable) {
            if (ff.hasValue(positionable.position)) {
                this.attachTarget = positionable;
                this.position = this.attachTarget;
                this.updateViewPort();
                return true;
            }
            return false;
        },

        // detaches the camera from positionable object
        detach: function () {
            this.attachTarget = null;
        },

        // gets a random point within the view of the camera
        getRandomPointInView: function () {
            return {
                x: this.getRandomXInView(),
                y: this.getRandomYInView()
            };
        },

        // gets a random point along the x axis within the viewport
        getRandomXInView: function () {
            return ff.math.randomInRange(this.viewPort.left, this.viewPort.right);
        },

        // gets a random point along the y axis within the viewport
        getRandomYInView: function () {
            return ff.math.randomInRange(this.viewPort.bottom, this.viewPort.top);
        },

        // updates the height and width of the camera, call if the canvas size changes
        updateDimensions: function (viewWidth, viewHeight) {
            this.viewPort.width = viewWidth;
            this.viewPort.height = viewHeight;
            this.updateViewPort();
        }
    });

    return ff;
}(frostFlake || {}));
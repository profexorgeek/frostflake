/* ===============================================================================================

    CAMERA.JS
    Represents a view of the game area. Used by the renderer to translate object
    coordinates during the drawing cycle.

================================================================================================*/

var frostFlake = (function (ff) {

    "use strict";

    ff.Camera = function (width, height) {

        // the positionable the camera is attached to
        var attachTarget;

        // describes the camera's current viewable area
        var viewPort = {
            left:0,
            right:0,
            top:0,
            bottom:0,
            width:0,
            height:0
        }

        this.velocity = {
            x:0,
            y:0
        }

        this.position = {
            x:0,
            y:0
        }

        // sets the viewPort size
        setViewSize(width, height);

        // updates the viewport area based on height, width and position
        function updateViewPort () {
            var halfWidth = viewPort.width / 2;
            var halfHeight = viewPort.height / 2;
            viewPort.left = position.x - halfWidth;
            viewPort.right = position.x + halfWidth;
            viewPort.top = position.y + halfHeight;
            viewPort.bottom = position.y - halfHeight;
        };

        // gets a copy of the viewport
        function getViewPort () {
            return {
                left: viewPort.left,
                right: viewPort.right,
                top: viewPort.top,
                bottom: viewPort.bottom,
                width: viewPort.width,
                height: viewPort.height
            };
        }

        // updates position and viewport, calls custom update
        this.update = function(deltaTime) {
            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;
            updateViewPort();
            if(ff.hasValue(attachTarget)) {
                position = attachTarget.position;
            }
        };

        // attaches the camera to an object as long as that object has a position
        // TODO: implement ability to offset positioning
        this.attachTo = function(positionable) {
            if(ff.hasValue(positionable.position)) {
                attachTarget = positionable;
                return true;
            }
            return false;
        };

        // detaches the camera from a positionable object
        function detach () {
            attachTarget = null;
        };

        // used by the renderer to translate camera position for rendering
        function start (context) {
            var translateX = ff.math.invert(position.x) + (context.canvas.width / 2);
            var translateY = position.y + (context.canvas.height / 2);
            context.save();
            context.translate(translateX, translateY);

            // update viewport size based on context
            viewPort.width = context.canvas.width;
            viewPort.height = context.canvas.height;
        };

        // used by the renderer to end translation after a render cycle
        function end (context) {
            context.restore();
        };

        // gets a random point within the camera's view
        function getRandomPointInView () {
            return {
                x : getRandomXInView(),
                y : getRandomYInView()
            }
        };

        // gets a random x within the camera's view
        function getRandomXInView () {
            return ff.math.randomInRange(viewPort.left, viewPort.right);
        };

        // gets a random y within the camera's view
        function getRandomYInView () {
            return ff.math.randomInRange(viewPort.bottom, viewPort.top);
        };

        // updates the width/height of the viewable area
        function setViewSize (width, height) {

            // use constants for defaults if width/height are not valid
            width = ff.defaultIfNoValue(width, ff.constants.DEFAULT_WIDTH);
            height = ff.defaultIfNoValue(height, ff.constants.DEFAULT_HEIGHT);

            viewPort.width = width;
            viewPort.height = height;

            updateViewPort();
        };
    };

    return ff;
}(frostFlake || {}));
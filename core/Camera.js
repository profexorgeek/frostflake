var frostFlake = (function (ff) {
    ff.Camera = Class.extend({
        init:function(width, height) {

            if(typeof width === 'undefined') {
                width = ff.constants.DEFAULT_WIDTH;
            }

            if(typeof height === 'undefined') {
                height = ff.constants.DEFAULT_HEIGHT;
            }

            this.position = {
                x:0,
                y:0
            }

            this.velocity = {
                x:0,
                y:0
            }

            this.attachTarget = null;

            this.viewPort = {
                left:0,
                right:0,
                top:0,
                bottom:0,
                width:width,
                height:height
            }
            this.updateViewPort();
        },

        update:function(deltaTime) {
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;

            this.updateViewPort();
            

            if(this.attachTarget != null) {
                this.position = this.attachTarget.position;
            }

            this.customUpdate(deltaTime);
        },

        updateViewPort: function() {
            var halfWidth = this.viewPort.width / 2;
            var halfHeight = this.viewPort.height / 2;

            this.viewPort.left = this.position.x - halfWidth;
            this.viewPort.right = this.position.x + halfWidth;
            this.viewPort.top = this.position.y + halfHeight;
            this.viewPort.bottom = this.position.y - halfHeight;
        },

        customUpdate:function(deltaTime) {
            // user will add custom actions here
        },

        attachTo: function(drawable) {
            if(drawable instanceof ff.Drawable) {
                this.attachTarget = drawable;
            }
        },

        detach: function() {
            this.attachTarget = null;
        },

        start:function(context) {
            var translateX = ff.math.invert(this.position.x) + (context.canvas.width / 2);
            var translateY = this.position.y + (context.canvas.height / 2);
            context.save();
            context.translate(translateX, translateY);

            // update viewport size based on context
            this.viewPort.width = context.canvas.width;
            this.viewPort.height = context.canvas.height;
        },

        end:function(context) {
            context.restore();
        },

        getRandomPointInView: function() {
            return {
                x : this.getRandomXInView(),
                y : this.getRandomYInView()
            }
        },

        getRandomXInView: function() {
            return ff.math.randomInRange(this.viewPort.left, this.viewPort.right);
        },

        getRandomYInView: function() {
            return ff.math.randomInRange(this.viewPort.bottom, this.viewPort.top);
        }
    });
    return ff;
}(frostFlake || {}));
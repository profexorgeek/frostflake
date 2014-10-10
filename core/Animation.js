var frostFlake = (function (ff) {
    ff.Animation = Class.extend({
        init: function () {
            this.url = "";
            this.currentChain = "";
            this.currentFrame = 0;
            this.frameWidth = 0;
            this.frameHeight = 0;
            this.chains = {};
            this.isAnimating = false;
            this.timeLeftInFrame = 0;
        },

        update: function (deltaTime) {
            if (this.isAnimating) {
                var chain = this.chains[this.currentChain];
                this.timeLeftInFrame -= deltaTime;
                if (this.timeLeftInFrame <= 0) {
                    if (this.currentFrame < chain.frames.length - 2) {
                        this.currentFrame += 1;
                    }
                    else {
                        if (chain.isLooped) {
                            this.currentFrame = 0;
                        }
                    }
                    if (chain.frames[this.currentFrame].duration <= 0) {
                        throw "Frame duration cannot be zero or less!";
                    }
                    this.timeLeftInFrame += chain.frames[this.currentFrame].duration;
                }
            }
        },

        start:function() {
            this.isAnimating = true;
        },

        stop:function() {
            this.isAnimating = false;
        },

        setCurrentChain: function (name) {
            this.currentChain = name;
            this.currentFrame = 0;
            var chain = this.chains[this.currentChain];
            if(chain.frames[this.currentFrame].duration <= 0) {
                throw "Frame duration cannot be zero or less!";
            }
            this.timeLeftInFrame = chain.duration;
        },

        getTextureCoordinates: function () {
            var chain = this.chains[this.currentChain];
            var frameData = chain.frames[this.currentFrame];
            var texCoords = {
                top:frameData.top,
                right:frameData.left + this.frameWidth,
                bottom:frameData.top + this.frameHeight,
                left:frameData.left
            }
            return texCoords;
        },

        toModel:function() {
            var model = {
                isAnimating: this.isAnimating,
                currentChain: this.currentChain,
                currentFrame: this.currentFrame,
                url: this.url,
                chains: this.chains
            };
            return model;
        },

        toJson: function () {
            var model = this.toModel();
            return ff.toJson(model);
        },

        fromUrl:function(url, loadFinishedCallback) {
            var model;
            var animation = this;
            ff.loadJson(url, function(json) {
               model = json;
                animation.fromModel(model);
                if(loadFinishedCallback) {
                    loadFinishedCallback();
                }
            });
        },

        fromJson: function (json) {
            var saveModel = ff.fromJson(json);
            this.fromModel(saveModel);
        },

        fromModel:function(model) {
            // TODO: sanity checks on data?
            for (var property in model) {
                this[property] = model[property];
            }
        }

    });
    return ff;
}(frostFlake || {}));
/* ===============================================================================================

    ANIMATION.JS
    Animation Class used by Sprites to control animation chains.


================================================================================================*/

/* EXAMPLE ANIMATION JSON
{
    "spriteSheetUrl": "nyan",
    "frameWidth": 100,
    "frameHeight" : 70,
    "sequences": {
        "flying": {
            "isLooping" : true,
            "frames": [
                {
                    "top": 0,
                    "left": 0,
                    "duration": 0.1
                },
                {
                    "top": 0,
                    "left": 100,
                    "duration": 0.1
                },
                {
                    "top": 0,
                    "left": 200,
                    "duration": 0.1
                },
                {
                    "top": 0,
                    "left": 300,
                    "duration": 0.1
                },
                {
                    "top": 0,
                    "left": 400,
                    "duration": 0.1
                },
                {
                    "top": 0,
                    "left": 500,
                    "duration": 0.1
                }
            ]
        }
    }
}
*/

var frostFlake = (function (ff) {

    "use strict";

    ff.Animation = function () {

        // private members
        var spriteSheetUrl = "",        // the url of the spritesheet for this animation 
            sequences = {},             // an object containing sequences with name as key
            currentSequence = {},       // the current animation sequence
            currentFrameIndex = 0,      // the current frame index in the current sequence
            frameWidth = 0,             // the width of the animation frames
            frameHeight = 0,            // the height of the animation frames
            isAnimating = false,        // whether the animation is currently playing
            timeLeftInFrame = 0;        // amount of time before animation advances

        // update the flow of animation through frames
        this.update = function (deltaTime) {
            if (isAnimating === true && ff.hasValue(currentSequence)) {
                // reduce time left in frame by elapsed time
                timeLeftInFrame = timeLeftInFrame - deltaTime;

                if (timeLeftInFrame <= 0) {
                    if (currentFrameIndex < currentSequence.frames.length - 2) {
                        currentFrameIndex = currentFrameIndex + 1;
                    } else {
                        if (currentSequence.isLooping) {
                            currentFrameIndex = 0;
                        }
                    }

                    // NOTE: Render cycles do not exacly match frame durations!
                    // So we need to increment timeLeftInFrame instead of setting it directly.
                    // This makes overall animation duration more accurate.
                    // Long hiccups in update speed will result in animations playing very quickly until
                    // they catch up.
                    timeLeftInFrame = timeLeftInFrame + currentSequence.frames[currentFrameIndex].duration;
                }

            }
        };

        // starts the animation if valid sequences are defined
        this.start = function () {
            if (ff.hasValue(currentSequence) && ff.hasValue(currentSequence.frames) && currentSequence.frames.length > 0) {
                isAnimating = true;
            }
        };

        // stops the animation
        this.stop = function () {
            isAnimating = false;
        };

        // gets the url for the spritesheet referenced by the animation
        this.getSpriteSheetUrl = function () {
            return spriteSheetUrl;
        };

        // sets the current sequence if the provided name is valid
        this.setCurrentSequence = function (sequenceName) {
            if (sequences.hasOwnProperty(sequenceName)) {
                currentSequence = sequences[sequenceName];
                currentFrameIndex = 0;
                timeLeftInFrame = currentSequence.frames[currentFrameIndex].duration;
            }
        };

        // gets the specific texture coordinates of the current frame for rendering
        this.getTextureCoordinates = function () {
            var coords = {top: 0, right: 0, bottom: 0, left: 0 },  // coordinates object expected by renderer
                frameData;                                         // reference to the current frame

            if (ff.hasValue(currentSequence.frames) && currentSequence.frames.length > 0) {
                frameData = currentSequence.frames[currentFrameIndex];
                coords = {
                    top: frameData.top,
                    right: frameData.left + frameWidth,
                    bottom: frameData.top + frameHeight,
                    left: frameData.left
                };
            }

            return coords;
        };

        // returns a JSON string representing this animation
        this.toJson = function () {
            return {
                spriteSheetUrl: spriteSheetUrl,
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                sequences: sequences
            };
        };

        // populates animation data from a json string and stops animating
        this.fromJson = function (jsonObject) {
            spriteSheetUrl = jsonObject.spriteSheetUrl;
            frameWidth = jsonObject.frameWidth;
            frameHeight = jsonObject.frameHeight;
            sequences = jsonObject.sequences;
            isAnimating = false;
        };
    };

    // static method allowing creation of an animation instance from a URL
    ff.Animation.getInstanceFromUrl = function (url, loadedCallback) {

        var animation = new ff.Animation();

        // load from URL if one was provided
        if (ff.hasValue(url)) {
            ff.loadJson(url, function (json) {
                animation.fromJson(json);

                if (ff.hasValue(loadedCallback)) {
                    loadedCallback();
                }
            });
        }

        return animation;
    };

    return ff;
}(frostFlake || {}));
/* ===============================================================================================

    RENDERER.JS
    The renderer is capable of taking a list of sprites, potentially with nested children,
    and rendering them to a provided context using a camera projection.

    The renderer is stateless, requiring a list of sprites, a camera and a context on every
    draw call. This enables a single renderer to draw to multiple contexts with multiple
    cameras.

================================================================================================*/

var frostFlake = (function (ff) {
    "use strict";

    ff.Renderer = Class.extend({
        // no constructor, renderer is stateless

        // draws a list of sprites to a context using the provided camera's projection
        // passing arguments allows renderer to be used for multiple different cameras and surfaces
        draw: function (spriteList, camera, canvas, backgroundColor) {
            var context = canvas.getContext("2d"),                                                       // canvas to draw to
                cameraTranslationX = ff.math.invert(camera.position.x) + (context.canvas.width / 2),    // camera projection offset
                cameraTranslationY = camera.position.y + (context.canvas.height / 2),                   // camera projection offset
                fillColor = ff.defaultIfNoValue(backgroundColor, "rgb(0, 0, 0, 0)"),                    // background or transparent
                i;                                                                                      // iterator, JSLint prefers here

            // fill canvas
            context.fillStyle = fillColor;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // perform camera projection translation
            context.save();
            context.translate(cameraTranslationX, cameraTranslationY);

            // draw sprites, recurses on children
            for (i = 0; i < spriteList.length; i += 1) {
                this.drawSprite(spriteList[i], context);
            }

            // restore context
            context.restore();
        },

        // draws sprite and all children recursively
        drawSprite: function (sprite, context) {
            var spriteTranslationX = sprite.position.x,
                spriteTranslationY = ff.math.invert(sprite.position.y),
                spriteRotation = sprite.rotation,
                spriteAlpha = sprite.alpha,
                srcWidth = 0,
                srcHeight = 0,
                i;

            if(ff.hasValue(sprite.textureCoordinates)) {
                srcWidth = sprite.textureCoordinates.right - sprite.textureCoordinates.left;
                srcHeight = sprite.textureCoordinates.bottom - sprite.textureCoordinates.top;
            }

            // apply transformation
            context.save();
            context.translate(spriteTranslationX, spriteTranslationY);

            // apply rotation, note that rotation is 0 at right
            context.rotate(-spriteRotation);

            // set alpha
            context.globalAlpha = spriteAlpha;

            // draw sprite if texture is valid
            if (ff.hasValue(sprite.texture) && srcWidth > 0 && srcHeight > 0) {
                context.drawImage(
                    sprite.texture,
                    sprite.textureCoordinates.left,
                    sprite.textureCoordinates.top,
                    srcWidth,
                    srcHeight,
                    sprite.width / -2,
                    sprite.height / -2,
                    sprite.width,
                    sprite.height
                );
            }

            // TODO: draw sprite radius if sprite.showRadius

            // reset alpha
            context.globalAlpha = 1;

            // recurse through children
            if (ff.hasValue(sprite.children)) {
                for (i = 0; i < sprite.children.length; i += 1) {
                    this.drawSprite(sprite.children[i], context);
                }
            }

            // restore context
            context.restore();
        }
    });
    return ff;
}(frostFlake || {}));
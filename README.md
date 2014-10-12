# README #
Frostflake is a free, MIT-Licensed, JavaScript game engine for making games or other rich media in JavaScript. It attempts to make game development for the browser, similar to game development for the desktop. The game is rendered to a canvas object.

### What does it do? ###
So far, FrostFlake has these features:
* Allows modular, scalable development of game entities with basic inheritance system.
* Drawable objects with position, velocity, rotation and alpha
* Sprite object supporting custom draw scale, animation and sprite sheet texture coordinates
* Polygons supporting colorized stroke and fill
* Input handling from mouse or keyboard (requires jQuery)
* A Camera entity supporting position, velocity and attachment to a Drawable target
* Supports rendering directly to the canvas or rendering to a render target and using resulting render as a Sprite.
* Utilities with methods making input and common game math easy

###What Else Will It Do?###
Here are features I would like to add to FrostFlake:
* Audio support
* Concept of "Views", "Levels" or "Screens" that load a segment of the game and unload when finished. Eventually the storage of drawables and management of rendering might move into the View
* Plugin: be able to load files from common game design tools such as Tiled
* Plugin: physics? (low priority)
* Polygon-based collision
* Unit Tests coverage O_o
* Parenting/Attachment: Ability to have one Drawable parent another and their rotation/velocity/etc stay in sync

### Contribution guidelines ###
* Writing tests: I don't/haven't but you should!
* Code review: Yeah...should probably have a process for that.
* Other guidelines: See desired features above for project direction

### Who do I talk to? ###
BitBucket user profexorgeek, aka Justin Johnson. Send to my gmail: justin.d.johnson
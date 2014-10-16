# README #
Frostflake is a free, MIT-Licensed, JavaScript game engine for making games or other rich media in JavaScript. It attempts to make game development for the browser similar to game development for the desktop. The game is rendered to a canvas object and game objects are created as modular classes with inheritance.

### Existing Features ###
So far, FrostFlake has these features:

* Allows modular, scalable development of game entities with basic inheritance system.
* Drawable objects with position, velocity, rotation and alpha
* Sprite object supporting custom draw scale, animation and sprite sheet texture coordinates
* Polygons supporting colorized stroke and fill
* Input handling from mouse or keyboard (requires jQuery)
* A Camera entity supporting position, velocity and attachment to a Drawable target
* Supports rendering directly to the canvas or rendering to a render target and using resulting render as a Sprite.
* Utilities with methods making input and common game math easy

###Future Features###
Here are features I would like to add to FrostFlake:

* Audio support
* Concept of "Views", "Levels" or "Screens" that load a segment of the game and unload when finished. Eventually the storage of drawables and management of rendering might move into the View
* Plugin: be able to load files from common game design tools such as Tiled
* Plugin: physics? (low priority)
* Polygon-based collision
* Unit Tests coverage O_o
* Parenting/Attachment: Ability to have one Drawable parent another and their rotation/velocity/etc stay in sync

### Style Guidelines ###
* See styleGuide.js
* Code should be JSLint valid except for the frostFlake module pattern
* Test cases need to be written! Code base at the time of this readme has zero test coverage :(

### Who do I talk to? ###
BitBucket user profexorgeek, aka Justin Johnson. Send to my gmail: justin.d.johnson
# README #
Frostflake is a JavaScript game engine for making games or other rich media that run in a browser. It attempts to make cross-platform, 2D game development as simple as possible by eliminating boilerplate and freeing the developer to focus on game logic.

###License###
MIT License, see license.txt

NOTE: I wanted the license to be as permissive as possible but I would love to know if you are using frostFlake in your project. A credit line in your game would be awesome too. Knowing that people use it helps me stay motivated to keep working on it!

### Current Features ###
* Allows modular, scalable development of game entities with basic inheritance system.
* Drawable objects with position, velocity, rotation and alpha
* Sprite object supporting custom draw scale, animation and sprite sheet texture coordinates
* Sprite parenting: sprites can be attached to a parent or have children
* Input handling from mouse or keyboard (Existing InputManager requires jQuery)
* A Camera entity supporting position, velocity and attachment to a Sprite target
* Rendering to primary game canvas or hidden render target (buffering, tilemap rendering, etc)
* Tree-based, recursive rendering
* Utility methods making common 2D game math easy
* Views: Levels or screens that centralize an area of the game

### Planned Features###
* Build system with versioned, minified and concatenated releases (Grunt + Node)
* Unit Tests coverage
* Particle effects
* Improved collision detection
* More robust demos
* Tiled plugin: support Tiled files
* Audio support
* Object pooling/factories

###Questions?###
Contact BitBucket user profexorgeek, aka Justin Johnson. Gmail: justin.d.johnson
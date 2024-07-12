# FrostFlake

For full documentation, see [FrostFlake Docs](/docs/index.md)!

To get started quickly, check out the [FrostFlake template project](https://github.com/profexorgeek/frostflake-template).

I originally started FrostFlake in 2014 as a way to have fun while learning the deeper aspects of JavaScript. I wanted to build a game engine with a lean, but functional, feature set and few dependencies so I wrote it in ES5. I rewrote the original engine in TypeScript in 2017 but then converted it to ES6 because I hoped to have zero dependencies. ES6 support was a mess and creating a build system that worked required tons of dependencies. So, we converted the engine _back_ to TypeScript as a community effort.

This iteration of the engine has no dependencies outside of TypeScript itself. It uses a canvas renderer, not WebGL. The goal was to make it as simple as possible for a beginner to start playing with the engine.

If you use this, I'd love to know how you're using it and what you think.

## Features

- **FrostFlake**: the core engine provides a game loop with a `GameTime` object tracking the time elapsed between game updates and the total time elapsed.
- **Camera**: a camera supporting position, velocity, acceleration, drag, and resolution scaling.
- **CanvasRenderer**: a simple-but-fast canvas renderer (no WebGL).
- **Render Targets**: the renderer can draw with a custom sprite list, camera and unique canvas. A `DataUrl` can be extracted from the unique canvas and used as a new sprite texture.
- **Input**: a class that provides mouse and keyboard input management.
- **View**: the entry point for the scene graph, which manages a list of `Positionable` objects.
- **Positionable**: the base class for most game objects, provides basic physics
- **Sprite**: a common base class for game objects. Supports spritesheeting, frame-based animation, drawscaling, collision, and parent/child relationships with relative coordinate systems.
- **MathUtil**: a utility class that provides some common 2D geometry calculations.
- **Collision**: FrostFlake provides two shapes, Circle and (axis-aligned) Rectangle, which support collision testing, repositioning, and simple bounce physics. This is more than enough for most 2D games!

## Todo list

Here are high-level features I'd like to add. When a feature is actually started, it will be an Issue. If you want to contribute, the Issues list is a great place to start.

- [ ] Improve [TMX Tilemap](https://mapeditor.org) map support
- [ ] Implement [LDtk](https://ldtk.io/) map support
- [ ] Test building with Electron and document
- [ ] Touch input system (currently only Mouse and Keyboard are supported)
- [x] Define docs pattern, docs should be in a `docs` folder and should be GitHub markdown
- [x] Complete TypeScript conversion: annotate variables and method arguments with Types
- [x] Text rendering system
- [x] Improve asset loading and texture buffering
- [x] Change callback-based loading system to use Promises
- [x] Improved build system (source map generation is not working correctly)
- [x] Use ES6 modules
- [x] Add color property to shapes and use it when rendering debug outlines
- [x] Render target demo
- [x] Audio playing system
- [x] Circle vs circle collision with basic physics
- [x] AAR vs AAR collision with basic physics
- [x] AAR vs circle collision with basic physics

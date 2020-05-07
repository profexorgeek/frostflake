# FrostFlake.js

I originally started FrostFlake in 2014 as a way to have fun while learning the deeper aspects of JavaScript. I wanted to build a game engine with a lean, but functional, feature set and few dependencies. I rewrote the original engine in TypeScript in 2017, and again in ES6 in 2020.

This iteration of the engine has zero dependencies. It uses a canvas renderer, not WebGL. The goal was to make it as simple as possible for a beginner to start playing with the engine.

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

## Start using

The easiest way to get started with FrostFlake is to fork the [frostflake-template project](https://github.com/profexorgeek/frostflake-template). The template project demonstrates main engine features and comes with some basic build configuration.

## Start contributing

The easiest way to start contributing is to use the [frostflake-template project](https://github.com/profexorgeek/frostflake-template) as a starting point. This repo has pre-made `View`s that make it easy to test engine features. Follow these steps:

1. Fork and clone this repository
1. Fork and clone the [frostflake-template project](https://github.com/profexorgeek/frostflake-template).
1. Modify the template project to reference this repo source instead of the npm package
1. That will give you a basic project with some existing `View`s to make sure you have everything wired up correctly
1. Add features or fix bugs and submit pull requests from your fork!

## Todo list

Here are features I'd like to add. This is a good place to start if you want to contribute. Keep in mind that the point of this engine is simplicity for beginners so please reach out if you plan to PR a new feature!

- [ ] Touch input system (currently only Mouse and Keyboard are supported)
- [ ] Text rendering system
- [ ] Improve [TMX Tilemap](https://mapeditor.org) loading/rendering
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

# FrostFlake.js

I originally started FrostFlake in 2014 as a way to have fun while learning the deeper aspects of JavaScript. I wanted to build a game engine with a lean, but functional feature set and few dependencies. I rewrote the original engine in TypeScript in 2017, and again in ES6 in 2020.

This iteration of the engine has zero dependencies and comes with feature demos. It uses a canvas renderer, not WebGL. The goal was to make it as simple as possible for a beginner to start playing with the engine without installing node and a ton of modules.

If you use this, I'd love to know how you're using it and what you think.

## Features

- **FrostFlake**: the core engine provides a game loop with a `GameTime` object tracking the time elapsed between game updates and the total time elapsed.
- **Camera**: a camera supporting position, velocity, acceleration, drag, and resolution scaling.
- **CanvasRenderer**: a simple canvas renderer (no WebGL) that lazy loads sprite textures and maintains an internal texture buffer.
- **Render Targets**: the renderer can draw with a custom sprite list, camera and unique canvas. A `DataUrl` can be extracted from the unique canvas and used as a new sprite texture.
- **Input**: a class that provides mouse and keyboard (no touch yet) input management.
- **View**: the entry point for the scene graph, which manages a list of `Sprite` objects.
- **Sprite**: the base class for most game objects. Supports spritesheeting, frame-based animation, drawscaling, collision, and parent/child relationships with relative coordinate systems.
- **MathUtil**: a utility class that provides some common 2D geometry calculations.
- **Collision**: FrostFlake provides two shapes, Circle and (axis-aligned) Rectangle, which support collision testing, repositioning, and simple bounce physics. This is more than enough for most 2D games!

## Get Started

Clone the repository. Serve the directory using any webserver (so the browser can load assets). The easiest way to do this is probably to install Node.js and use `http-server`. However, LAMP, WAMP, MAMP or IIS can also handle this.

Load the **/index.html** in your browser and click the buttons to see various demonstrations of engine capabilities.

The source code for the demos is in the **src/index.js** file. Try creating and loading your own custom `View`!

## Build

Building the engine means concatenating, transpiling, and minifying the source files into a single JavaScript file.

You don't have to build the engine to work from source! Since everything is ES6, you can just directly include the source files before your code. However, building the engine transpiles it into ES5, making it compatible with more browsers.

To build the engine:

1. Have Node installed
1. Use `npm install` in the project directory to fetch all node modules
1. Use `npm run-script build` to concatenate, transpile and minify the source
1. Use `npm start` to serve the directory with `http-server`

## Contribute

Here are features I'd like to add. This is a good place to start if you want to contribute. Keep in mind that the point of this engine is simplicity for beginners so please reach out if you plan to PR a new feature!

- [ ] Improved build system (source map generation is not working correctly)
- [ ] Improve asset loading and texture buffering
- [ ] Change callback-based loading system to use Promises
- [ ] Touch input system (currently only Mouse and Keyboard are supported)
- [ ] Text rendering system
- [ ] Improve [TMX Tilemap](https://mapeditor.org) loading/rendering
- [x] Use ES6 modules
- [x] Add color property to shapes and use it when rendering debug outlines
- [x] Render target demo
- [x] Audio playing system
- [x] Circle vs circle collision with basic physics
- [x] AAR vs AAR collision with basic physics
- [x] AAR vs circle collision with basic physics

# FrostFlake.js

I originally started FrostFlake in 2014 as a way to have fun while learning the deeper aspects of JavaScript. The goal was to build a simple game engine with the fewest dependencies possible. I rewrote the engine in TypeScript in 2017, and again in ES6 in 2020.

This iteration of the engine has zero dependencies and comes with some simple feature demos. The goal is to make it as simple as possible for a beginner to start playing with the engine without installing node and a ton of modules.

Feel free to use this as you wish. I'd love to know how you're using it and what you think!

## Current Features

- **FrostFlake**: the core engine provides a game loop with a `GameTime` object tracking the time elapsed between game updates and the total time elapsed.
- **Camera**: a default camera that supports `x` and `y` values.
- **CanvasRenderer**: a simple canvas renderer (no WebGL) that lazy loads sprite textures and maintains an internal texture buffer.
- **Render Targets**: the renderer can draw with a custom sprite list, camera and unique canvas. A `DataUrl` can be extracted from the unique canvas and used as a new sprite texture.
- **Input**: a class that provides mouse and keyboard (no touch yet) input management.
- **View**: the entry point for the scene graph, which manages a list of `Sprite` objects.
- **Sprite**: the base class for most game objects. Supports spritesheeting, frame-based animation, and parent/child relationships with relative coordinate systems.
- **MathUtil**: a utility class that provides some common 2D geometry calculations.

## Get Started

Clone the repository. Serve the directory using some simple webserver (so the browser can load assets). The easiest way to do this is probably to install Node.js and use `http-server`. However, LAMP, WAMP, MAMP or IIS can also handle this.

Load the **/demo/index.html** in your browser and open the browser dev tools. Try loading the premade demo `View`s by typing one of these commands in your JavaScript console:

- `ff.view = new ManySpriteDemo();`
- `ff.view = new ParentChildDemo();`
- `ff.view = new InputDemo();`
- `ff.view = new AnimationDemo();`

The source code for the demos is in the **/demo/index.html** file. Try creating and loading your own custom `View`!

## Future features

Here are some things I'd like to add:

- Circle collision with basic physics
- Axis-aligned rectangle collision with basic physics
- Tilemap loading
- Render target demo

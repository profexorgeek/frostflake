# FrostFlake

The `FrostFlake` class is the core game engine class that serves as an entry point for every game. New games will typically override the FrostFlake class to specify their starting views, drawing canvas, background color, and framerate.

The FrostFlake class creates all of the other class instances needed to manage the game, such as audio, input, renderer, and more. It starts the timer that kicks off the game loop and then launches the active view.

## FrostFlake Lifecycle

1. **constructor**: The constructor creates all of the instances needed by FrostFlake during the game's lifecycle.
1. **start**: Unlike `View`s, which call `start` automatically, the FrostFlake `start` method must be manually called to start the gameloop.
1. **update**: Once `start` is called, the `update` cycle will run automatically. While the active view is initializing, a loading graphic will automatically be displayed. Once a view has fully loaded, the `update` and `draw` cycles will automatically be called recursively for all of the active view's children.

## FrostFlake Members

FrostFlake exposes many instances that are critical to access for your game. The following is a list of instances and what they are used for:

### Static Members

Static members can be accessed directly from the `FrostFlake` class, such as `FrostFlake.Game`.

- Game: `FrostFlake` - this is a static instance of FrostFlake that allows the current game instance to be accessed from anywhere in code.
- Log: `ILog` - this is a static instance of a logger that allows log calls to be made from anywhere in code. By default, it is instantiated to be FrostFlake's simple `Log` class, which logs to the console. You can replace this with your own `ILog` implementation to do more sophisticated logging.

### Instance Members

Most FrostFlake members are instance members and can be accessed via the static `FrostFlake.Game` reference such as `FrostFlake.Game.time`.

- audio: `Audio` - the active `Audio` instance, used for playing sound and music.
- camera: `Camera` - the active `Camera` instance class used by the renderer during the `draw` cycle.
- canvas: `HTMLCanvasElement` - the canvas element used by the renderer during the `draw` cycle.
- defaultLoadingSprite: `Sprite` - a sprite that slowly blinks while a view is loading.
- fps: `number` - the frames-per-second that the game will attempt to run at.
- input: `Input` - the active `Input` instance used to collect keyboard, mouse, and other player input.
- renderer: `CanvasRenderer` - the active renderer used by FrostFlake to draw the game.
- showDebug: `boolean` - a flag that turns off/on visualizations such as collision, which are normally hidden.
- time: `GameTime` - a class that tracks the delta time between update cycles. Used for calculating movement per tick and checking the average FPS.
- view: `View` - the active view instance, which is the root node of the scene graph.

## Create a Custom Game

You will typically extend the `FrostFlake` class to form the basis of your own game. Here's an example of a custom game instance:

```typescript
// imports go here

export default class Game extends FrostFlake {
    
    constructor() {
        // pass a reference to a DOM element and set FPS to 60
        super(document.getElementById('gameCanvas'), 60);

        // set the current view to a custom view defined in your game
        this.view = new TitleScreenView();
    }
}
```

To start your game you will need to reference your custom game class once the DOM has loaded. This can vary widely depending on where you are serving your game but it might be similar to this:

```typescript
// instantiate your game class
let game = new Game();

// start the game loop
game.start();
```

## FrostFlake Methods

### constructor(canvas: HTMLCanvasElement, fps: number = 30, background: string = "rgb(0,0,0)")

The FrostFlake constructor expects a canvas element, a target frames-per-second value, and a background color as valid color string.

The frames-per-second argument is optional and defaults to 30.

The background color is optional and defaults to black.

### start(): void

This method should generally **not** be overridden.

The `start` method must be called manually after instantiating your custom `FrostFlake` instance.

This method loads the default loading image and then starts the game loop.

### update(): void

This method should generally **not** be overridden.

The `update` method is called by the game's core tick timer and is the core of the game loop. This method performs these actions in order:

1. Update the `time` instance to track the delta between update calls
1. Update the `camera` instance, which performs all velocity and positional calculations prior to the draw cycle
1. Update the `view` _if it is initialized_, otherwise slowly blink the loading sprite. The view update will cascade recursively to all children owned by the view.
1. Update the `input` instance. The timing of this is critical to make sure the `Input` class reacts tracks input events in a predictable order.
1. Perform the draw cycle using the `renderer` instance. The draw cycle must happen after all objects are updated.
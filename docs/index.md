## FrostFlake Documentation Index

This section of the repo is dedicated to engine API documentation. There are many
missing docs at this point but we hope to continue to document classes as we improve each class.

These classes form the FrostFlake API:

- [FrostFlake](/docs/FrostFlake.md): the core game class and application entry point.
- Audio
    - [Audio](/docs/Audio/Audio.md): used to play sound and music.
- Data
    - Data: used to asynchronously load game data.
- Drawing
    - Animation: defines frame animation logic, timing, textures, and texture coordinates on a spritesheet.
    - CanvasRenderer: the default 2D renderer used by FrostFlake.
    - EmbeddedImages: a class that holds base64-encoded images that are baked into the engine.
    - Frame: a class that describes a single animation frame.
- Input
    - Cursor: an class that stores the current world coordinates for the mouse cursor.
    - Input: a class that provides methods for reacting to player input.
    - Keys: a class that maps keyboard keys to the codes fired by browser events.
    - Mouse: a class that maps mouse buttons to the codes fired by browser events.
- Logging
    - ILog: the logging interface used by FrostFlake to log information.
    - Log: the default simple logger that logs to the JavaScript console.
    - LogLevel: an enumeration that defines logging levels.
- Positionables
    - Camera: a class used by the renderer during rendering. Extends Positionable.
    - Circle: a class used for rendering circles and circle collision. Extends Shape.
    - Positionable: the base class for all positionable objects. Offers parent-child relationships, absolute position calculation, velocity, acceleration, and drag. Has no visual component.
    - Rectangle: a class used for rendering circles and axis-aligned rectangle collision. Extends Shape.
    - RepositionType: an enumeration used to determine how to reposition colliding objects.
    - Shape: the base class for all shapes. Should not be directly used in games. Extends Positionable.
    - Sprite: the most common type to extend for custom game objects. Extends Positionable but implements a renderable texture and frame animation.
    - Text: simple class used for rendering text in game. Extends Positionable.
- Utility
    - GameTime: a class that holds time deltas between game ticks and averages over time.
    - MathUtil: a class that provides common calculations used in games.
- Views
    - TilemapView: experimental and probably will be deprecated. Extends View.
    - [View](/docs/Views/View.md): the base class for all game screens. Root node in the scene graph.
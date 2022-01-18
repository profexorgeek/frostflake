 # View

 The [`View`](/src/Views/View.ts) class is a container that represents an area of the game. Things such as the title screen, settings screen, levels, and similar things should be a `View`.

 By default, FrostFlake manages a single `View` at a time, which is the root node of the scene graph. Views contain a collection of children `Positionable` objects and the tree of view children is crawled recursively for both the update and the drawing cycle. The current view is available on the static game instance as follows:

 `FrostFlake.Game.view`

 To start a custom view, you create a custom class that extends the `View` class and set the current view instance to your new class as follows:

 `FrostFlake.Game.view = new Level1View();`

 This will kick off the view Lifecycle.

 ## Lifecycle

The `View` lifecycle starts when the active view is set on FrostFlake like this:

`FrostFlake.Game.view = new CustomView();`

This action kicks off the following lifecycle:

1. **constructor**: Avoid performing any logic in your view constructor, they should generally not be implemented at all. The constructor creates a new instance of the custom view.
1. **start**: The `start` method is called automatically by the engine and kicks off the initialization process, which is asynchronous. The engine will wait for initialization to complete before beginning the update cycle.
1. **initialize**: The asynchronous `initialize` method is where all asset loading and similar work should take place before the update cycle begins. Any assets used by game objects during the view's lifetime should be preloaded here. This guarantees that assets are available before they are needed in the gameloop.
1. **update**: The `update` method is called every tick. This is where all frame-based logic should take place. The update cycle will not be called until the `initialize` method has completed it's work and all promises are resolved
1. **destroy**: The `destroy` method is automatically called on the existing view by the engine when a new active view is set. This method should generally execute quickly and unload any assets no longer needed by the game. 

For more information about the methods called during a view's lifecycle, see the View Methods section.

## Create a Custom View

You will usually extend the `View` class to add screens, menus, or levels to your game. Here is an example of a custom view

```typescript
// imports go here

export default class CustomView extends View {

    // example asset to be loaded
    private readonly SPRITE_TEXTURE: string = "content/sprite.png";

    // example sprite
    private _sprite: Sprite;

    async initialize(): Promise<void> {

        // call the parent method
        await super.initialize();

        // async load a resource
        await Data.loadImage(this.SPRITE_TEXTURE);

        // create a new sprite object using the texture that was just loaded
        this._sprite = new Sprite(this.SPRITE_TEXTURE);

        // add the sprite to the view's children so it is updated and drawn
        this.addChild(this._sprite);
    }

    destroy(): void {
        super.destroy();

        // NOTE: children will be automatically destroyed in the parent method

        // OPTIONAL: unload the resource if it's no longer needed
        Data.removeItem(this.SPRITE_TEXTURE);
    }

    update(): void {
        super.update();

        // example frame logic, set rotation velocity when the
        // left mouse button is pressed
        if(FrostFlake.Game.input.buttonDown(Mouse.Left)) {
            this._sprite.velocity.rotation = 5;
        }
        else {
            this._sprite.velocity.rotation = 0;
        }
    }
}
```

 ## View Methods

 ### constructor

 The base constructor sets an `initialized` flag to false. The constructor for custom views should generally be empty.

 ### addChild(positionable: Positionable): void

The `addChild` method adds a `Positionable` to the `children` collection, sets the `parent` property on the added child, and marks the collection as needing to be sorted for rendering order.

If the positionable to be added is already in the `children` collection, this method _will throw an exception!_ This prevents tricky bugs such as double-updating of game entities.

You should always use the `addChild` method and never directly modify the `children` collection.

### async initialize(): Promise<void>

The asynchronous `initialize` method is where asset loading and potentially game object construction should happen. This method is automatically called by the engine and it will wait for all promises to resolve before beginning the `update` cycle.

### clearChildren(): void

The `clearChildren` method calls `removeChild` on every child, removing it from the `children` collection and setting the child's parent to `null`.

### destroy(): void

The `destroy`method removes all children from the collection and sets their parent to `null`.

Override this method to perform any custom unloading of assets and game objects loaded during the `initialize` method or game loop.

### destroyChild(positionable: Positionable): void

The `destroyChild` method removes a `Positionable` from the `children` collection, sets its parent to `null`, and calls `destroy` on the child.

### removeChild(positionable: Positionable): void

The `removeChild` method removes a child from the `children` collection and sets its parent to `null`. It does _not_ call `destroy` on the child `Positionable`.

### start(): void

The `start` method is used by the engine to kick off the initialization process.

This method should generally **not** be overridden.

### tryRemoveItem(item: any, list: Array<any>): boolean

The `tryRemoveItem` method is called by `removeChild` and should generally not be called or overridden. Use the `removeChild` method to remove children from the view.

### update(): void

The `update`method is called by the engine every tick. The `update` method should be overridden to do frame-based game logic in your custom `View`.

The time delta is often needed for calculations in the update cycle. Frame time in FrostFlake is expressed in seconds. This is stored in the `GameTime` object available on the static game instance as follows:

`FrostFlake.Game.time.frameSeconds`

**Note:** It is critical to make sure you call the base `update` method on your custom view. if you forget to call the base `update` method via `super.update()`, your game objects will not be sorted or updated properly!
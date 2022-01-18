# Audio

The FrostFlake [Audio](/src/Audio/Audio.ts) class is used to play audio in your game. It creates an instance of [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) and uses the context to decode audio data and play sounds.

By default, an instance of the `Audio` class is available on the static game instance object and can be called like this:

`FrostFlake.Game.audio.playSound("some/sound/file.wav");`

## Audio methods

### constructor

The `Audio` constructor creates a new `AudioContext` object. By default, the audio instance is initialized automatically when a FrostFlake game instance is constructed.

### enable(): void

The enable function attempts to `resume()` the `AudioContext` if its state is `suspended`. The `AudioContext` cannot play sounds if it is suspended. Due to browser rules, a user interaction must have taken place before the `AudioContext` can be moved into a `running` state and play sounds.

For more information, see [Autoplay policy in Chrome](https://goo.gl/7K7WLu).

### async loadSound(src: string): Promise<AudioBuffer>

The `loadSound` method is used to asynchronously load the sound from the URL specified by `src`.

If the sound is already loaded, it will return the cached object. If the `AudioContext` is `closed` or the provided `src` does not resolve to a valid `ArrayBuffer` the method will throw an exception.

Upon success, it will cache the decoded `AudioBuffer` and return it.

This method should be called during a `View`'s `initialize` to preload any sounds used in the `View`.

### playSound(src: string): AudioBufferSourceNode

The `playSound` method is used to play a sound.

If the `AudioContext` state is `suspended` it will attempt to resume the context before playing the sound. If the `AudioContext` is not running, it will log a warning and return `null` without playing a sound.

The sound specified by `src` must already be loaded by the async `loadSound` method. If the `src` has not been loaded, this method will throw an exception.
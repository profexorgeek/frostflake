import View from '../src/Views/View.js';
import Data from '../src/Data/Data.js';
import FrostFlake from '../src/FrostFlake.js';
import Mouse from '../src/Input/Mouse.js';

export default class AudioDemo extends View {

    async initialize() {
        await super.initialize();

        // preload a sound for playing in this screen
        await FrostFlake.Game.audio.loadSound('/content/laser.wav');
    }

    update() {
        super.update();

        if(FrostFlake.Game.input.buttonPushed(Mouse.Left)) {
            FrostFlake.Game.audio.playSound('/content/laser.wav');
        }

    }
}
import FrostFlake from '../FrostFlake';
import Data from '../Data/Data';

export default class Audio {
    private context: AudioContext;
    private _cache = {};

    constructor() {
        this.context = new AudioContext();
    }

    enable() {
        if(this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playSound(src) {
        // try to resume context if suspended
        if(this.context.state == 'suspended') {
            this.enable();
        }


        if(src in this._cache == false || this._cache[src] == null) {
            const msg = `Tried to play sound that hasn't been loaded: ${src}`;
            FrostFlake.Log.error(msg);
            throw Error(msg);
        }

        // EARLY OUT: can't play audio because the context isn't running
        if(this.context.state !== 'running') {
            FrostFlake.Log.warn('Cannot play sounds: audio context is not running');
            return;
        }
        
        let sound = this.context.createBufferSource();
        sound.buffer = this._cache[src];
        sound.connect(this.context.destination);
        sound.start(0);
        return sound;
    }

    async loadSound(src) {
        // EARLY OUT: sound already loaded
        if(src in this._cache) {
            return this._cache[src];
        }

        if(this.context.state === 'closed') {
            const msg = `Couldn't load ${src} because AudioContext has been closed.`;
            FrostFlake.Log.error(msg);
            throw Error(msg);
        }

        let buffer = await Data.loadAudio(src);
        if(buffer instanceof ArrayBuffer !== true) {
            const msg = `Audio source ${src} was not a valid audio buffer`;
            FrostFlake.Log.error(msg);
            throw Error(msg);
        }

        const promise = new Promise((resolve, reject) => {
            this.context.decodeAudioData(buffer, (decoded) => {
                this._cache[src] = decoded;
                resolve(decoded);
            }, (err) => {
                FrostFlake.Log.error(`Failed to decode audio from ${src}.`);
                reject(err);
            });
        });

        let sound = await promise;
        return sound;
    }
}
class Audio {
    context;

    #audioCache = {};

    constructor() {
        this.context = new AudioContext();
    }

    enable() {
        if(this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playSound(url) {
        // TODO: cache created buffers for reuse?
        if(this.audioLoaded(url)) {
            let src = this.context.createBufferSource();
            src.buffer = this.#audioCache[url];
            src.connect(this.context.destination);
            src.start(0);
            return src;
        }
        else {
            FrostFlake.Log.warn(`Audio not loaded ${url}, attempting to load now.`);
            this.loadSound(url);
            return null;
        }
    }

    audioLoaded(url) {
        if(url !== null && 
            url !== '' &&
            url in this.#audioCache && 
            this.#audioCache[url] instanceof AudioBuffer) {
                return true;
            }
        return false;
    }

    loadSound(url, success = null) {
        let xhr = new XMLHttpRequest();
        let me = this;

        // EARLY OUT: bad URL, audio context, or loading in progress
        if(url == '' || 
            url == null || 
            url in this.#audioCache ||
            this.context.state != 'running') {
            return;
        }

        // insert placeholder so audio isn't loaded multiple times
        // if load requests fire quickly
        me.#audioCache[url] = "...";

        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState == XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    if(xhr.response instanceof ArrayBuffer) {
                        me.context.decodeAudioData(xhr.response,
                            // decode succeeded
                            function(decoded) {
                                me.#audioCache[url] = decoded;
                            },
                            // failed to decode
                            function() {
                                FrostFlake.Log.error(`Failed to decode audio for: ${url}`);
                            });
                    }
                    else {
                        FrostFlake.Log.error(`Response was not an ArrayBuffer: ${url}`);
                    }
                }
                else {
                    FrostFlake.Log.error(`Failed to load ${url} with response ${xhr.status}`);
                }
            }
        });

        xhr.responseType = 'arraybuffer';
        xhr.open('GET', url, true);
        xhr.send();
    }
}
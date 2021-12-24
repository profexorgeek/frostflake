import FrostFlake from '../FrostFlake';

export default class Data {

    private static _cache = {};

    static async loadResponse(src) {
        const response = await fetch(src);
        if(!response.ok) {
            const msg = `Bad network response for ${src}`;
            FrostFlake.Log.error(msg)
            throw new Error(msg);
        }

        return response;
    }

    static async loadImage(src, key = null, skipCache = false) {

        // EARLY OUT: return from cache
        if(src in this._cache && !skipCache) {
            return this._cache[src];
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => {
                FrostFlake.Log.error(`Error loading ${src}...`);
                reject(err)
            });
            img.src = src;
        });

        let img = await promise;

        if(!skipCache) {
            let keyName = key == null ? src : key;
            Data.addItem(keyName, img);
        }

        return img;
    }

    static async loadJson(src) {
        const response = await Data.loadResponse(src);
        return await response.json();
    }

    static async loadAudio(src) {
        const response = await Data.loadResponse(src);
        let buffer = response.arrayBuffer();
        return buffer;
    }
    
    
    static clearCache() {
        Data._cache = {};
    }

    static itemExists(key) {
        if(key in Data._cache && Data._cache[key] !== null) {
            return true;
        }
        return false;
    }

    static addItem(key, item) {
        if(Data.itemExists(key)) {
            FrostFlake.Log.warn(`Item already exists for ${key}, overwriting.`);
        }
        Data._cache[key] = item;
    }

    static removeItem(key) {
        if(Data.itemExists(key)) {
            delete Data._cache[key];
        }
    }

    static getItem(key) {
        if(Data.itemExists(key)) {
            return Data._cache[key];
        }
        else {
            FrostFlake.Log.warn(`Bad key requested from cache: ${key}`);
            return null;
        }
    }
}
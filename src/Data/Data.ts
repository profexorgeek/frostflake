import FrostFlake from '../FrostFlake';

export default class Data {

    private static _cache: any = {};

    static async loadResponse(src: string): Promise<Response> {
        const response = await fetch(src);
        if(!response.ok) {
            const msg = `Bad network response for ${src}`;
            FrostFlake.Log.error(msg)
            throw new Error(msg);
        }
        return response;
    }


    static async loadImage(src: string, key: string = null, skipCache: boolean = false): Promise<HTMLImageElement> {

        // EARLY OUT: return from cache
        if(src in this._cache && !skipCache) {
            return this._cache[src];
        }

        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const promiseImage = new Image();
            promiseImage.addEventListener('load', () => resolve(promiseImage));
            promiseImage.addEventListener('error', (err) => {
                FrostFlake.Log.error(`Error loading ${src}...\n${err}`);
                reject(err)
            });
            promiseImage.src = src;
        });

        let img = await promise;

        if(!skipCache) {
            let keyName = key == null ? src : key;
            Data.addItem(keyName, img);
        }

        return img;
    }

    static async loadJson(src: string): Promise<any> {
        const response = await Data.loadResponse(src);
        return await response.json();
    }

    static async loadAudio(src: string): Promise<ArrayBuffer> {
        const response = await Data.loadResponse(src);
        let buffer = response.arrayBuffer();
        return buffer;
    }
    
    
    static clearCache(): void {
        Data._cache = {};
    }

    static itemExists(key: string): boolean {
        if(key in Data._cache && Data._cache[key] !== null) {
            return true;
        }
        return false;
    }

    static addItem(key: string, item: any): void {
        if(Data.itemExists(key)) {
            FrostFlake.Log.warn(`Item already exists for ${key}, overwriting.`);
        }
        Data._cache[key] = item;
    }

    static removeItem(key: string): void {
        if(Data.itemExists(key)) {
            delete Data._cache[key];
        }
    }

    static getItem(key: string): any {
        if(Data.itemExists(key)) {
            return Data._cache[key];
        }
        else {
            FrostFlake.Log.warn(`Bad key requested from cache: ${key}`);
            return null;
        }
    }
}
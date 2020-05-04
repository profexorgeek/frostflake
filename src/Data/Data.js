import FrostFlake from '../FrostFlake.js';

export default class Data {

    static load(url, responseType = 'json', success = null, fail = null) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    FrostFlake.Log.info(`Successfully loaded: ${url}.`);

                    if(success) {
                        success(xhr.response);
                    }
                }
                else {
                    FrostFlake.Log.warn(`Got bad ${xhr.status} response for ${url}.`);

                    if(fail) {
                        fail(xhr.response);
                    }
                }
            }
        });

        xhr.responseType = responseType;
        xhr.open('GET', url, true);
        xhr.send();
    }

    static loadJson(url, success, fail) {
        let me = this;
        Data.load(url, 'json',
            // success
            function(response) {
                if(success) {
                    success(response);
                }
            },
            fail);
    }
}
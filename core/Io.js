/* ===============================================================================================

    IO.JS
    Provides methods for loading objects from JSON or converting them to JSON

    TODOS:
    - JSON.Stringify and Parse fallbacks?
    - Figure out how this fits in to the grander scheme of loading and saving entire levels

================================================================================================*/

/*global console, Image, jQuery*/
var frostFlake = (function (ff, $) {
    "use strict";

    // loads json from a url
    ff.loadJson = function (url, successCallback, failCallback, alwaysCallback) {
        if (!successCallback) {
            successCallback = function (json) {
                console.log("Loaded json from: " + url + " (" + json + ")");
            };
        }

        if (!failCallback) {
            failCallback = function (jqxhr, textStatus, error) {
                console.log("Failed to load JSON: " + textStatus + ", " + error);
            };
        }
        $.getJSON(url).done(successCallback).fail(failCallback).always(alwaysCallback);
    };

    // converts an object to a JSON string. Stubbed to use fallback library.
    ff.toJson = JSON.stringify;

    // parses a json string. Stubbed to eventually use fallback library.
    ff.fromJson = JSON.parse;

    // loads an image from a URL
    ff.loadImage = function (url, loadedCallback) {
        var path = url,
            img;

        img = new Image();
        img.loadEvents = [];
        if (loadedCallback) {
            img.loadEvents.push(loadedCallback);
        }

        // execute callbacks on load
        img.onload = function () {
            var i;
            for (i = 0; i < img.loadEvents.length; i += 1) {
                img.loadEvents[i]();
            }
        };
        img.src = path;
        return img;
    };

    return ff;
}(frostFlake || {}, jQuery));
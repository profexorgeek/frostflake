/* ===============================================================================================

    IO.JS
    Provides methods for loading objects from JSON or converting them to JSON

    TODOS:
    - Provide methods for interfacing with REST/JSON APIs

================================================================================================*/

var frostFlake = (function (ff, $) {
	
	// loads json from a url
    ff.loadJson = function (url, successCallback, failCallback, alwaysCallback) {
        if (!successCallback) {
            successCallback = function (json) {
                console.log("Loaded json from: " + url);
            }
        }

        if (!failCallback) {
            failCallback = function (jqxhr, textStatus, error) {
                console.log("Failed to load JSON: " + textStatus + ", " + error);
            };
        }
        $.getJSON(url).done(successCallback).fail(failCallback).always(alwaysCallback);
    };

    // converts an object to a JSON string
    ff.toJson = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    // parses a json string, WARNING: uses eval
    ff.fromJson = JSON.parse || function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };

    // loads an image from a URL
    ff.loadImage = function (url, loadedCallback) {
        var path = url;
        var img;

        if (url.indexOf("data:") < 0 && url.indexOf("http") < 0) {
            path = ff.constants.CONTENT_DIRECTORY + "/" + url;
            if (path.indexOf(".") < 0) {
                path += ".png";
            }
        }

        img = new Image();
        img.loadEvents = [];
        if (loadedCallback) {
            img.loadEvents.push(loadedCallback);
        }

        // execute callbacks on load
        img.onload = function () {
            for (var i = 0; i < img.loadEvents.length; i += 1) {
                img.loadEvents[i]();
            }
        };

        img.src = path;

        return img;
    };

    return ff;
}(frostFlake || {}, jQuery));
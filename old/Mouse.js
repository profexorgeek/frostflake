/* ===============================================================================================

    MOUSE.JS
    Static library of lookups for mouse buttons

================================================================================================*/

var frostFlake = (function (ff) {
    
    "use strict";

    ff.mouse = {
        // provides button codes by button name
        buttons: {
            "Left": 1,
            "Middle": 2,
            "Right": 3
        },

        // provides button names by button code
        buttonCodes: {
            1: "Left",
            2: "Middle",
            3: "Right"
        }
    };

    return ff;
}(frostFlake || {}));
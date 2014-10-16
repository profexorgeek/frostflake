// frostFlake is redeclared in every file, as a self-executing function that can accept injected dependencies
// frostFlake itself is injected as a dependency so each file can add functionality to frostFlake in any order
var frostFlake = (function (ff) {

    "use strict";

    // add a new class to frostFlake scope
    ff.NewClass = function (param1) {


        // Note about Order:
        // Order of components is a guideline for consistency because scope and exposure can
        // be confusing in JavaScript relative to languages that use scoping keywords.
        // Adhere to order where you can to make intent clear.



        //=======================================================================================
        // 1. PRIVATE FIELDS
        //=======================================================================================
        // fields are usually private and defined in JSLint-complaint manner with comments
        var field1,                // the first example field
            field2;                // the second example field



        //=======================================================================================
        // 2. "CONSTRUCTOR" LOGIC
        //=======================================================================================

        // note that we use the "hasValue" utility method to check for null/undefined
        if (ff.hasValue(param1)) {
            field1 = param1;
        }
        field2 = 42;



        //=======================================================================================
        // 3. GETTER/SETTERS
        //=======================================================================================

        // getter/setters can be named like the field they expose and provide both functions
        this.field2 = function (newValue) {

            // perform any sanity checking and set
            if (ff.hasValue(newValue)) {
                this.field2 = newValue;
            }

            // always return the value
            return field2;
        };

        //=======================================================================================
        // 4. PRIVATE METHODS
        //=======================================================================================

        // methods that will not be used outside of the class should be private
        function sumTwoArguments(arg1, arg2) {
            return arg1 + arg2;
        }


        //=======================================================================================
        // 5. PRIVILEGED METHODS
        //=======================================================================================

        // methods that can be called publicly but operate on private fields or methods 
        // should be defined inside the class definition
        this.sumFields = function () {
            return sumTwoArguments(field1, field2);
        };
    };

    //=======================================================================================
    // 6. PUBLIC METHODS
    //=======================================================================================

    // defining public methods at prototype scope prevents methods from being copied
    // on every instance of the object!
    ff.NewClass.prototype.squareSumOfFields = function () {
        return Math.pow(this.sumFields(), 2);
    };


    //=======================================================================================
    // 7. STATIC METHODS
    //=======================================================================================

    // methods that need no reference to instance variables or methods should be
    // defined on the class itself
    ff.NewClass.getArrayOfInstances = function (parameterArray) {
        var instances = [], i;
        for (i = 0; i < parameterArray.length; i += 1) {
            instances.push(new ff.NewClass(parameterArray[i]));
        }
        return instances;
    };

    // don't forget to return frostFlake, with its newly-added capabilities!
    return ff;

// frostFlake is passed in as a method argument, if it doesn't exist an empty object is passed in
// this allows components to be loaded in any order
// Note that this throws an acceptable error in JSLint regarding use of frostFlake "out of scope"
}(frostFlake || {}));
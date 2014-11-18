/* global QUnit, frostFlake, $ */
$(function () {
    "use strict";

    //==============================================================
    // GENERAL UTILITY METHOD TESTS
    //==============================================================
    QUnit.module("General Utility Tests");
    QUnit.test("hasValue", function (assert) {
        var foo = "bar";

        var nullTest = frostFlake.hasValue(null);
        var undefinedTest = frostFlake.hasValue(undefined);
        var emptyStringTest = frostFlake.hasValue("");
        var fooTest = frostFlake.hasValue(foo);

        assert.strictEqual(nullTest, false, "Null has no value.");
        assert.strictEqual(undefinedTest, false, "Undefined has no value.");
        assert.strictEqual(emptyStringTest, false, "Empty string has no value.");
        assert.strictEqual(fooTest, true, "Foo has value.");
    });

    QUnit.test("defaultIfNoValue", function (assert) {
        var a = 1, b;

        var shouldBeOne = frostFlake.defaultIfNoValue(a, 13);
        var shouldBeTwo = frostFlake.defaultIfNoValue(b, 2);

        assert.strictEqual(shouldBeOne, 1);
        assert.strictEqual(shouldBeTwo, 2);
    });

    QUnit.test("randomHexColor", function (assert) {
        var randomColor = frostFlake.randomHexColor();
        var matches = randomColor.match("#[0-9A-Fa-f]{6}");

        assert.strictEqual(matches.length, 1);
    });

    //==============================================================
    // MATH UTILITY METHOD TESTS
    //==============================================================
    QUnit.module("Math Utility Tests");

    QUnit.test("invert", function (assert) {
        var pi = Math.PI,
            negativePi = -Math.PI;

        assert.strictEqual(negativePi, frostFlake.math.invert(pi));
    });

    QUnit.test("clamp", function (assert) {
        var min = 5,
            max = 10,
            val1 = 15,
            val2 = -15;

        assert.strictEqual(max, frostFlake.math.clamp(val1, min, max));
        assert.strictEqual(min, frostFlake.math.clamp(val2, min, max));
    });

    QUnit.test("lerp", function (assert) {
        assert.strictEqual(8, frostFlake.math.lerp(0, 10, 0.8));
        assert.strictEqual(-8, frostFlake.math.lerp(0, -10, 0.8));
    });

    QUnit.test("square", function (assert) {
        assert.strictEqual(16, frostFlake.math.square(4));
        assert.strictEqual(6.25, frostFlake.math.square(2.5));
    });

    QUnit.test("randomInRange", function (assert) {
        var min = -1000,
            max = 1000,
            val = null,
            iterations = 10,
            i;

        assert.expect(iterations * 2);

        for(i = 0; i < iterations; i++) {
            val = frostFlake.math.randomInRange(min, max);
            assert.strictEqual(true, val < max);
            assert.strictEqual(true, val >= min);
        }
    });

    QUnit.test("randomIntInRange", function (assert) {
        var min = -1000,
            max = 1000,
            val = null,
            iterations = 10,
            i;

        assert.expect(iterations * 3);

        for(i = 0; i < iterations; i++) {
            val = frostFlake.math.randomIntInRange(min, max);
            assert.strictEqual(true, parseInt(val) === val);
            assert.strictEqual(true, val < max);
            assert.strictEqual(true, val >= min);
        }
    });

    
});
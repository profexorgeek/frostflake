// The core game logic, parameters:
// g: reference to the "game" variable, allows this game to be extended via modules loaded in any order
// ff: frostFlake reference
// $: jQuery reference
var game = (function (g, ff, $) {

	var ship;

	// initialize the game
	g.start = function() {
		// get the canvas
		var canvas = $("canvas#game");

		// no right click
		canvas.attr("oncontextmenu", "return false");

		// initialize FRB and pass canvas
		ff.init(canvas[0]);

		// add our custom update method
		ff.customUpdate = function(deltaTime) {
			g.update(deltaTime);
		}

		// create an animated nyan cat!
		var nyan = new g.Nyan();
		ff.addDrawable(nyan);
	}

	// any custom updates the game requires
	g.update = function(deltaTime) {
		
	}

	// ==================================================
	// A new Nyan entity that inherits from Sprite
	// ==================================================
	g.Nyan = ff.Sprite.extend({
		init:function() {
			// call the Sprite constructor with no parameters...
			// will load an empty sprite
			this._super();

			// set animation
			this.loadAnimation("content/nyan_animations.json");
		},

		customUpdate:function(deltaTime) {

		}
	});

	return g;

} (game || {}, frostFlake, jQuery));


// launch the game when the DOM is ready
$(function () {
	game.start();
});
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

		// create a bunch of stars
		for(var i = 0; i < 100; i++) {
			ff.addDrawable(new g.Star(ff.math.randomInRange(2, 4), ff.math.randomInRange(0, 0.75), "#ffffff"));
		}

		// create a ship
		ship = new g.Ship();
		ff.addDrawable(ship);

		// attach the camera
		ff.camera.attachTo(ship);
	}

	// any custom updates the game requires
	g.update = function(deltaTime) {
		
	}

	// ==================================================
	// A new Ship entity that inherits from Sprite
	// ==================================================
	g.Ship = ff.Sprite.extend({
		init: function() {

			// call the Sprite constructor with the "ship" argument
			// frostflake will automatically look for "/content/ship.png"
			this._super("ship");

			// create a custom speed setting for this ship
			this.speed = 100;
		},

		// game loop actions
		customUpdate: function(deltaTime) {
			this._super();

			// set our velocity based on rotation using a utility method
			this.velocity = ff.math.velocityFromAngle(this.rotation, this.speed);

			// slowly increase rotation so we fly in circles
			// note that angle is regulated by the Drawable class and will wrap automatically
			this.rotation += 0.01;
		}
	});


	// ==================================================
	// A new Star entity that inherits from Polygon
	// ==================================================
	g.Star = ff.Polygon.extend({

		// constructor
		init : function(size, alpha, color) {

			// call the Polygon constructor
			this._super();

			// set the color and alpha
			this.lineColor = color;
			this.fillColor = color;
			this.alpha = alpha;

			// a constant to let stars wrap a little past screen edges
			this.wrapPadding = 5;

			// create polygon points for diamond shape
			var halfSize = size / 2;
			this.addPoint(0, halfSize, 0);
			this.addPoint(1, 0, halfSize);
			this.addPoint(2, -halfSize, 0);
			this.addPoint(3, 0, -halfSize);

			this.position = ff.camera.getRandomPointInView();
		},

		// game loop actions
		customUpdate: function(deltaTime) {

			// call parent methods
			this._super();

			// wrap star automatically
			if(this.position.x < ff.camera.viewPort.left - this.wrapPadding) {
				this.position.x = ff.camera.viewPort.right + this.wrapPadding;
				this.position.y = ff.camera.getRandomYInView();
			}
			else if(this.position.x > ff.camera.viewPort.right + this.wrapPadding) {
				this.position.x = ff.camera.viewPort.left - this.wrapPadding;
				this.position.y = ff.camera.getRandomYInView();
			}
			if(this.position.y < ff.camera.viewPort.bottom - this.wrapPadding) {
				this.position.y = ff.camera.viewPort.top + this.wrapPadding;
				this.position.x = ff.camera.getRandomXInView();
			}
			else if(this.position.y > ff.camera.viewPort.top + this.wrapPadding) {
				this.position.y = ff.camera.viewPort.bottom - this.wrapPadding;
				this.position.x = ff.camera.getRandomXInView();
			}

		}
	});

	return g;

} (game || {}, frostFlake, jQuery));


// launch the game when the DOM is ready
$(function () {
	game.start();
});
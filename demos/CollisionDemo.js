import View from '../src/Views/View.js';
import RepositionType from '../src/Positionables/RepositionType.js';
import Sprite from '../src/Positionables/Sprite.js';
import Rectangle from '../src/Positionables/Rectangle.js';
import Frame from '../src/Drawing/Frame.js';
import MathUtil from '../src/Utility/MathUtil.js';
import Data from '../src/Data/Data.js';

// This class demonstrates how to define collision shapes
// on a sprite and how to perform collision using
// FrostFlake's simple built-in physics

export default class CollisionDemo extends View {

    walls = [];
    balls = [];

    async initialize() {
        await super.initialize();

        // load content required by this view
        await Data.loadImage('/content/spritesheet.png');
        await Data.loadImage('/content/frostflake.png');

        // create balls and walls
        this.createWalls();
        this.createBalls();
    }

    update() {
        super.update();

        // During each game tick we must check every ball against
        // walls and against each other using nested loops.
        // In many collision loops, objects are destroyed (such as
        // shots colliding with a target). It is a good practice to 
        // loop in reverse so if an object is destroyed during collision
        // testing, it does not corrupt the loop index!
        for(let i = this.balls.length - 1; i > -1; i--) {

            // create a shortcut reference for readability.
            // This is the outer loop colliding object
            let ball1 = this.balls[i];

            // collide with other balls. We can start our loop at
            // index "i" because every index between i and the array
            // length has already been tested
            for(let j = i; j > -1; j--) {

                // create a shortcut reference for readibility.
                // This is the inner loop colliding object.
                let ball2 = this.balls[j];

                // make sure we're not colliding an object with itself
                if(ball1 != ball2) {

                    // Collide with "bounce repositioning", which will apply physics.
                    // Give each object a weight of 0.5 so they have equal inertia.
                    // Set the bounce force to 1, which means momentum is preserved.
                    // Values less than one will lose momentum, greater than one will gain momentum
                    if(ball1.collision.collideWith(ball2.collision, RepositionType.Bounce, 0.5, 0.5, 1) == true) {
                        ball1.velocity.rotation = MathUtil.randomInRange(-3, 3);
                    }
                }
            }

            // collide with walls
            for(let k = this.walls.length - 1; k > -1; k--) {
                let wall = this.walls[k];
                if(ball1.collision.collideWith(wall.collision, RepositionType.Bounce, 0, 1, 1) == true) {
                    ball1.velocity.rotation = MathUtil.randomInRange(-3, 3);
                }
            }
        }
    }

    // This method creates collideable walls around the view
    // These sprites have axis-aligned rectangle collision and
    // added to an array of walls for collision testing
    createWalls() {

        // create floor and ceiling sprites
        for(let x = 0; x < 20; x++) {
            let w1 = new Sprite('/content/spritesheet.png');
            w1.collision = new Rectangle(32, 32);
            w1.frame = new Frame(7 * 32, 1 * 32, 32, 32);
            w1.x = -320 + (x * 32) + 16;
            w1.y = 240 - 16;
            this.walls.push(w1);
            this.addChild(w1);

            let w2 = new Sprite('/content/spritesheet.png');
            w2.collision = new Rectangle(32, 32);
            w2.frame = new Frame(7 * 32, 1 * 32, 32, 32);
            w2.x = -320 + (x * 32) + 16;
            w2.y = -240 + 16;
            this.walls.push(w2);
            this.addChild(w2);
        }

        // create walls
        for(let y = 0; y < 14; y++) {
            let w1 = new Sprite('/content/spritesheet.png');
            w1.collision = new Rectangle(32, 32);
            w1.frame = new Frame(7 * 32, 1 * 32, 32, 32);
            w1.x = -320 + 16;
            w1.y = -240 + (y * 32) + 16;
            this.walls.push(w1);
            this.addChild(w1);

            let w2 = new Sprite('/content/spritesheet.png');
            w2.collision = new Rectangle(32, 32);
            w2.frame = new Frame(7 * 32, 1 * 32, 32, 32);
            w2.x = 320 - 16;
            w2.y = -240 + (y * 32) + 16;
            this.walls.push(w2);
            this.addChild(w2);
        }
    }

    // This method creates some ball sprites
    // that have circle collision. The sprites have
    // random positions and velocity so they bounce
    // around the view. Each sprite is added to
    // a collection of balls for collision testing.
    createBalls() {
        // make some things to collide
        for(let i = 0; i < 25; i++) {
            let s = new Sprite('/content/frostflake.png');
            s.position.x = MathUtil.randomInRange(-200, 200);
            s.position.y = MathUtil.randomInRange(-200, 200);
            s.velocity.x = MathUtil.randomInRange(-300, 300);
            s.velocity.y = MathUtil.randomInRange(-300, 300);
            this.balls.push(s);
            this.addChild(s);
        }
    }
}
import Circle from './Circle';
import Rectangle from './Rectangle';
import RepositionType from './RepositionType';
import Positionable from './Positionable';
import Position from './Position';
import FrostFlake from '../FrostFlake';

export default class Shape extends Positionable {

    constructor() {
        super();
    }

    isPointInside(x: number, y:number): boolean {
        // This method should be overridden in child shapes...
        // if it is not, throw a not implemented exception.
        throw "This is not implemented on this shape yet!";
    }

    collideWith(
        shape: Shape,
        repoType: RepositionType = RepositionType.None,
        thisWeight = 1,
        targetWeight = 0,
        repoForce = 1
        ): boolean {

        // intentionally empty, child types must implement
        const msg = "Not implemented: Attempted to collide generic shape object.";
        FrostFlake.Log.error(msg);
        throw msg;
    }

    static collideCircleVsCircle(
        circle1: Circle,
        circle2: Circle,
        repositionType: RepositionType = RepositionType.None,
        circle1Weight = 1,
        circle2Weight = 0,
        forceScale = 1
        ): boolean {

        // figure out if we're overlapping by calculating
        // if the distance apart is less than the sum of the radii
        const delta = circle2.absolutePosition.subtract(circle1.absolutePosition);
        const distApart = delta.length;
        const collideDist = Math.abs(circle1.radius) + Math.abs(circle2.radius);
        const overlap = collideDist - distApart;
        const didCollide = overlap > 0;

        if(didCollide && repositionType != RepositionType.None) {
            const normalDelta = delta.normalize();

            // just pick a default direction in case of perfect overlap
            if(normalDelta.length == 0) {
                normalDelta.y = 1;
            }
            
            const circle1Factor = circle2Weight / (circle1Weight + circle2Weight);
            const circle2Factor = circle1Weight / (circle1Weight + circle2Weight);

            circle1.root.position.x += normalDelta.x * -(overlap * circle1Factor);
            circle1.root.position.y += normalDelta.y * -(overlap * circle1Factor);

            circle2.root.position.x += normalDelta.x * (overlap * circle2Factor);
            circle2.root.position.y += normalDelta.y * (overlap * circle2Factor);

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = circle1.root.velocity.subtract(circle2.root.velocity).dot(normalDelta) * forceScale;
                
                const circle1VelocityAdjust = normalDelta.multiplySingle(velocityLength * circle1Factor);
                circle1.root.velocity.x -= circle1VelocityAdjust.x * 2;
                circle1.root.velocity.y -= circle1VelocityAdjust.y * 2;

                const circle2VelocityAdjust = normalDelta.multiplySingle(velocityLength * circle2Factor);
                circle2.root.velocity.x += circle2VelocityAdjust.x * 2;
                circle2.root.velocity.y += circle2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideCircleVsRect(
        circle: Circle,
        rect: Rectangle,
        repositionType: RepositionType = RepositionType.None,
        circleWeight = 1,
        rectWeight = 0,
        forceScale = 1
        ): boolean {

        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        const xCollisionDist = Math.abs(circle.radius) + (Math.abs(rect.width) / 2);
        const xDist = circle.absolutePosition.x - rect.absolutePosition.x;
        const xOverlap = xCollisionDist - Math.abs(xDist);
        const yCollisionDist = Math.abs(circle.radius) + (Math.abs(rect.height) / 2);
        const yDist = circle.absolutePosition.y - rect.absolutePosition.y;
        const yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        const didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            // TODO: handle corners!

            const normalDelta = new Position(
                (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                (xOverlap >= yOverlap ? 1 : 0) * Math.sign(yDist));

            // just pick a default direction in case of perfect overlap
            if(normalDelta.length == 0) {
                normalDelta.y = 1;
            }

            const circleFactor = rectWeight / (circleWeight + rectWeight);
            const rectFactor = circleWeight / (circleWeight + rectWeight);

            circle.root.position.x += normalDelta.x * xOverlap * circleFactor;
            circle.root.position.y += normalDelta.y * yOverlap * circleFactor;

            rect.root.position.x -= normalDelta.x * xOverlap * rectFactor;
            rect.root.position.y -= normalDelta.y * yOverlap * rectFactor;

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = circle.root.velocity.subtract(rect.root.velocity).dot(normalDelta) * forceScale;
                
                const circleVelocityAdjust = normalDelta.multiplySingle(velocityLength * circleFactor);
                circle.root.velocity.x -= circleVelocityAdjust.x * 2;
                circle.root.velocity.y -= circleVelocityAdjust.y * 2;

                const rectVelocityAdjust = normalDelta.multiplySingle(velocityLength * rectFactor);
                rect.root.velocity.x += rectVelocityAdjust.x * 2;
                rect.root.velocity.y += rectVelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideRectVsRect(
        rect1: Rectangle,
        rect2: Rectangle,
        repositionType: RepositionType = RepositionType.None,
        rect1Weight = 1,
        rect2Weight = 0,
        forceScale = 1
        ): boolean {

        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        const xCollisionDist = (rect1.width / 2) + (rect2.width / 2);
        const xDist = rect1.absolutePosition.x - rect2.absolutePosition.x;
        const xOverlap = xCollisionDist - Math.abs(xDist);
        const yCollisionDist = (rect1.height / 2) + (rect2.height / 2);
        const yDist = rect1.absolutePosition.y - rect2.absolutePosition.y;
        const yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        const didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            const normalDelta = new Position(
                (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                (xOverlap <= yOverlap ? 0 : 1) * Math.sign(yDist));

            // just pick a default direction in case of perfect overlap
            if(normalDelta.length == 0) {
                normalDelta.y = 1;
            }

            const rect1Factor = rect2Weight / (rect1Weight + rect2Weight);
            const rect2Factor = rect1Weight / (rect1Weight + rect2Weight);

            rect1.root.position.x += normalDelta.x * xOverlap * rect1Factor;
            rect1.root.position.y += normalDelta.y * yOverlap * rect1Factor;

            rect2.root.position.x -= normalDelta.x * xOverlap * rect2Factor;
            rect2.root.position.y -= normalDelta.y * yOverlap * rect2Factor;

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = rect1.root.velocity.subtract(rect2.root.velocity).dot(normalDelta) * forceScale;
                
                const r1VelocityAdjust = normalDelta.multiplySingle(velocityLength * rect1Factor);
                rect1.root.velocity.x -= r1VelocityAdjust.x * 2;
                rect1.root.velocity.y -= r1VelocityAdjust.y * 2;

                const r2VelocityAdjust = normalDelta.multiplySingle(velocityLength * rect2Factor);
                rect2.root.velocity.x += r2VelocityAdjust.x * 2;
                rect2.root.velocity.y += r2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }
}
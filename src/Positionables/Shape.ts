import Circle from './Circle';
import MathUtil from '../Utility/MathUtil';
import Rectangle from './Rectangle';
import RepositionType from './RepositionType';
import Positionable from './Positionable';
import Position from './Position';

export default class Shape extends Positionable {

    constructor() {
        super();
    }

    collideWith(
        shape: Shape,
        repoType: RepositionType = RepositionType.None,
        thisWeight: number = 1,
        targetWeight: number = 0,
        repoForce = 1
        ): boolean {
            
        // intentionally empty, child types must implement
        return false;
    }

    static collideCircleVsCircle(
        circle1: Circle,
        circle2: Circle,
        repositionType: RepositionType = RepositionType.None,
        circle1Weight: number = 1,
        circle2Weight: number = 0,
        forceScale: number = 1
        ): boolean {

        // figure out if we're overlapping by calculating
        // if the distance apart is less than the sum of the radii
        const delta = MathUtil.vectorSubtract(circle2.absolutePosition, circle1.absolutePosition);
        const distApart = MathUtil.vectorLength(delta);
        const collideDist = Math.abs(circle1.radius) + Math.abs(circle2.radius);
        const overlap = collideDist - distApart;
        const didCollide = overlap > 0;

        if(didCollide && repositionType != RepositionType.None) {
            const normalDelta = MathUtil.vectorNormalize(delta);

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }
            
            const circle1Factor = circle2Weight / (circle1Weight + circle2Weight);
            const circle2Factor = circle1Weight / (circle1Weight + circle2Weight);

            circle1.root.position.x += normalDelta.x * -(overlap * circle1Factor);
            circle1.root.position.y += normalDelta.y * -(overlap * circle1Factor);

            circle2.root.position.x += normalDelta.x * (overlap * circle2Factor);
            circle2.root.position.y += normalDelta.y * (overlap * circle2Factor);

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle1.root.velocity, circle2.root.velocity), normalDelta) * forceScale;
                
                const circle1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle1Factor);
                circle1.root.velocity.x -= circle1VelocityAdjust.x * 2;
                circle1.root.velocity.y -= circle1VelocityAdjust.y * 2;

                const circle2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle2Factor);
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
        circleWeight: number = 1,
        rectWeight: number = 0,
        forceScale: number = 1
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

            let normalDelta = new Position(
                (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                (xOverlap >= yOverlap ? 1 : 0) * Math.sign(yDist));

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            const circleFactor = rectWeight / (circleWeight + rectWeight);
            const rectFactor = circleWeight / (circleWeight + rectWeight);

            circle.root.position.x += normalDelta.x * xOverlap * circleFactor;
            circle.root.position.y += normalDelta.y * yOverlap * circleFactor;

            rect.root.position.x -= normalDelta.x * xOverlap * rectFactor;
            rect.root.position.y -= normalDelta.y * yOverlap * rectFactor;

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle.root.velocity, rect.root.velocity), normalDelta) * forceScale;
                
                const circleVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circleFactor);
                circle.root.velocity.x -= circleVelocityAdjust.x * 2;
                circle.root.velocity.y -= circleVelocityAdjust.y * 2;

                const rectVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rectFactor);
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
        rect1Weight: number = 1,
        rect2Weight: number = 0,
        forceScale: number = 1
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

            let normalDelta = new Position(
                (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                (xOverlap <= yOverlap ? 0 : 1) * Math.sign(yDist));

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            const rect1Factor = rect2Weight / (rect1Weight + rect2Weight);
            const rect2Factor = rect1Weight / (rect1Weight + rect2Weight);

            rect1.root.position.x += normalDelta.x * xOverlap * rect1Factor;
            rect1.root.position.y += normalDelta.y * yOverlap * rect1Factor;

            rect2.root.position.x -= normalDelta.x * xOverlap * rect2Factor;
            rect2.root.position.y -= normalDelta.y * yOverlap * rect2Factor;

            if(repositionType == RepositionType.Bounce) {
                const velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(rect1.root.velocity, rect2.root.velocity), normalDelta) * forceScale;
                
                const r1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect1Factor);
                rect1.root.velocity.x -= r1VelocityAdjust.x * 2;
                rect1.root.velocity.y -= r1VelocityAdjust.y * 2;

                const r2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect2Factor);
                rect2.root.velocity.x += r2VelocityAdjust.x * 2;
                rect2.root.velocity.y += r2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }
}
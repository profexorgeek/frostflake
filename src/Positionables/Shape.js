class Shape extends Positionable {

    constructor() {
        super();
    }

    get absolutePosition() {
        let absPos = {x: 0, y: 0, rotation: 0};

        if(this.parent != null) {
            let parentAbsPos = this.parent.absolutePosition;
            let magnitude = MathUtil.length(this.x, this.y);
            absPos.x = Math.cos(parentAbsPos.rotation) * magnitude + parentAbsPos.x;
            absPos.y = Math.sin(parentAbsPos.rotation) * magnitude + parentAbsPos.y;
            absPos.rotation = parentAbsPos.rotation + this.rotation;
        }
        else {
            absPos.x = this.x;
            absPos.y = this.y;
            absPos.rotation = this.rotation;
        }

        return absPos;
    }

    static collideCircleVsCircle(circle1, circle2, repositionType = RepositionType.None, circle1Weight = 1, circle2Weight = 0, forceScale = 1) {
        // figure out if we're overlapping by calculating
        // if the distance apart is less than the sum of the radii
        let delta = MathUtil.vectorSubtract(circle2.absolutePosition, circle1.absolutePosition);
        let distApart = MathUtil.length(delta.x, delta.y);
        let collideDist = circle1.radius + circle2.radius;
        let overlap = collideDist - distApart;
        let didCollide = overlap > 0;

        if(didCollide && repositionType != RepositionType.None) {
            let normalDelta = MathUtil.vectorNormalize(delta);

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }
            
            let circle1Factor = circle2Weight / (circle1Weight + circle2Weight);
            let circle2Factor = circle1Weight / (circle1Weight + circle2Weight);

            circle1.root.position.x += normalDelta.x * -(overlap * circle1Factor);
            circle1.root.position.y += normalDelta.y * -(overlap * circle1Factor);

            circle2.root.position.x += normalDelta.x * (overlap * circle2Factor);
            circle2.root.position.y += normalDelta.y * (overlap * circle2Factor);

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle1.root.velocity, circle2.root.velocity), normalDelta) * forceScale;
                
                let circle1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle1Factor);
                circle1.root.velocity.x -= circle1VelocityAdjust.x * 2;
                circle1.root.velocity.y -= circle1VelocityAdjust.y * 2;

                let circle2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circle2Factor);
                circle2.root.velocity.x += circle2VelocityAdjust.x * 2;
                circle2.root.velocity.y += circle2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideCircleVsRect(circle, rect, repositionType = RepositionType.None, circleWeight = 1, rectWeight = 0, forceScale = 1) {
        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        let xCollisionDist = circle.radius + (rect.width / 2);
        let xDist = circle.absolutePosition.x - rect.absolutePosition.x;
        let xOverlap = xCollisionDist - Math.abs(xDist);

        let yCollisionDist = circle.radius + (rect.height / 2);
        let yDist = circle.absolutePosition.y - rect.absolutePosition.y;
        let yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        let didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            // TODO: handle corners!

            let normalDelta = {
                x: (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                y: (xOverlap >= yOverlap ? 1 : 0) * Math.sign(yDist)
            };

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            let circleFactor = rectWeight / (circleWeight + rectWeight);
            let rectFactor = circleWeight / (circleWeight + rectWeight);

            circle.root.position.x += normalDelta.x * xOverlap * circleFactor;
            circle.root.position.y += normalDelta.y * yOverlap * circleFactor;

            rect.root.position.x -= normalDelta.x * xOverlap * rectFactor;
            rect.root.position.y -= normalDelta.y * yOverlap * rectFactor;

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(circle.root.velocity, rect.root.velocity), normalDelta) * forceScale;
                
                let circleVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * circleFactor);
                circle.root.velocity.x -= circleVelocityAdjust.x * 2;
                circle.root.velocity.y -= circleVelocityAdjust.y * 2;

                let rectVelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rectFactor);
                rect.root.velocity.x += rectVelocityAdjust.x * 2;
                rect.root.velocity.y += rectVelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }

    static collideRectVsRect(rect1, rect2, repositionType = RepositionType.None, rect1Weight = 1, rect2Weight = 0, forceScale = 1) {
        // figure out if we're overlapping on each axis by
        // calculating if the distance apart is larger than
        // the sum of half of the widths
        let xCollisionDist = (rect1.width / 2) + (rect2.width / 2);
        let xDist = rect1.absolutePosition.x - rect2.absolutePosition.x;
        let xOverlap = xCollisionDist - Math.abs(xDist);

        let yCollisionDist = (rect1.height / 2) + (rect2.height / 2);
        let yDist = rect1.absolutePosition.y - rect2.absolutePosition.y;
        let yOverlap = yCollisionDist - Math.abs(yDist);

        // if overlap is positive on both axis, there's a collision
        let didCollide = (xOverlap > 0) && (yOverlap > 0);

        if(didCollide && repositionType != RepositionType.None) {

            let normalDelta = {
                x: (xOverlap <= yOverlap ? 1 : 0) * Math.sign(xDist),
                y: (xOverlap <= yOverlap ? 0 : 1) * Math.sign(yDist)
            };

            // just pick a default direction in case of perfect overlap
            if(MathUtil.vectorLength(normalDelta) == 0) {
                normalDelta.y = 1;
            }

            let rect1Factor = rect2Weight / (rect1Weight + rect2Weight);
            let rect2Factor = rect1Weight / (rect1Weight + rect2Weight);

            rect1.root.position.x += normalDelta.x * xOverlap * rect1Factor;
            rect1.root.position.y += normalDelta.y * yOverlap * rect1Factor;

            rect2.root.position.x -= normalDelta.x * xOverlap * rect2Factor;
            rect2.root.position.y -= normalDelta.y * yOverlap * rect2Factor;

            if(repositionType == RepositionType.Bounce) {
                let velocityLength = MathUtil.vectorDot(MathUtil.vectorSubtract(rect1.root.velocity, rect2.root.velocity), normalDelta) * forceScale;
                
                let r1VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect1Factor);
                rect1.root.velocity.x -= r1VelocityAdjust.x * 2;
                rect1.root.velocity.y -= r1VelocityAdjust.y * 2;

                let r2VelocityAdjust = MathUtil.vectorMultiply(normalDelta, velocityLength * rect2Factor);
                rect2.root.velocity.x += r2VelocityAdjust.x * 2;
                rect2.root.velocity.y += r2VelocityAdjust.y * 2;
            }
        }

        return didCollide;
    }
}
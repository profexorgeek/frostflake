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
        let c1Pos = circle1.absolutePosition;
        let c2Pos = circle2.absolutePosition;
        let delta = MathUtil.vectorSubtract(c1Pos, c2Pos);
        let distApart = MathUtil.length(delta.x, delta.y);
        let collideDist = circle1.radius + circle2.radius;
        let didCollide = distApart < collideDist;

        if(didCollide && repositionType != RepositionType.None) {
            // figure out the move percent for each shape
            let weightSum = circle1Weight + circle2Weight;
            let c1Factor = 1 - circle1Weight / weightSum;
            let c2Factor = 1 - circle2Weight / weightSum;
            let c1X = circle1.absolutePosition.x;
            let c1Y = circle1.absolutePosition.y;
            let c2X = circle2.absolutePosition.x;
            let c2Y = circle2.absolutePosition.y;
            
            // move the circles at inverse angles according to their weight
            let overlap = collideDist - distApart;
            let angle = Math.atan2(delta.y, delta.x) - Math.PI;
            let inverseAngle = MathUtil.normalizeAngle(angle - Math.PI);

            circle1.moveRootX(Math.cos(inverseAngle) * overlap * c1Factor);
            circle1.moveRootY(Math.sin(inverseAngle) * overlap * c1Factor);
            circle2.moveRootX(Math.cos(angle) * overlap * c2Factor);
            circle2.moveRootY(Math.sin(angle) * overlap * c2Factor);

            if(repositionType == RepositionType.Bounce) {
                Shape.Bounce(c1X, c1Y, circle1, forceScale);
                Shape.Bounce(c2X, c2Y, circle2, forceScale);
            }
        }

        return didCollide;
    }

    static collideRectVsRect(rect1, rect2, repositionType = RepositionType.None, rect1Weight = 1, rect2Weight = 0, repositionForce = 1) {
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

            // figure out what percent each shape should move
            let weightSum = rect1Weight + rect2Weight;
            let rect1Factor = 1- rect1Weight / weightSum;
            let rect2Factor = 1- rect2Weight / weightSum;

            // we want to move in the smallest direction
            // the Dist variables tell us which DIRECTION to move
            // the overlap variables tell us the AMOUNT.
            if(xOverlap < yOverlap) {
                rect1.moveRootX(xOverlap * Math.sign(xDist) * rect1Factor);
                rect2.moveRootX(xOverlap * Math.sign(xDist) * -rect2Factor);
            }
            else {
                rect1.moveRootY(yOverlap * Math.sign(yDist) * rect1Factor);
                rect2.moveRootY(yOverlap * Math.sign(yDist) * -rect2Factor);
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
            // figure out what percent each shape should move
            let weightSum = circleWeight + rectWeight;
            let circleFactor = 1 - circleWeight / weightSum;
            let rectFactor = 1- rectWeight / weightSum;
            let circleX = circle.absolutePosition.x;
            let circleY = circle.absolutePosition.y;
            let rectX = rect.absolutePosition.x;
            let rectY = rect.absolutePosition.y;

            // TODO: this isn't accurate but it might be good enough
            if(xOverlap < yOverlap) {
                circle.moveRootX(xOverlap * Math.sign(xDist) * circleFactor);
                rect.moveRootX(xOverlap * Math.sign(xDist) * -rectFactor);
            }
            else {
                circle.moveRootY(yOverlap * Math.sign(yDist) * circleFactor);
                rect.moveRootY(yOverlap * Math.sign(yDist) * -rectFactor);
            }

            if(repositionType == RepositionType.Bounce) {
                Shape.Bounce(circleX, circleY, circle, forceScale);
                Shape.Bounce(rectX, rectY, rect, forceScale);
            }
        }

        return didCollide;
    }

    static Bounce(prevX, prevY, shape, forceScale = 1) {
        let moveX = shape.absolutePosition.x - prevX;
        let moveY = shape.absolutePosition.y - prevY;
        let moveAngle = Math.atan2(moveY, moveX);
        let bounceForce = MathUtil.length(shape.root.velocity.x, shape.root.velocity.y) * forceScale;
        shape.root.velocity.x = Math.cos(moveAngle) * bounceForce;
        shape.root.velocity.y = Math.sin(moveAngle) * bounceForce;
    }
}
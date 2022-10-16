class IteractionHelpers {
  lineLineIntersection(l1p1, l1p2, l2p1, l2p2) {
    const uA =
      ((l2p2.x - l2p1.x) * (l1p1.y - l2p1.y) -
        (l2p2.y - l2p1.y) * (l1p1.x - l2p1.x)) /
      ((l2p2.y - l2p1.y) * (l1p2.x - l1p1.x) -
        (l2p2.x - l2p1.x) * (l1p2.y - l1p1.y));
    const uB =
      ((l1p2.x - l1p1.x) * (l1p1.y - l2p1.y) -
        (l1p2.y - l1p1.y) * (l1p1.x - l2p1.x)) /
      ((l2p2.y - l2p1.y) * (l1p2.x - l1p1.x) -
        (l2p2.x - l2p1.x) * (l1p2.y - l1p1.y));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return {
        x: l1p1.x + uA * (l1p2.x - l1p1.x),
        y: l1p1.y + uA * (l1p2.y - l1p1.y),
      };
    }

    return false;
  }

  circleCircleCollision(c1, c2) {
    const distance = getDistanceBetweenPoints(c1, c2);

    return distance < c1.r + c2.r;
  }

  pointCircleCollision(p, c) {
    return circleCircleCollision({ ...p, r: 0 }, c);
  }

  linePointCollision(l, p) {
    const d1 = getDistanceBetweenPoints(p, l.p1);
    const d2 = getDistanceBetweenPoints(p, l.p2);
    const lineLen = getLineLength(l);
    const buffer = 0.1;

    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
  }

  lineCircleCollision = (l, c) => {
    const x1 = l.p1.x;
    const y1 = l.p1.y;
    const x2 = l.p2.x;
    const y2 = l.p2.y;
    const cx = c.x;
    const cy = c.y;
    const r = c.r;

    const len = getLineLength(l);
    const dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / (len * len);
    const closestPoint = {
      x: x1 + dot * (x2 - x1),
      y: y1 + dot * (y2 - y1),
    };

    if (!linePointCollision(l, closestPoint)) {
      return false;
    }

    if (getDistanceBetweenPoints(closestPoint, c) <= r) {
      return closestPoint;
    }

    return false;
  };

  /**
   * проверка пересечений между кругом и линией
   * @param {*} circle instace
   * @param {*} line point { from, to }
   * @returns boolean
   */
  collisionCircleLine = (circle, line) => {
    const side1 = Math.sqrt(
      Math.pow(circle.x - line.from.x, 2) + Math.pow(circle.y - line.from.y, 2)
    );
    const side2 = Math.sqrt(
      Math.pow(circle.x - line.to.x, 2) + Math.pow(circle.y - line.to.y, 2)
    );
    const base = Math.sqrt(
      Math.pow(line.to.x - line.from.x, 2) +
        Math.pow(line.to.y - line.from.y, 2)
    );
    if (circle.radius > side1 || circle.radius > side2) return true;
    const angle1 =
      Math.atan2(line.to.x - line.from.x, line.to.y - line.from.y) -
      Math.atan2(circle.x - line.from.x, circle.y - line.from.y); // Some complicated Math
    const angle2 =
      Math.atan2(line.from.x - line.to.x, line.from.y - line.to.y) -
      Math.atan2(circle.x - line.to.x, circle.y - line.to.y); // Some complicated Math again
    if (angle1 > Math.PI / 2 || angle2 > Math.PI / 2)
      // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
      return false;
    // Now if none are true then

    const semiperimeter = (side1 + side2 + base) / 2;

    const areaOfTriangle = Math.sqrt(
      semiperimeter *
        (semiperimeter - side1) *
        (semiperimeter - side2) *
        (semiperimeter - base)
    ); // Heron's formula for the area

    const height = (2 * areaOfTriangle) / base;

    if (height < circle.radius) return true;
    return false;
  };
}

class GeometryHelpers {
  getDistanceBetweenPoints(p1, p2) {
    const result = Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    );
    return result;
  }

  getPointFromPointAndAngle(start, angle, length, addedAngle) {
    const pX = start.x + length * Math.cos(angle + addedAngle);
    const pY = start.y + length * Math.sin(angle + addedAngle);
    return { x: pX, y: pY };
  }

  getAngleBetweenPoints(p1, p2) {
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    if (angle < 0) return angle + Math.PI * 2;
    return angle;
  }

   arePointsEqual = (p1, p2) => {
    return Math.abs(p1.x - p2.x) < ACCURACY && Math.abs(p1.y - p2.y) < ACCURACY;
  };

  /**
 * центр между двумя точками
 * линейная интерполяция в 2д векторах
 * @param {*} v1
 * @param {*} v2
 */
 lerpVector2  (v1, v2, alpha = 0.5)  {
    const x = v1.x + (.x - v1.x) * alpha;
    const y = v1.y + (v2.y - v1.y) * alpha;
    return { x, y };
  };

  /**
 * получит угол направление отрезка
 * @param {*} coords
 */
 getAngleFromStraight (coords)  {
  return Math.atan(
    (coords.from.y - coords.to.y) / (coords.from.x - coords.to.x)
  );
};

rotateVector  (vector, alpha)  {
  const cos = Math.cos(alpha);
  const sin = Math.sin(alpha);
  const newvector = { x: 0, y: 0 };
  newvector.x = vector.x * cos - vector.y * sin;
  newvector.y = vector.x * sin + vector.y * cos;
  return newvector;
};

/**
 * Вращение отрезка вокруг своего конца
 * @param {*} coords
 * @param isPositiveAngle
 * @returns vector2
 */
  rotationsVector2 (coords, distance = 100, angle = 0)  {
  const { from, to } = coords;
  const line1 = {
    p1: from,
    p2: to,
  };
  const line2 = {
    p1: to,
    p2: {
      x: null,
      y: null,
    },
  };
  const l1Angle = getAngleBetweenPoints(line1.p1, line1.p1);
  const radianAddAngle = Math.abs((angle / 180) * Math.PI);
  line2.p2.x = to.x + distance * Math.cos(radianAddAngle + l1Angle);
  line2.p2.y = to.y + distance * Math.sin(radianAddAngle + l1Angle);

  return {
    ...coords,
    to: {
      x: line2.p2.x,
      y: line2.p2.y,
    },
  };
};


 getAreaInPoligon = (points, signed)  {
  let square = 0;
  let x, y;
  for (let i = 0; i < points.length - 1; ++i) {
    y = points[i].y + points[i + 1].y;
    x = points[i].x - points[i + 1].x;
    square += y * x;
  }
  y = points[points.length - 1].y + points[0].y;
  x = points[points.length - 1].x - points[0].x;
  square += y * x;
  const results = Math.abs(square) / 2;
  return results / 10000;
};

 getClosestPointOnLines (pXy, aXys)  {
  var minDist;
  var fTo;
  var fFrom;
  var x;
  var y;
  var i;
  var dist;

  if (aXys.length > 1) {
    for (var n = 1; n < aXys.length; n++) {
      if (aXys[n].x != aXys[n - 1].x) {
        var a = (aXys[n].y - aXys[n - 1].y) / (aXys[n].x - aXys[n - 1].x);
        var b = aXys[n].y - a * aXys[n].x;
        dist = Math.abs(a * pXy.x + b - pXy.y) / Math.sqrt(a * a + 1);
      } else dist = Math.abs(pXy.x - aXys[n].x);

      // length^2 of line segment
      var rl2 =
        Math.pow(aXys[n].y - aXys[n - 1].y, 2) +
        Math.pow(aXys[n].x - aXys[n - 1].x, 2);

      // distance^2 of pt to end line segment
      var ln2 = Math.pow(aXys[n].y - pXy.y, 2) + Math.pow(aXys[n].x - pXy.x, 2);

      // distance^2 of pt to begin line segment
      var lnm12 =
        Math.pow(aXys[n - 1].y - pXy.y, 2) + Math.pow(aXys[n - 1].x - pXy.x, 2);

      // minimum distance^2 of pt to infinite line
      var dist2 = Math.pow(dist, 2);

      // calculated length^2 of line segment
      var calcrl2 = ln2 - dist2 + lnm12 - dist2;

      // redefine minimum distance to line segment (not infinite line) if necessary
      if (calcrl2 > rl2) dist = Math.sqrt(Math.min(ln2, lnm12));

      if (minDist == null || minDist > dist) {
        if (calcrl2 > rl2) {
          if (lnm12 < ln2) {
            fTo = 0; //nearer to previous point
            fFrom = 1;
          } else {
            fFrom = 0; //nearer to current point
            fTo = 1;
          }
        } else {
          // perpendicular from point intersects line segment
          fTo = Math.sqrt(lnm12 - dist2) / Math.sqrt(rl2);
          fFrom = Math.sqrt(ln2 - dist2) / Math.sqrt(rl2);
        }
        minDist = dist;
        i = n;
      }
    }

    var dx = aXys[i - 1].x - aXys[i].x;
    var dy = aXys[i - 1].y - aXys[i].y;

    x = aXys[i - 1].x - dx * fTo;
    y = aXys[i - 1].y - dy * fTo;
  }

  return { x: x, y: y, i: i, fTo: fTo, fFrom: fFrom };
};
}

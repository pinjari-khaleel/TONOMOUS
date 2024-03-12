/**
 The MIT License (MIT)

 Copyright (c) 2013 kimchristiansen
 Typescript and -1 to 1 version by Mattijs Kneppers

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

interface PDPoint {
  x: number;
  y: number;
  r: number;
}

export default class PoissonDiskSampler {
  private pointList: Array<PDPoint> = [];
  private maxPoints = 500; // note, more points get exponentially heavier to generate
  private medianRadius = 0.017; // tweaked to result in a bit under 500 points
  private radiusDeviation = 0; // keep at 0 for now, since we can't predict the resulting amount of points, so we
  // don't know when the maximum is reached.
  private maxFails = 500;

  constructor() {
    this.createPoints();
    this.pointList = this.pointList.map(function (a: PDPoint): PDPoint {
      return { x: a.x * 2 - 1, y: a.y * 2 - 1, r: a.r * 2 };
    });

    this.pointList.sort(function (a: PDPoint, b: PDPoint): number {
      let lenA = Math.sqrt(a.x * a.x + a.y * a.y);
      let lenB = Math.sqrt(b.x * b.x + b.y * b.y);

      return lenA - lenB;
    });
    //
    // console.log("PoissonDisk: num points: " + this.pointList.length);
  }

  /**
   *
   *
   * @param numPoints: number of points.
   * @param deviation: the amount fo deviation of each point within its circle. between 0 and 1. higher than 1 means
   *     each point can leave its sphere
   * @returns {{x: number, y: number}[]} an array of x and y coordinates with values between -1 and 1
   */

  public getDiskArray(numPoints: number, deviation: number): { x: number; y: number }[] {
    let pointsArray: PDPoint[] = [];

    let maxX = 0;
    let maxY = 0;
    if (numPoints <= this.pointList.length) {
      for (const point of this.pointList) {
        pointsArray.push(point);

        if (Math.abs(point.x) > maxX) {
          maxX = Math.abs(point.x);
        }
        if (Math.abs(point.y) > maxY) {
          maxY = Math.abs(point.y);
        }

        if (pointsArray.length >= numPoints) {
          break;
        }
      }
    } else {
      console.error(
        'Problem getting ' +
          numPoints +
          ' points from PoissonDisk, this exceeds the available number of ' +
          this.pointList.length +
          ' points.',
      );
    }

    const result = pointsArray.map(function (a: PDPoint): PDPoint {
      return { x: a.x / maxX, y: a.y / maxY, r: a.r };
    });

    const resultRandomized = result.map(function (a: PDPoint): { x: number; y: number } {
      return {
        x: a.x + deviation * (Math.random() * 2 - 1) * a.r,
        y: a.y + deviation * (Math.random() * 2 - 1) * a.r,
      };
    });

    return resultRandomized;
  }

  public getNumPoints() {
    return this.pointList.length;
  }

  private createPoints() {
    var nr = 0,
      pp = null,
      numFailed = 0;

    while (nr < this.maxPoints && numFailed < this.maxFails) {
      if (nr === 0) {
        pp = this.createFirstPoint();
      } else {
        if (pp !== null) {
          pp = this.generateRandomAround(pp);
        }
      }

      if (this.hitTest(<PDPoint>pp)) {
        this.pointList[nr] = <PDPoint>pp;
        nr++;
        numFailed = 0;
      } else {
        numFailed++;
      }
    }
  }

  public hitTest(p_point: PDPoint) {
    var l = this.pointList.length,
      d = 0,
      dx = 0,
      dy = 0,
      i = l,
      pTemp;

    if (l > 0) {
      while (i--) {
        pTemp = this.pointList[i];
        dx = pTemp.x - p_point.x;
        dy = pTemp.y - p_point.y;
        d = Math.sqrt(dx * dx + dy * dy);

        if (d <= pTemp.r + p_point.r) {
          return false;
        }
      }
    }

    return true;
  }

  private createFirstPoint(): PDPoint {
    var ranX = 0.5,
      ranY = 0.5,
      radius;

    let minRadius = this.medianRadius - this.radiusDeviation;
    let maxRadius = this.medianRadius + this.radiusDeviation;
    radius = minRadius + Math.random() * (maxRadius - minRadius);
    return { x: ranX, y: ranY, r: radius };
  }

  private generateRandomAround(p_point: PDPoint): PDPoint {
    var ran, radius, a, newX, newY;

    ran = Math.random();
    radius = p_point.r + (this.medianRadius + this.radiusDeviation) * ran;
    a = Math.PI * 2 * ran;
    newX = p_point.x + radius * Math.sin(a);
    newY = p_point.y + radius * Math.cos(a);

    if (newX <= 0 || newX >= 1) {
      newX = ran;
    }

    if (newY <= 0 || newY >= 1) {
      newY = ran;
    }

    let minRadius = this.medianRadius - this.radiusDeviation;
    let maxRadius = this.medianRadius + this.radiusDeviation;
    radius = minRadius + Math.random() * (maxRadius - minRadius);

    return {
      x: newX,
      y: newY,
      r: radius,
    };
  }
}

//
// Based on Earcut https://github.com/mapbox/earcut
//
// Usage
//
// let triangles = Triangulation.triangulate([10,0, 0,50, 60,60, 70,10]); // returns [1,0,3, 3,2,1]
// Signature: earcut(vertices[, holes, dimensions = 2]).
//
// vertices is a flat array of vertice coordinates like [x0,y0, x1,y1, x2,y2, ...].
// holes is an array of hole indices if any (e.g. [5, 8] for a 12-vertice input would mean one hole with vertices
// 5–7 and another with 8–11). dimensions is the number of coordinates per vertice in the input array (2 by
// default). Each group of three vertice indices in the resulting array forms a triangle.
//

class TriangulationNode {
  // vertice index in coordinates array
  public i: number;

  // vertex coordinates
  public x: number;
  public y: number;

  // previous and next vertice nodes in a polygon ring
  public prev: TriangulationNode | null = null;
  public next: TriangulationNode | null = null;

  // z-order curve value
  public z: number | null = null;

  // previous and next nodes in z-order
  public prevZ: TriangulationNode | null = null;
  public nextZ: TriangulationNode | null = null;

  // indicates whether this is a steiner point
  public steiner: boolean = false;

  constructor(i: number, x: number, y: number) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;
  }
}

export default class Triangulation {
  constructor() {}

  public static triangulate(
    data: Float32Array,
    holeIndices: number[] | null = null,
    dim: number = 3,
  ): number[] {
    let hasHoles = holeIndices && holeIndices.length,
      outerLen = hasHoles && holeIndices ? holeIndices[0] * dim : data.length,
      outerNode = Triangulation.linkedList(data, 0, outerLen, dim, true),
      triangles: number[] = [];

    if (!outerNode) {
      return triangles;
    }

    let minX = 0,
      minY = 0,
      maxX = 0,
      maxY = 0,
      x = 0,
      y = 0,
      size = 0;

    if (hasHoles) {
      outerNode = Triangulation.eliminateHoles(
        data,
        holeIndices ? holeIndices : [],
        outerNode,
        dim,
      );
    }

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
      minX = maxX = data[0];
      minY = maxY = data[1];

      for (let i = dim; i < outerLen; i += dim) {
        x = data[i];
        y = data[i + 1];
        if (x < minX) {
          minX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y > maxY) {
          maxY = y;
        }
      }

      // minX, minY and size are later used to transform coords into integers for z-order calculation
      size = Math.max(maxX - minX, maxY - minY);
    }

    Triangulation.earcutLinked(outerNode, triangles, dim, minX, minY, size);

    return triangles;
  }

  // create a circular doubly linked list from polygon points in the specified winding order
  private static linkedList(
    data: Float32Array,
    start: number,
    end: number,
    dim: number,
    clockwise: boolean,
  ): TriangulationNode | null {
    let last: TriangulationNode | null = null;

    if (clockwise === Triangulation.signedArea(data, start, end, dim) > 0) {
      for (let i = start; i < end; i += dim) {
        last = Triangulation.insertNode(i, data[i], data[i + 1], last);
      }
    } else {
      for (let i = end - dim; i >= start; i -= dim) {
        last = Triangulation.insertNode(i, data[i], data[i + 1], last);
      }
    }

    if (last && Triangulation.equals(last, last.next!)) {
      Triangulation.removeNode(last);
      last = last.next;
    }
    return last;
  }

  // eliminate colinear or duplicate points
  private static filterPoints(start: TriangulationNode, end: TriangulationNode | null = null) {
    if (!start) {
      return start;
    }
    if (!end) {
      end = start;
    }

    let p = start,
      again;
    do {
      again = false;

      if (
        !p.steiner &&
        (Triangulation.equals(p, p.next!) || Triangulation.area(p.prev!, p, p.next!) === 0)
      ) {
        Triangulation.removeNode(p);
        p = end = p.prev!;
        if (p === p.next) {
          return null;
        }
        again = true;
      } else {
        p = p.next!;
      }
    } while (again || p !== end);

    return end;
  }

  // main ear slicing loop which triangulates a polygon (given as a linked list)
  private static earcutLinked(
    ear: TriangulationNode | null,
    triangles: number[],
    dim: number,
    minX: number,
    minY: number,
    size: number,
    pass = 0,
  ) {
    if (!ear) {
      return;
    }

    // interlink polygon nodes in z-order
    if (!pass && size) {
      Triangulation.indexCurve(ear, minX, minY, size);
    }

    let stop: TriangulationNode | null = ear,
      prev,
      next;

    // iterate through ears, slicing them one by one
    while (ear!.prev !== ear!.next) {
      prev = ear!.prev;
      next = ear!.next;

      if (size ? Triangulation.isEarHashed(ear!, minX, minY, size) : Triangulation.isEar(ear!)) {
        // cut off the triangle
        triangles.push(prev!.i / dim);
        triangles.push(ear!.i / dim);
        triangles.push(next!.i / dim);

        Triangulation.removeNode(ear!);

        // skipping the next vertice leads to less sliver triangles
        ear = next!.next;
        stop = next!.next;

        continue;
      }

      ear = next;

      // if we looped through the whole remaining polygon and can't find any more ears
      if (ear === stop) {
        // try filtering points and slicing again
        if (!pass) {
          Triangulation.earcutLinked(
            Triangulation.filterPoints(ear!),
            triangles,
            dim,
            minX,
            minY,
            size,
            1,
          );

          // if this didn't work, try curing all small self-intersections locally
        } else if (pass === 1) {
          ear = Triangulation.cureLocalIntersections(ear!, triangles, dim);
          Triangulation.earcutLinked(ear, triangles, dim, minX, minY, size, 2);

          // as a last resort, try splitting the remaining polygon into two
        } else if (pass === 2) {
          Triangulation.splitEarcut(ear!, triangles, dim, minX, minY, size);
        }

        break;
      }
    }
  }

  // check whether a polygon node forms a valid ear with adjacent nodes
  private static isEar(ear: TriangulationNode) {
    let a = ear.prev!,
      b = ear,
      c = ear.next!;

    if (Triangulation.area(a, b, c) >= 0) {
      return false;
    } // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    let p = ear.next!.next;

    while (a && b && c && p && p !== ear.prev) {
      if (
        Triangulation.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
        Triangulation.area(p.prev!, p, p.next!) >= 0
      ) {
        return false;
      }
      p = p.next;
    }

    return true;
  }

  private static isEarHashed(ear: TriangulationNode, minX: number, minY: number, size: number) {
    let a = ear.prev!,
      b = ear,
      c = ear.next!;

    if (Triangulation.area(a, b, c) >= 0) {
      return false;
    } // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    let minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : b.x < c.x ? b.x : c.x,
      minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : b.y < c.y ? b.y : c.y,
      maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : b.x > c.x ? b.x : c.x,
      maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : b.y > c.y ? b.y : c.y;

    // z-order range for the current triangle bbox;
    let minZ = Triangulation.zOrder(minTX, minTY, minX, minY, size),
      maxZ = Triangulation.zOrder(maxTX, maxTY, minX, minY, size);

    // first look for points inside the triangle in increasing z-order
    let p = ear.nextZ;

    while (p && p.z && p.z <= maxZ) {
      if (
        p !== ear.prev &&
        p !== ear.next &&
        Triangulation.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
        Triangulation.area(p.prev!, p, p.next!) >= 0
      ) {
        return false;
      }
      p = p.nextZ;
    }

    // then look for points in decreasing z-order
    p = ear.prevZ;

    while (p && p.z && p.z >= minZ) {
      if (
        p !== ear.prev &&
        p !== ear.next &&
        Triangulation.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
        Triangulation.area(p.prev!, p, p.next!) >= 0
      ) {
        return false;
      }
      p = p.prevZ;
    }

    return true;
  }

  // go through all polygon nodes and cure small local self-intersections
  private static cureLocalIntersections(
    start: TriangulationNode,
    triangles: number[],
    dim: number,
  ) {
    let p = start;
    do {
      let a = p.prev,
        b = p.next!.next;

      if (
        a &&
        b &&
        !Triangulation.equals(a, b) &&
        Triangulation.intersects(a, p, p.next!, b) &&
        Triangulation.locallyInside(a, b) &&
        Triangulation.locallyInside(b, a)
      ) {
        triangles.push(a.i / dim);
        triangles.push(p.i / dim);
        triangles.push(b.i / dim);

        // remove two nodes involved
        Triangulation.removeNode(p);
        Triangulation.removeNode(p.next!);

        p = start = b;
      }
      p = p.next!;
    } while (p !== start);

    return p;
  }

  // try splitting polygon into two and triangulate them independently
  private static splitEarcut(
    start: TriangulationNode,
    triangles: number[],
    dim: number,
    minX: number,
    minY: number,
    size: number,
  ) {
    // look for a valid diagonal that divides the polygon into two
    let a = start;
    do {
      let b = a.next!.next;
      while (b && b !== a.prev) {
        if (a.i !== b.i && Triangulation.isValidDiagonal(a, b)) {
          // split the polygon in two by the diagonal
          let c = Triangulation.splitPolygon(a, b);

          // filter colinear points around the cuts
          a = Triangulation.filterPoints(a, a.next)!;
          c = Triangulation.filterPoints(c, c.next)!;

          // run earcut on each half
          Triangulation.earcutLinked(a, triangles, dim, minX, minY, size);
          Triangulation.earcutLinked(c, triangles, dim, minX, minY, size);
          return;
        }
        b = b.next;
      }
      a = a.next!;
    } while (a !== start);
  }

  // link every hole into the outer loop, producing a single-ring polygon without holes
  private static eliminateHoles(
    data: Float32Array,
    holeIndices: number[],
    outerNode: TriangulationNode,
    dim: number,
  ) {
    let queue: { left: TriangulationNode; start: number; end: number }[] = [],
      i,
      len,
      start,
      end,
      list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
      start = holeIndices[i] * dim;
      end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      list = Triangulation.linkedList(data, start, end, dim, false);
      if (list === list!.next) {
        list!.steiner = true;
      }
      queue.push({ left: Triangulation.getLeftmost(list!), start: start, end: end });
    }

    queue.sort((a, b): number => {
      return a.left.x - b.left.x;
    });

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
      if (Triangulation.eliminateHole(queue[i].left, outerNode)) {
        outerNode = Triangulation.filterPoints(outerNode, outerNode.next)!;
      } else {
        // add hole to outerNode
        const hole = Triangulation.linkedList(data, queue[i].start, queue[i].end, dim, true)!;

        let oldStart = outerNode;
        let oldSecond = outerNode.next!;

        let holeStart = hole.next!;
        let holeEnd = hole;

        oldStart.next = holeStart;
        holeStart.prev = oldStart;

        holeEnd.next = oldSecond;
        oldSecond.prev = holeEnd;

        // outerNode = Triangulation.filterPoints(outerNode, outerNode.next);
      }
    }

    return outerNode;
  }

  // find a bridge between vertices that connects hole with an outer ring and and link it
  private static eliminateHole(hole: TriangulationNode, outerNode: TriangulationNode): boolean {
    const newOuterNode = Triangulation.findHoleBridge(hole, outerNode);
    if (newOuterNode) {
      let b = Triangulation.splitPolygon(newOuterNode, hole);
      Triangulation.filterPoints(b, b.next);
      return true;
    } else {
      return false;
    }
  }

  // David Eberly's algorithm for finding a bridge between hole and outer polygon
  private static findHoleBridge(hole: TriangulationNode, outerNode: TriangulationNode) {
    let p = outerNode,
      hx = hole.x,
      hy = hole.y,
      qx = -Infinity,
      m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
      if (hy <= p.y && hy >= p.next!.y && p.next!.y !== p.y) {
        let x = p.x + ((hy - p.y) * (p.next!.x - p.x)) / (p.next!.y - p.y);
        if (x <= hx && x > qx) {
          qx = x;
          if (x === hx) {
            if (hy === p.y) {
              return p;
            }
            if (hy === p.next!.y) {
              return p.next;
            }
          }
          m = p.x < p.next!.x ? p : p.next;
        }
      }
      p = p.next!;
    } while (p !== outerNode);

    if (!m) {
      return null;
    }

    if (hx === qx) {
      return m.prev;
    } // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    let stop = m,
      mx = m.x,
      my = m.y,
      tanMin = Infinity,
      tan;

    p = m.next!;

    while (p !== stop) {
      if (
        hx >= p.x &&
        p.x >= mx &&
        hx !== p.x &&
        Triangulation.pointInTriangle(
          hy < my ? hx : qx,
          hy,
          mx,
          my,
          hy < my ? qx : hx,
          hy,
          p.x,
          p.y,
        )
      ) {
        tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

        if (
          (tan < tanMin || (tan === tanMin && p.x > m.x)) &&
          Triangulation.locallyInside(p, hole)
        ) {
          m = p;
          tanMin = tan;
        }
      }

      p = p.next!;
    }

    return m;
  }

  // interlink polygon nodes in z-order
  private static indexCurve(start: TriangulationNode, minX: number, minY: number, size: number) {
    let p = start;
    do {
      if (p.z === null) {
        p.z = Triangulation.zOrder(p.x, p.y, minX, minY, size);
      }
      p.prevZ = p.prev;
      p.nextZ = p.next;
      p = p.next!;
    } while (p !== start);

    p.prevZ!.nextZ = null;
    p.prevZ = null;

    Triangulation.sortLinked(p);
  }

  // Simon Tatham's linked list merge sort algorithm
  // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
  private static sortLinked(list: TriangulationNode | null) {
    let i,
      p,
      q,
      e,
      tail,
      numMerges,
      pSize,
      qSize,
      inSize = 1;

    do {
      p = list;
      list = null;
      tail = null;
      numMerges = 0;

      while (p) {
        numMerges++;
        q = p;
        pSize = 0;
        for (i = 0; i < inSize; i++) {
          pSize++;
          q = q.nextZ;
          if (!q) {
            break;
          }
        }
        qSize = inSize;

        while (pSize > 0 || (qSize > 0 && q)) {
          if (pSize !== 0 && (qSize === 0 || !q || (p && p.z && q.z && p.z <= q.z))) {
            e = p;
            p = p!.nextZ;
            pSize--;
          } else {
            e = q;
            q = q!.nextZ;
            qSize--;
          }

          if (tail) {
            tail.nextZ = e;
          } else {
            list = e;
          }

          e!.prevZ = tail;
          tail = e;
        }

        p = q;
      }

      tail!.nextZ = null;
      inSize *= 2;
    } while (numMerges > 1);

    return list;
  }

  // find the leftmost node of a polygon ring
  private static getLeftmost(start: TriangulationNode) {
    let p = start,
      leftmost = start;
    do {
      if (p.x < leftmost.x) {
        leftmost = p;
      }
      p = p.next!;
    } while (p !== start);

    return leftmost;
  }

  // z-order of a point given coords and size of the data bounding box
  private static zOrder(x: number, y: number, minX: number, minY: number, size: number) {
    // coords are transformed into non-negative 15-bit integer range
    x = (32767 * (x - minX)) / size;
    y = (32767 * (y - minY)) / size;

    x = (x | (x << 8)) & 0x00ff00ff;
    x = (x | (x << 4)) & 0x0f0f0f0f;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00ff00ff;
    y = (y | (y << 4)) & 0x0f0f0f0f;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
  }

  // check if a point lies within a convex triangle
  private static pointInTriangle(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    px: number,
    py: number,
  ) {
    return (
      (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
      (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
      (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0
    );
  }

  // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
  private static isValidDiagonal(a: TriangulationNode, b: TriangulationNode) {
    return (
      a.next!.i !== b.i &&
      a.prev!.i !== b.i &&
      !Triangulation.intersectsPolygon(a, b) &&
      Triangulation.locallyInside(a, b) &&
      Triangulation.locallyInside(b, a) &&
      Triangulation.middleInside(a, b)
    );
  }

  // signed area of a triangle
  private static area(p: TriangulationNode, q: TriangulationNode, r: TriangulationNode) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  }

  // check if two points are equal
  private static equals(p1: TriangulationNode, p2: TriangulationNode) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  // check if two segments intersect
  private static intersects(
    p1: TriangulationNode,
    q1: TriangulationNode,
    p2: TriangulationNode,
    q2: TriangulationNode,
  ) {
    if (
      (Triangulation.equals(p1, q1) && Triangulation.equals(p2, q2)) ||
      (Triangulation.equals(p1, q2) && Triangulation.equals(p2, q1))
    ) {
      return true;
    }
    return (
      Triangulation.area(p1, q1, p2) > 0 !== Triangulation.area(p1, q1, q2) > 0 &&
      Triangulation.area(p2, q2, p1) > 0 !== Triangulation.area(p2, q2, q1) > 0
    );
  }

  // check if a polygon diagonal intersects any polygon segments
  private static intersectsPolygon(a: TriangulationNode, b: TriangulationNode) {
    let p = a;
    do {
      if (
        p.i !== a.i &&
        p.next!.i !== a.i &&
        p.i !== b.i &&
        p.next!.i !== b.i &&
        Triangulation.intersects(p, p.next!, a, b)
      ) {
        return true;
      }
      p = p.next!;
    } while (p !== a);

    return false;
  }

  // check if a polygon diagonal is locally inside the polygon
  private static locallyInside(a: TriangulationNode, b: TriangulationNode) {
    return Triangulation.area(a.prev!, a, a.next!) < 0
      ? Triangulation.area(a, b, a.next!) >= 0 && Triangulation.area(a, a.prev!, b) >= 0
      : Triangulation.area(a, b, a.prev!) < 0 || Triangulation.area(a, a.next!, b) < 0;
  }

  // check if the middle point of a polygon diagonal is inside the polygon
  private static middleInside(a: TriangulationNode, b: TriangulationNode) {
    let p = a,
      inside = false,
      px = (a.x + b.x) / 2,
      py = (a.y + b.y) / 2;
    do {
      if (
        p.y > py !== p.next!.y > py &&
        p.next!.y !== p.y &&
        px < ((p.next!.x - p.x) * (py - p.y)) / (p.next!.y - p.y) + p.x
      ) {
        inside = !inside;
      }
      p = p.next!;
    } while (p !== a);

    return inside;
  }

  // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
  // if one belongs to the outer ring and another to a hole, it merges it into a single ring
  private static splitPolygon(a: TriangulationNode, b: TriangulationNode) {
    const a2 = new TriangulationNode(a.i, a.x, a.y),
      b2 = new TriangulationNode(b.i, b.x, b.y),
      an = a.next!,
      bp = b.prev!;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
  }

  // create a node and optionally link it with previous one (in a circular doubly linked list)
  private static insertNode(
    i: number,
    x: number,
    y: number,
    last: TriangulationNode | null,
  ): TriangulationNode {
    const p = new TriangulationNode(i, x, y);

    if (!last) {
      p.prev = p;
      p.next = p;
    } else {
      p.next = last.next;
      p.prev = last;
      last.next!.prev = p;
      last.next = p;
    }
    return p;
  }

  private static removeNode(p: TriangulationNode) {
    p.next!.prev = p.prev;
    p.prev!.next = p.next;

    if (p.prevZ) {
      p.prevZ.nextZ = p.nextZ;
    }
    if (p.nextZ) {
      p.nextZ.prevZ = p.prevZ;
    }
  }

  // return a percentage difference between the polygon area and its triangulation area;
  // used to verify correctness of triangulation
  private static deviation(
    data: Float32Array,
    holeIndices: number[],
    dim: number,
    triangles: number[],
  ) {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    let polygonArea = Math.abs(Triangulation.signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
      for (let i = 0, len = holeIndices.length; i < len; i++) {
        const start = holeIndices[i] * dim;
        const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        polygonArea -= Math.abs(Triangulation.signedArea(data, start, end, dim));
      }
    }

    let trianglesArea = 0;
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i] * dim;
      const b = triangles[i + 1] * dim;
      const c = triangles[i + 2] * dim;
      trianglesArea += Math.abs(
        (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
          (data[a] - data[b]) * (data[c + 1] - data[a + 1]),
      );
    }

    return polygonArea === 0 && trianglesArea === 0
      ? 0
      : Math.abs((trianglesArea - polygonArea) / polygonArea);
  }

  private static signedArea(data: Float32Array, start: number, end: number, dim: number) {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
      sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
      j = i;
    }
    return sum;
  }
}

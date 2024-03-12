import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';

//http://thegoldenmule.com/blog/2013/01/geosphere-revisited/
export default class GeoSphere extends Mesh {
  private _indices!: Uint16Array;
  private _positions!: Vector3[];

  constructor(renderer: Renderer, radius: number = 1, divisions: number = 3) {
    super(renderer);

    //TODO: implement hardNormals

    this.setIcosahedron();
    //divisions > 6 will create too many indices (>2^16)
    if (divisions > 6) divisions = 6;
    for (var i = 0; i < divisions; i++) {
      this.subdivide();
    }
    this.normalize();

    var l: number = this._positions.length;
    var positions: Float32Array = new Float32Array(l * 3);
    var i0: number = 0;
    for (var i = 0; i < l; i++) {
      positions[i0++] = this._positions[i].x * radius;
      positions[i0++] = this._positions[i].y * radius;
      positions[i0++] = this._positions[i].z * radius;
    }
    this.setPositions(positions);
    this.setIndices(this._indices);

    var ni: number = 0;
    var normals: Float32Array = new Float32Array(l * 3);

    for (var i = 0; i < l; i++) {
      normals[ni++] = this._positions[i].x;
      normals[ni++] = this._positions[i].y;
      normals[ni++] = this._positions[i].z;
    }
    this.setNormals(normals);

    this.addTexcoords(this._positions);

    //console.log ("GeoSphere: vertices", l, "triangles", this._indices.length / 3);
  }

  // this would produce seams
  private addTexcoords(positions: Vector3[]): void {
    var l: number = positions.length;
    var uvData: Float32Array = new Float32Array(l * 2);
    var i0: number = 0;
    var length: number;
    var x: number;
    var y: number;
    var z: number;
    var invPI2: number = 1 / (Math.PI * 2);
    var invPI: number = 1 / Math.PI;

    for (var i = 0; i < l; i++) {
      x = this._positions[i].x;
      y = this._positions[i].y;
      z = this._positions[i].z;
      uvData[i0++] = Math.atan2(z, x) * invPI2 + 0.5;

      //length = Math.sqrt(x*x + z*z);
      //uvData[i0++] =  Math.atan2(y, length)* invPI + 0.5;
      uvData[i0++] = Math.asin(y) * invPI + 0.5;
    }
    this.setUV0(uvData);
  }

  private setIcosahedron(): void {
    this._indices = new Uint16Array([
      1,
      4,
      0,
      4,
      9,
      0,
      4,
      5,
      9,
      8,
      5,
      4,
      1,
      8,
      4,
      1,
      10,
      8,
      10,
      3,
      8,
      8,
      3,
      5,
      3,
      2,
      5,
      3,
      7,
      2,
      3,
      10,
      7,
      10,
      6,
      7,
      6,
      11,
      7,
      6,
      0,
      11,
      6,
      1,
      0,
      10,
      1,
      6,
      11,
      0,
      9,
      2,
      11,
      9,
      5,
      2,
      9,
      11,
      2,
      7,
    ]);

    var X = 0.525731112119133606;
    var Z = 0.850650808352039932;

    this._positions = [];
    this._positions.push(new Vector3(-X, 0, Z));
    this._positions.push(new Vector3(X, 0, Z));
    this._positions.push(new Vector3(-X, 0, -Z));

    this._positions.push(new Vector3(X, 0, -Z));
    this._positions.push(new Vector3(0, Z, X));
    this._positions.push(new Vector3(0, Z, -X));

    this._positions.push(new Vector3(0, -Z, X));
    this._positions.push(new Vector3(0, -Z, -X));
    this._positions.push(new Vector3(Z, X, 0));

    this._positions.push(new Vector3(-Z, X, 0));
    this._positions.push(new Vector3(Z, -X, 0));
    this._positions.push(new Vector3(-Z, -X, 0));

    /*this._positions = new Float32Array ([

		 -X, 0, Z,
		 X, 0, Z,
		 -X, 0, -Z,

		 X, 0, -Z,
		 0, Z, X,
		 0, Z, -X,

		 0, -Z, X,
		 0, -Z, -X,
		 Z, X, 0,

		 -Z, X, 0,
		 Z, -X, 0,
		 -Z, -X, 0
		 ]);*/
  }

  private subdivide(): void {
    // cache of midpoint indices
    var midpointIndices: number[][] = [];

    // create lists instead...
    var l: number = this._indices.length;
    var subdividedIndices: number[] = [];
    var subdividedPositions: Vector3[] = this._positions;

    // subdivide each triangle
    for (var i = 0; i < l - 2; i += 3) {
      // grab indices of triangle
      var i0 = this._indices[i];
      var i1 = this._indices[i + 1];
      var i2 = this._indices[i + 2];

      // calculate new indices
      var m01 = this.getMidpointIndex(midpointIndices, subdividedPositions, i0, i1);
      var m12 = this.getMidpointIndex(midpointIndices, subdividedPositions, i1, i2);
      var m02 = this.getMidpointIndex(midpointIndices, subdividedPositions, i2, i0);

      subdividedIndices.push(i0, m01, m02, i1, m12, m01, i2, m02, m12, m02, m01, m12);
    }

    this._indices = new Uint16Array(subdividedIndices);
  }

  private getMidpointIndex(
    midpointIndices: number[][],
    vertices: Vector3[],
    i0: number,
    i1: number,
  ): number {
    if (midpointIndices[i0] && midpointIndices[i0][i1]) {
      return midpointIndices[i0][i1];
    }

    if (midpointIndices[i1] && midpointIndices[i1][i0]) {
      return midpointIndices[i1][i0];
    }

    if (!midpointIndices[i0]) midpointIndices[i0] = [];
    return GeoSphere.addVertex(midpointIndices, vertices, i0, i1);
  }

  private static addVertex(
    midpointIndices: number[][],
    vertices: Vector3[],
    i0: number,
    i1: number,
  ): number {
    //there is no vertex between these vertices yet
    const v0: Vector3 = vertices[i0];
    const v1: Vector3 = vertices[i1];
    const midpoint = Vector3.add(v0, v1).multiplyScalar(0.5);
    const midpointIndex = vertices.length;
    midpointIndices[i0][i1] = midpointIndex;
    vertices.push(midpoint);
    return midpointIndex;
  }

  private normalize(): void {
    var l: number = this._positions.length;
    for (var i = 0; i < l; i++) {
      this._positions[i].normalize();
    }
  }
}

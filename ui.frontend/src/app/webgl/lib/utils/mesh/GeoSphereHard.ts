import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';

export default class GeoSphereHard extends Mesh {
  private positions: Vector3[] = [];

  constructor(renderer: Renderer, radius: number = 1, divisions: number = 1) {
    super(renderer);

    this.setIcosahedron();
    //safety
    divisions = Math.min(divisions, 8);
    for (let i = 0; i < divisions; i++) {
      this.subdivide();
    }

    const l: number = this.positions.length;
    const positions: Float32Array = new Float32Array(l * 3);
    let i0: number = 0;
    for (let i = 0; i < l; i++) {
      positions[i0++] = this.positions[i].x * radius;
      positions[i0++] = this.positions[i].y * radius;
      positions[i0++] = this.positions[i].z * radius;
    }
    this.setPositions(positions);

    let ni: number = 0;
    const normals: Float32Array = new Float32Array(l * 3);
    const triangleCount = l / 3;
    for (let i = 0; i < triangleCount; i++) {
      const p0 = this.positions[i * 3 + 0];
      const p1 = this.positions[i * 3 + 1];
      const p2 = this.positions[i * 3 + 2];
      p0.add(p1);
      p0.add(p2);
      p0.multiplyScalar(1 / 3);
      p0.normalize();
      for (let j = 0; j < 3; j++) {
        normals[ni++] = p0.x;
        normals[ni++] = p0.y;
        normals[ni++] = p0.z;
      }
    }
    this.setNormals(normals);

    //console.log ("GeoSphere: vertices", l, "triangles", this._indices.length / 3);
  }

  private setIcosahedron(): void {
    let indices = new Uint16Array([
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

    let X = 0.525731112119133606;
    let Z = 0.850650808352039932;

    let positions = [];
    positions.push(new Vector3(-X, 0, Z));
    positions.push(new Vector3(X, 0, Z));
    positions.push(new Vector3(-X, 0, -Z));

    positions.push(new Vector3(X, 0, -Z));
    positions.push(new Vector3(0, Z, X));
    positions.push(new Vector3(0, Z, -X));

    positions.push(new Vector3(0, -Z, X));
    positions.push(new Vector3(0, -Z, -X));
    positions.push(new Vector3(Z, X, 0));

    positions.push(new Vector3(-Z, X, 0));
    positions.push(new Vector3(Z, -X, 0));
    positions.push(new Vector3(-Z, -X, 0));

    for (let i = 0; i < indices.length; i++) {
      this.positions.push(positions[indices[i]]);
    }
  }

  private subdivide(): void {
    const l: number = this.positions.length / 3;
    const subdividedPositions: Vector3[] = [];

    for (let i = 0; i < l; i++) {
      const p0 = this.positions[i * 3 + 0];
      const p1 = this.positions[i * 3 + 1];
      const p2 = this.positions[i * 3 + 2];

      const p3 = Vector3.lerp(p0, p1, 0.5).normalize();
      const p4 = Vector3.lerp(p0, p2, 0.5).normalize();
      const p5 = Vector3.lerp(p2, p1, 0.5).normalize();

      subdividedPositions.push(p0, p3, p4);
      subdividedPositions.push(p3, p1, p5);
      subdividedPositions.push(p4, p5, p2);
      subdividedPositions.push(p4, p3, p5);
    }

    this.positions = subdividedPositions;
  }
}

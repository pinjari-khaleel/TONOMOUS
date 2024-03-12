import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Vector2 from '../../renderer/math/Vector2';
import Vector3 from '../../renderer/math/Vector3';

// https://github.com/mrdoob/three.js/blob/dev/src/geometries/CylinderGeometry.js
export default class Cylinder extends Mesh {
  constructor(
    renderer: Renderer,
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
  ) {
    super(renderer);

    radialSegments = Math.floor(radialSegments);
    heightSegments = Math.floor(heightSegments);

    const indices: Array<number> = [];
    const vertices: Array<number> = [];
    const normals: Array<number> = [];
    const uvs: Array<number> = [];

    // helper variables
    let index = 0;
    const indexArray: Array<Array<number>> = [];
    const halfHeight = height / 2;

    const generateTorso = () => {
      const normal = new Vector3();
      const vertex = new Vector3();

      // this will be used to calculate the normal
      const slope = (radiusBottom - radiusTop) / height;
      // generate vertices, normals and uvs
      for (let y = 0; y <= heightSegments; y++) {
        const indexRow: Array<number> = [];

        const v = y / heightSegments;
        // calculate the radius of the current row
        const radius = v * (radiusBottom - radiusTop) + radiusTop;

        for (let x = 0; x <= radialSegments; x++) {
          const u = x / radialSegments;

          const theta = u * thetaLength + thetaStart;

          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);

          vertex.x = radius * sinTheta;
          vertex.y = -v * height + halfHeight;
          vertex.z = radius * cosTheta;
          vertices.push(vertex.x, vertex.y, vertex.z);

          normal.setValues(sinTheta, slope, cosTheta).normalize();
          normals.push(normal.x, normal.y, normal.z);

          uvs.push(u, 1 - v);

          // save index of vertex in respective row
          indexRow.push(index++);
        }

        // save vertices of the row in our index array
        indexArray.push(indexRow);
      }

      // generate indices
      for (let x = 0; x < radialSegments; x++) {
        for (let y = 0; y < heightSegments; y++) {
          const a = indexArray[y][x];
          const b = indexArray[y + 1][x];
          const c = indexArray[y + 1][x + 1];
          const d = indexArray[y][x + 1];

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    };

    const generateCap = (top: boolean) => {
      // save the index of the first center vertex
      const centerIndexStart = index;

      const uv = new Vector2();
      const vertex = new Vector3();

      const radius = top ? radiusTop : radiusBottom;
      const sign = top ? 1 : -1;

      // first we generate the center vertex data of the cap.
      // because the geometry needs one set of uvs per face,
      // we must generate a center vertex per face/segment
      for (let x = 1; x <= radialSegments; x++) {
        vertices.push(0, halfHeight * sign, 0);
        normals.push(0, sign, 0);
        uvs.push(0.5, 0.5);
        index++;
      }

      // save the index of the last center vertex
      const centerIndexEnd = index;

      // generate the surrounding vertices, normals and uvs
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * thetaLength + thetaStart;

        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        vertex.x = radius * sinTheta;
        vertex.y = halfHeight * sign;
        vertex.z = radius * cosTheta;
        vertices.push(vertex.x, vertex.y, vertex.z);

        normals.push(0, sign, 0);

        uv.x = cosTheta * 0.5 + 0.5;
        uv.y = sinTheta * 0.5 * sign + 0.5;
        uvs.push(uv.x, uv.y);

        index++;
      }

      for (let x = 0; x < radialSegments; x++) {
        const c = centerIndexStart + x;
        const i = centerIndexEnd + x;
        if (top) {
          indices.push(i, i + 1, c);
        } else {
          indices.push(i + 1, i, c);
        }
      }
    };

    generateTorso();

    if (!openEnded) {
      if (radiusTop > 0) generateCap(true);
      if (radiusBottom > 0) generateCap(false);
    }

    this.setPositions(Float32Array.from(vertices));
    this.setUV0(Float32Array.from(uvs));
    this.setNormals(Float32Array.from(normals));
    this.setIndices(Uint16Array.from(indices));
  }
}

import Vector3 from '../../renderer/math/Vector3';
import Mesh from '../../renderer/mesh/Mesh';
import Renderer from '../../renderer/render/Renderer';
import MeshUtils from '../mesh/MeshUtils';
import PathBatch from './PathBatch';
import Path from 'mediamonks-webgl/utils/shape/Path';

export default class PathUtils {
  constructor() {}

  public static getPointsOfBatches(
    batches: PathBatch[] | PathBatch,
    divisions: number = 4, // number of divisions of arcs
    spacing: number = 0, // set if you want an evenly spaced point cloud
  ): { points: Vector3[]; indices: number[] } {
    if (batches instanceof Array) {
      let points: Vector3[] = [];
      let indices: number[] = [];
      let total: number = 0;

      for (let i = 0; i < batches.length; i++) {
        const data = batches[i].getPoints(divisions, spacing);
        for (let j = 0; j < data.indices.length; j++) {
          indices.push(data.indices[j] + total);
        }
        total += data.points.length;
        points = points.concat(data.points);
      }
      return { points: points, indices: indices };
    } else {
      return batches.getPoints(divisions, spacing);
    }
  }

  public static createMesh(
    renderer: Renderer,
    batches: PathBatch[] | PathBatch,
    divisions: number = 4, // number of divisions of arcs
    spacing: number = 0, // set if you want an evenly spaced point cloud
  ): Mesh {
    const data = PathUtils.getPointsOfBatches(batches, divisions, spacing);
    const mesh = new Mesh(renderer);
    mesh.setPositions(MeshUtils.toFloat32Array(data.points));
    return mesh;
  }

  public static createLineIndexBuffer(
    numVertices: number,
    startIndices: number[] = [],
    offset: number = 0,
    closed: boolean = true,
  ): Uint16Array {
    const indices = new Uint16Array(numVertices * 2);

    if (startIndices && startIndices.length > 0) {
      startIndices.push(numVertices);
      for (let i = 0; i < startIndices.length - 1; i++) {
        const data = PathUtils.createLineIndexBuffer(
          startIndices[i + 1] - startIndices[i],
          [],
          startIndices[i],
        );
        indices.set(data, startIndices[i] * 2);
      }
    } else {
      for (let i = 0; i < numVertices; i++) {
        indices[i * 2 + 0] = i + offset;
        indices[i * 2 + 1] = ((i + 1) % numVertices) + offset;
      }
    }

    if (!closed) {
      return indices.slice(0, indices.length - 2);
    }

    return indices;
  }

  public static createTriangleFanIndexBuffer(numVertices: number): Uint16Array {
    const indices = new Uint16Array(numVertices * 3);
    for (let i = 0; i < numVertices - 2; i++) {
      indices[i * 3 + 0] = 0;
      indices[i * 3 + 1] = i + 1;
      indices[i * 3 + 2] = i + 2;
    }
    return indices;
  }

  // the path should be closed
  // only checking the xy plane
  public static isPointInsidePath(point: Vector3, path: Path): boolean {
    let intersections = 0;
    const points = path.getPoints();

    //port of http://paulbourke.net/geometry/pointlineplane/Helpers.cs
    for (let i = 0; i < points.length; i++) {
      const l1p1 = points[i];
      const l1p2 = points[(i + 1) % points.length];

      const d = -point.y * (l1p2.x - l1p1.x) - (1000 - point.x) * (l1p2.y - l1p1.y);
      if (d === 0) continue;
      const n_a = (1000 - point.x) * (l1p1.y - point.y) - -point.y * (l1p1.x - point.x);
      const n_b = (l1p2.x - l1p1.x) * (l1p1.y - point.y) - (l1p2.y - l1p1.y) * (l1p1.x - point.x);
      const ua = n_a / d;
      const ub = n_b / d;
      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        intersections++;
      }
    }

    return (intersections & 1) !== 0;
  }
}

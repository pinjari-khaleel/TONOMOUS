import Mesh from '../../renderer/mesh/Mesh';
import Renderer from '../../renderer/render/Renderer';
import Vector3 from '../../renderer/math/Vector3';

export default class Dodecahedron extends Mesh {
  constructor(
    renderer: Renderer,
    positionsOnly: boolean = false,
    storeData: boolean = false,
    lines: boolean = false,
  ) {
    super(renderer, false);

    if (positionsOnly) {
      this.positionsOnly(storeData, lines);
    } else {
      this.createWithHardNormals(storeData);
    }
  }

  private createWithHardNormals(storeData: boolean) {
    let A = 1.618033989; //(1 * Math.sqrt(5) / 2);
    let B = A - 1; //1 / (1 * Math.sqrt(5) / 2)
    let vertices: Vector3[] = [];

    vertices[0] = new Vector3(1, 1, 1);
    vertices[1] = new Vector3(1, 1, -1);
    vertices[2] = new Vector3(1, -1, 1);
    vertices[3] = new Vector3(1, -1, -1);
    vertices[4] = new Vector3(-1, 1, 1);
    vertices[5] = new Vector3(-1, 1, -1);
    vertices[6] = new Vector3(-1, -1, 1);
    vertices[7] = new Vector3(-1, -1, -1);

    vertices[8] = new Vector3(0, B, A);
    vertices[9] = new Vector3(0, B, -A);
    vertices[10] = new Vector3(0, -B, A);
    vertices[11] = new Vector3(0, -B, -A);

    vertices[12] = new Vector3(B, A, 0);
    vertices[13] = new Vector3(B, -A, 0);
    vertices[14] = new Vector3(-B, A, 0);
    vertices[15] = new Vector3(-B, -A, 0);

    vertices[16] = new Vector3(A, 0, B);
    vertices[17] = new Vector3(A, 0, -B);
    vertices[18] = new Vector3(-A, 0, B);
    vertices[19] = new Vector3(-A, 0, -B);

    let pentagons: number[] = [];
    pentagons.push(0, 16, 2, 10, 8);
    pentagons.push(0, 8, 4, 14, 12);
    pentagons.push(16, 17, 1, 12, 0);
    pentagons.push(1, 9, 11, 3, 17);
    pentagons.push(1, 12, 14, 5, 9);
    pentagons.push(2, 13, 15, 6, 10);
    pentagons.push(13, 3, 17, 16, 2);
    pentagons.push(3, 11, 7, 15, 13);
    pentagons.push(4, 8, 10, 6, 18);
    pentagons.push(14, 5, 19, 18, 4);
    pentagons.push(5, 19, 7, 11, 9);
    pentagons.push(15, 7, 19, 18, 6);

    let vertexCount = 12 * 5;
    let normalData: Float32Array = new Float32Array(vertexCount * 3);
    let positionData: Float32Array = new Float32Array(vertexCount * 3);
    let indices: Uint16Array = new Uint16Array(12 * 3 * 3);
    let ni = 0;
    let pi = 0;
    let ii = 0;

    //get centers
    let center = new Vector3();
    for (let i = 0; i < 12; i++) {
      center.setValues(0, 0, 0);
      for (let j = 0; j < 5; j++) {
        let index = pentagons[i * 5 + j];
        center.add(vertices[index]);
      }
      center.multiplyScalar(0.2);
      center.normalize();

      for (let k = 0; k < 5; k++) {
        normalData[ni++] = center.x;
        normalData[ni++] = center.y;
        normalData[ni++] = center.z;

        positionData[pi++] = vertices[pentagons[i * 5 + k]].x;
        positionData[pi++] = vertices[pentagons[i * 5 + k]].y;
        positionData[pi++] = vertices[pentagons[i * 5 + k]].z;
      }

      indices[ii++] = i * 5 + 0;
      indices[ii++] = i * 5 + 1;
      indices[ii++] = i * 5 + 4;

      indices[ii++] = i * 5 + 1;
      indices[ii++] = i * 5 + 3;
      indices[ii++] = i * 5 + 4;

      indices[ii++] = i * 5 + 1;
      indices[ii++] = i * 5 + 2;
      indices[ii++] = i * 5 + 3;
    }

    this.setPositions(positionData, storeData);
    this.setNormals(normalData, storeData);
    this.setIndices(indices);
  }

  private positionsOnly(storeData: boolean, lines: boolean) {
    let A = 1.618033989; //(1 * Math.sqrt(5) / 2);
    let B = 0.618033989; //1 / (1 * Math.sqrt(5) / 2)
    let vertices: Vector3[] = [];

    vertices[0] = new Vector3(1, 1, 1);
    vertices[1] = new Vector3(1, 1, -1);
    vertices[2] = new Vector3(1, -1, 1);
    vertices[3] = new Vector3(1, -1, -1);
    vertices[4] = new Vector3(-1, 1, 1);
    vertices[5] = new Vector3(-1, 1, -1);
    vertices[6] = new Vector3(-1, -1, 1);
    vertices[7] = new Vector3(-1, -1, -1);

    vertices[8] = new Vector3(0, B, A);
    vertices[9] = new Vector3(0, B, -A);
    vertices[10] = new Vector3(0, -B, A);
    vertices[11] = new Vector3(0, -B, -A);

    vertices[12] = new Vector3(B, A, 0);
    vertices[13] = new Vector3(B, -A, 0);
    vertices[14] = new Vector3(-B, A, 0);
    vertices[15] = new Vector3(-B, -A, 0);

    vertices[16] = new Vector3(A, 0, B);
    vertices[17] = new Vector3(A, 0, -B);
    vertices[18] = new Vector3(-A, 0, B);
    vertices[19] = new Vector3(-A, 0, -B);

    let ii = 0;
    let positionData: Float32Array = new Float32Array(vertices.length * 3);
    for (let i = 0; i < vertices.length; i++) {
      vertices[i].normalize();
      positionData[ii++] = vertices[i].x;
      positionData[ii++] = vertices[i].y;
      positionData[ii++] = vertices[i].z;
    }
    this.setPositions(positionData, storeData);

    //TODO: fix: the winding of the pentagons is not consistent!
    let pentagons: number[] = [];
    pentagons.push(0, 16, 2, 10, 8);
    pentagons.push(0, 8, 4, 14, 12);
    pentagons.push(16, 17, 1, 12, 0);
    pentagons.push(1, 9, 11, 3, 17);
    pentagons.push(1, 12, 14, 5, 9);
    pentagons.push(2, 13, 15, 6, 10);
    pentagons.push(13, 3, 17, 16, 2);
    pentagons.push(3, 11, 7, 15, 13);
    pentagons.push(4, 8, 10, 6, 18);
    pentagons.push(14, 5, 19, 18, 4);
    pentagons.push(5, 19, 7, 11, 9);
    pentagons.push(15, 7, 19, 18, 6);

    if (lines) {
      //TODO: remove doubles
      let lineIndices: number[] = [];
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 5; j++) {
          lineIndices.push(pentagons[i * 5 + j]);
          lineIndices.push(pentagons[i * 5 + ((j + 1) % 5)]);
          this.setIndices(new Uint16Array(lineIndices));
        }
      }
    } else {
      let indices: Uint16Array = new Uint16Array(pentagons.length * 3 * 3);
      let ii = 0;
      for (let i = 0; i < 12; i++) {
        indices[ii++] = pentagons[i * 5 + 0];
        indices[ii++] = pentagons[i * 5 + 1];
        indices[ii++] = pentagons[i * 5 + 4];

        indices[ii++] = pentagons[i * 5 + 1];
        indices[ii++] = pentagons[i * 5 + 3];
        indices[ii++] = pentagons[i * 5 + 4];

        indices[ii++] = pentagons[i * 5 + 1];
        indices[ii++] = pentagons[i * 5 + 2];
        indices[ii++] = pentagons[i * 5 + 3];
      }
      this.setIndices(indices);
    }
  }
}

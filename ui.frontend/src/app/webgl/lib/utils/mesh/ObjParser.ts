import Vector3 from '../../renderer/math/Vector3';
import Mesh from '../../renderer/mesh/Mesh';
import Renderer from '../../renderer/render/Renderer';
import LogGL from '../../renderer/core/LogGL';
import Matrix4x4 from '../../renderer/math/Matrix4x4';
import Model from '../model/Model';

export default class ObjParser {
  public positions: Float32Array | undefined;
  public uvs: Float32Array | undefined;
  public normals: Float32Array | undefined;

  private _tmpPositions: number[] | undefined;
  private _tmpUvs: number[] | undefined;
  private _tmpNormals: number[] | undefined;
  private _bufferedData: any;
  private _storeData: boolean | undefined;

  public parse(
    renderer: Renderer,
    text: string,
    createModelsAndMeshes: boolean = true,
    batchByColor: boolean = false,
    transformPerSegment: boolean = false,
    storeData: boolean = false,
  ): Model[] {
    if (/^o /gm.test(text) === false) {
      //console.log("no objects in text");
    }
    this._storeData = storeData;

    this._bufferedData = {};

    this._tmpPositions = [];
    this._tmpUvs = [];
    this._tmpNormals = [];

    const vertices = [];
    const normals = [];
    const uvs = [];
    let models: Model[] | undefined = undefined;

    if (!batchByColor) {
      models = [];
    }

    // v float float float

    const vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

    // vn float float float

    const normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

    // vt float float

    const uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

    // f vertex vertex vertex ...

    const face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

    // f vertex/uv vertex/uv vertex/uv ...

    const face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

    const face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

    // f vertex//normal vertex//normal vertex//normal ...

    const face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

    //

    const mtlParts = text.split('g ');
    // const mtlParts = text.split('usemtl ');
    for (let j = 0; j < mtlParts.length; j++) {
      const lines = mtlParts[j].split('\n');

      // const mtlName: string | undefined = undefined;
      // if (j > 0) {
      //   mtlName = lines[0].trim();
      // }

      const name = lines[0].trim();
      let mtlName: string | undefined = undefined;

      const words = lines[1].split(' ');
      if (words.length > 0) {
        if (words[0] == 'usemtl') {
          mtlName = words[1];
        }
      }

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.trim();

        let result;

        if (line.length === 0 || line.charAt(0) === '#') {
        } else if ((result = vertex_pattern.exec(line)) !== null) {
          // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

          vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        } else if ((result = normal_pattern.exec(line)) !== null) {
          // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

          normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        } else if ((result = uv_pattern.exec(line)) !== null) {
          // ["vt 0.1 0.2", "0.1", "0.2"]

          uvs.push(parseFloat(result[1]), parseFloat(result[2]));
        } else if ((result = face_pattern1.exec(line)) !== null) {
          // ["f 1 2 3", "1", "2", "3", undefined]

          this.addFace(vertices, normals, uvs, result[1], result[2], result[3], result[4]);
        } else if ((result = face_pattern2.exec(line)) !== null) {
          // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined,
          // undefined]

          this.addFace(
            vertices,
            normals,
            uvs,
            result[2],
            result[5],
            result[8],
            result[11],
            result[3],
            result[6],
            result[9],
            result[12],
          );
        } else if ((result = face_pattern3.exec(line)) !== null) {
          // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3",
          // "3", undefined, undefined, undefined, undefined]

          this.addFace(
            vertices,
            normals,
            uvs,
            result[2],
            result[6],
            result[10],
            result[14],
            result[3],
            result[7],
            result[11],
            result[15],
            result[4],
            result[8],
            result[12],
            result[16],
          );
        } else if ((result = face_pattern4.exec(line)) !== null) {
          // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined,
          // undefined, undefined]

          this.addFace(
            vertices,
            normals,
            uvs,
            result[2],
            result[5],
            result[8],
            result[11],
            undefined,
            undefined,
            undefined,
            undefined,
            result[3],
            result[6],
            result[9],
            result[12],
          );
        }
      }

      if (createModelsAndMeshes) {
        if (mtlName) {
          if (batchByColor) {
            this.bufferMeshData(mtlName);
          } else {
            if (transformPerSegment) {
              (<Model[]>models).push(this.createTransformMesh(renderer, mtlName));
            } else {
              (<Model[]>models).push(this.createMesh(renderer, mtlName, name));
            }
          }
        }
      }
    }

    this.positions = new Float32Array(this._tmpPositions);
    this.normals = new Float32Array(this._tmpNormals);
    this.uvs = new Float32Array(this._tmpUvs);

    if (batchByColor && createModelsAndMeshes) {
      return this.batchModels(renderer);
    } else {
      return <Model[]>models;
    }
  }

  private bufferMeshData(mtlName: string): void {
    let mtlBatch: any = this._bufferedData[mtlName];
    if (!mtlBatch) {
      mtlBatch = {};
      mtlBatch['position'] = [];
      mtlBatch['normal'] = [];
      mtlBatch['uv0'] = [];
    }
    mtlBatch['position'] = mtlBatch['position'].concat(this._tmpPositions);
    this._tmpPositions = [];
    mtlBatch['normal'] = mtlBatch['normal'].concat(this._tmpNormals);
    this._tmpNormals = [];
    mtlBatch['uv0'] = mtlBatch['uv0'].concat(this._tmpUvs);
    this._tmpUvs = [];
    this._bufferedData[mtlName] = mtlBatch;
  }

  //batch meshes with the same material
  private batchModels(renderer: Renderer): Model[] {
    const meshes: Model[] = [];
    for (const key in this._bufferedData) {
      const obj = this._bufferedData[key];
      const objMesh: Model = new Model(new Mesh(renderer));
      objMesh.name = key;

      const p: number[] = obj['position'];
      objMesh.mesh.setPositions(new Float32Array(p), this._storeData);
      const n: number[] = obj['normal'];
      if (n.length > 0) {
        objMesh.mesh.setNormals(new Float32Array(n), this._storeData);
      }
      const uv: number[] = obj['uv0'];
      if (uv.length > 0) {
        objMesh.mesh.setUV0(new Float32Array(uv), this._storeData);
      }
      meshes.push(objMesh);
    }
    return meshes;
  }

  private createMesh(renderer: Renderer, mtlName: string, name: string = ''): Model {
    if (!this._tmpPositions) {
      throw new ReferenceError('Cannot create mesh: expected _tmpPositions to be set');
    }
    if (!this._tmpNormals) {
      throw new ReferenceError('Cannot create mesh: expected _tmpNormals to be set');
    }

    LogGL.log('createMesh', mtlName, this._tmpPositions.length / 3, this._tmpNormals.length / 3);

    const mesh: Mesh = new Mesh(renderer);
    mesh.setPositions(new Float32Array(this._tmpPositions), this._storeData);
    //console.log(this._tmpPositions);
    this._tmpPositions = [];
    if (this._tmpNormals.length > 0) {
      mesh.setNormals(new Float32Array(this._tmpNormals), this._storeData);
      //console.log(this._tmpNormals);
      this._tmpNormals = [];
    }
    if (this._tmpUvs && this._tmpUvs.length > 0) {
      mesh.setUV0(new Float32Array(this._tmpUvs), this._storeData);
      this._tmpUvs = [];
    }
    const objMesh: Model = new Model(mesh);
    objMesh.name = name.trim();
    objMesh.materialName = mtlName.trim();
    return objMesh;
  }

  private createTransformMesh(renderer: Renderer, mtlName: string): Model {
    if (!this._tmpPositions) {
      throw new ReferenceError('Cannot create transform mesh: expected _tmpPositions to be set');
    }
    if (!this._tmpNormals) {
      throw new ReferenceError('Cannot create transform mesh: expected _tmpNormals to be set');
    }
    if (!this._tmpUvs) {
      throw new ReferenceError('Cannot create transform mesh: expected _tmpUvs to be set');
    }

    LogGL.log('createMesh', mtlName, this._tmpPositions.length / 3, this._tmpNormals.length / 3);

    let cx: number = 0;
    let cy: number = 0;
    let cz: number = 0;
    //const center:Vector3 = new Vector3();

    //get sum
    const l: number = this._tmpPositions.length / 3;
    for (let i: number = 0; i < l; i++) {
      cx += this._tmpPositions[i * 3 + 0];
      cy += this._tmpPositions[i * 3 + 1];
      cz += this._tmpPositions[i * 3 + 2];
    }
    //get center
    cx /= l;
    cy /= l;
    cz /= l;

    //subtract venter
    for (let i: number = 0; i < l; i++) {
      this._tmpPositions[i * 3 + 0] -= cx;
      this._tmpPositions[i * 3 + 1] -= cy;
      this._tmpPositions[i * 3 + 2] -= cz;
    }

    const matrix = new Matrix4x4();
    Matrix4x4.translate(matrix, matrix, new Vector3(cx, cy, cz));

    const mesh: Mesh = new Mesh(renderer);
    mesh.setPositions(new Float32Array(this._tmpPositions), this._storeData);
    //console.log(this._tmpPositions);
    this._tmpPositions = [];
    if (this._tmpNormals.length > 0) {
      mesh.setNormals(new Float32Array(this._tmpNormals), this._storeData);
      //console.log(this._tmpNormals);
      this._tmpNormals = [];
    }
    if (this._tmpUvs.length > 0) {
      mesh.setUV0(new Float32Array(this._tmpUvs), this._storeData);
      this._tmpUvs = [];
    }
    const objMesh = new Model(mesh);
    objMesh.materialName = mtlName.trim();
    objMesh.transform.setPositionValues(cx, cy, cz);

    return objMesh;
  }

  private static parseVertexIndex(vertices: Array<number>, value: string) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + vertices.length / 3) * 3;
  }

  private static parseNormalIndex(normals: Array<number>, value: string) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + normals.length / 3) * 3;
  }

  private static parseUVIndex(uvs: Array<number>, value: string) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + uvs.length / 2) * 2;
  }

  private addVertex(positions: Array<number>, a: number, b: number, c: number) {
    if (!this._tmpPositions) {
      this._tmpPositions = [];
    }
    this._tmpPositions.push(
      positions[a],
      positions[a + 1],
      positions[a + 2],
      positions[b],
      positions[b + 1],
      positions[b + 2],
      positions[c],
      positions[c + 1],
      positions[c + 2],
    );
  }

  private addNormal(normals: Array<number>, a: number, b: number, c: number) {
    if (!this._tmpNormals) {
      this._tmpNormals = [];
    }
    this._tmpNormals.push(
      normals[a],
      normals[a + 1],
      normals[a + 2],
      normals[b],
      normals[b + 1],
      normals[b + 2],
      normals[c],
      normals[c + 1],
      normals[c + 2],
    );
  }

  private addUV(uvs: Array<number>, a: number, b: number, c: number) {
    if (!this._tmpUvs) {
      this._tmpUvs = [];
    }
    this._tmpUvs.push(uvs[a], uvs[a + 1], uvs[b], uvs[b + 1], uvs[c], uvs[c + 1]);
  }

  private addFace(
    positions: Array<number>,
    normals: Array<number>,
    uvs: Array<number>,
    a: string,
    b: string,
    c: string,
    d?: string,
    ua: string | undefined = undefined,
    ub: string | undefined = undefined,
    uc: string | undefined = undefined,
    ud: string | undefined = undefined,
    na: string | undefined = undefined,
    nb: string | undefined = undefined,
    nc: string | undefined = undefined,
    nd: string | undefined = undefined,
  ) {
    let ia = ObjParser.parseVertexIndex(positions, a);
    let ib = ObjParser.parseVertexIndex(positions, b);
    let ic = ObjParser.parseVertexIndex(positions, c);
    let id;

    if (d === undefined) {
      this.addVertex(positions, ia, ib, ic);
    } else {
      id = ObjParser.parseVertexIndex(positions, d);

      this.addVertex(positions, ia, ib, id);
      this.addVertex(positions, ib, ic, id);
    }

    if (ua !== undefined && ub !== undefined && uc !== undefined) {
      ia = ObjParser.parseUVIndex(uvs, ua);
      ib = ObjParser.parseUVIndex(uvs, ub);
      ic = ObjParser.parseUVIndex(uvs, uc);

      if (d === undefined || ud === undefined) {
        this.addUV(uvs, ia, ib, ic);
      } else {
        id = ObjParser.parseUVIndex(uvs, ud);

        this.addUV(uvs, ia, ib, id);
        this.addUV(uvs, ib, ic, id);
      }
    }

    if (na !== undefined && nb !== undefined && nc !== undefined) {
      ia = ObjParser.parseNormalIndex(normals, na);
      ib = ObjParser.parseNormalIndex(normals, nb);
      ic = ObjParser.parseNormalIndex(normals, nc);

      if (d === undefined || nd === undefined) {
        this.addNormal(normals, ia, ib, ic);
      } else {
        id = ObjParser.parseNormalIndex(normals, nd);

        this.addNormal(normals, ia, ib, id);
        this.addNormal(normals, ib, ic, id);
      }
    }
  }
}

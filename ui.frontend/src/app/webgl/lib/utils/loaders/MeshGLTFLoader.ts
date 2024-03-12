import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ObjParser from '../mesh/ObjParser';
import LogGL from '../../renderer/core/LogGL';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';

enum GLTFComponentType {
  FLOAT,
  UNSIGNED_SHORT,
  INT,
}

enum GLTFType {
  SCALAR,
  VEC2,
  VEC3,
  VEC4,
}

class GLTFAccessor {
  public bufferView!: number;
  public componentType!: GLTFComponentType;
  public count!: number;
  public type!: GLTFType;
  public min: Vector3 = new Vector3();
  public max: Vector3 = new Vector3();
}

class GLTFBufferView {
  public buffer!: number;
  public byteLength!: number;
  public byteOffset!: number;
}

class GLTFBuffer {
  public byteLength!: number;
  public data!: any;

  public getDataSlice(
    offset: number,
    length: number,
    componentType: GLTFComponentType,
  ): Uint16Array | Uint32Array | Float32Array {
    let data: Uint16Array | Uint32Array | Float32Array;
    let slice = this.data.slice(offset, offset + length);

    var buf = new ArrayBuffer(slice.length);
    var view = new DataView(buf);
    slice.forEach(function (b: number, i: number) {
      view.setUint8(i, b);
    });

    if (componentType == GLTFComponentType.UNSIGNED_SHORT) {
      data = new Uint16Array(slice.length / 2);
      for (let i = 0; i < data.length; ++i) {
        data[i] = view.getUint16(i * 2, true);
      }
    } else if (componentType == GLTFComponentType.INT) {
      data = new Uint32Array(slice.length / 2);
      for (let i = 0; i < data.length; ++i) {
        data[i] = view.getUint32(i * 2, true);
      }
    } else if (componentType == GLTFComponentType.FLOAT) {
      data = new Float32Array(slice.length / 4);
      for (let i = 0; i < data.length; ++i) {
        data[i] = view.getFloat32(i * 4, true);
      }
    }

    return data!;
  }
}

class MeshGLTFLoader implements IWebGLPreloadable {
  public meshes: { [id: string]: Mesh } = {};
  public materials: { [id: string]: Material } = {};
  public transforms: { [id: string]: Transform } = {};
  public textures: { [id: string]: Texture2D } = {};

  private _renderer: Renderer;
  private _url: string;
  private _storeData: boolean;

  constructor(
    renderer: Renderer,
    WebGLPreLoader: WebGLPreLoader,
    url: string,
    storeData: boolean = false,
  ) {
    this._renderer = renderer;
    this._url = url;
    this._storeData = storeData;
    if (url != '') {
      WebGLPreLoader.add(this);
    }
  }

  public load(callback: () => void): void {
    LoadUtils.loadText(this._url, (text: string) => {
      console.log('MeshGLTFLoader', this._url, text);
      this.parseGLTF(JSON.parse(text));
      callback.call(this);
    });
  }

  public setOBJ(obj: ObjParser): void {
    if (!obj.positions || !obj.uvs || !obj.normals) {
      throw new ReferenceError('must run parse() first on ObjParser');
    }
    LogGL.log('MeshObjLoader: setOBJ: ' + obj.positions.length, obj.uvs.length, obj.normals.length);
    // this.setPositions(obj.positions, this._storeData);
    // if (obj.uvs.length > 0) {
    //   this.setUV0(obj.uvs, this._storeData);
    // }
    // if (obj.normals.length > 0) {
    //   this.setNormals(obj.normals, this._storeData);
    // }
  }

  private parseGLTF(json: any): void {
    console.log(json.asset.generator);

    // get accessors
    let accessors: GLTFAccessor[] = [];
    for (let i = 0; i < json.accessors.length; ++i) {
      let accessorData = json.accessors[i];
      let accessor = new GLTFAccessor();

      accessor.bufferView = accessorData.bufferView;
      if (accessorData.componentType == 5126) {
        accessor.componentType = GLTFComponentType.FLOAT;
      } else if (accessorData.componentType == 5123) {
        accessor.componentType = GLTFComponentType.UNSIGNED_SHORT;
      } else if (accessorData.componentType == 5125) {
        accessor.componentType = GLTFComponentType.INT;
      }

      accessor.count = accessorData.count;
      if (accessorData.type == 'SCALAR') {
        accessor.type = GLTFType.SCALAR;
      } else if (accessorData.type == 'VEC2') {
        accessor.type = GLTFType.VEC2;
      } else if (accessorData.type == 'VEC3') {
        accessor.type = GLTFType.VEC3;
      } else if (accessorData.type == 'VEC4') {
        accessor.type = GLTFType.VEC4;
      }
      if (accessorData.min) {
        accessor.min.setValues(accessorData.min[0], accessorData.min[1], accessorData.min[2]);
      }
      if (accessorData.max) {
        accessor.max.setValues(accessorData.max[0], accessorData.max[1], accessorData.max[2]);
      }
      accessors.push(accessor);
    }

    // get bufferviews
    let bufferViews: GLTFBufferView[] = [];
    for (let i = 0; i < json.bufferViews.length; ++i) {
      let bufferViewData = json.bufferViews[i];
      let bufferView = new GLTFBufferView();
      bufferView.buffer = bufferViewData.buffer;
      bufferView.byteLength = bufferViewData.byteLength;
      bufferView.byteOffset = bufferViewData.byteOffset;
      bufferViews.push(bufferView);
    }

    // get buffers
    let buffers: GLTFBuffer[] = [];
    for (let i = 0; i < json.buffers.length; ++i) {
      let bufferData = json.buffers[i];
      let buffer = new GLTFBuffer();

      buffer.byteLength = bufferData.byteLength;
      // decode base64 to bytes
      let base64: string = bufferData.uri;
      base64 = base64.slice(base64.indexOf('base64,') + 7);
      // base64 = base64.replace(';base64', '');
      let binaryString = atob(base64);
      let bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      buffer.data = bytes;
      buffers.push(buffer);
    }

    // get meshes from data
    for (let i = 0; i < json.meshes.length; ++i) {
      let meshData = json.meshes[i];

      let mesh: Mesh = new Mesh(this._renderer);

      // Get attributes
      let attributes = meshData.primitives[0].attributes;
      // - position
      {
        let accesorID = attributes['POSITION'];
        let accessor = accessors[accesorID];
        let bufferView = bufferViews[accessor.bufferView];
        let buffer = buffers[bufferView.buffer];
        let data: Float32Array = <Float32Array>(
          buffer.getDataSlice(bufferView.byteOffset, bufferView.byteLength, GLTFComponentType.FLOAT)
        );
        mesh.setPositions(data);
      }
      // - normal
      {
        let accesorID = attributes['NORMAL'];
        let accessor = accessors[accesorID];
        let bufferView = bufferViews[accessor.bufferView];
        let buffer = buffers[bufferView.buffer];
        let data: Float32Array = <Float32Array>(
          buffer.getDataSlice(bufferView.byteOffset, bufferView.byteLength, accessor.componentType)
        );
        mesh.setNormals(data);
      }
      // - texcoords
      {
        let accesorID = attributes['TEXCOORD_0'];
        let accessor = accessors[accesorID];
        let bufferView = bufferViews[accessor.bufferView];
        let buffer = buffers[bufferView.buffer];
        let data: Float32Array = <Float32Array>(
          buffer.getDataSlice(bufferView.byteOffset, bufferView.byteLength, accessor.componentType)
        );
        mesh.setUV0(data);
      }
      // - indices
      {
        let accesorID = meshData.primitives[0].indices;
        let accessor = accessors[accesorID];
        let bufferView = bufferViews[accessor.bufferView];
        let buffer = buffers[bufferView.buffer];
        let data: Uint16Array = <Uint16Array>(
          buffer.getDataSlice(bufferView.byteOffset, bufferView.byteLength, accessor.componentType)
        );
        mesh.setIndices(data);
      }
      this.meshes[meshData.name] = mesh;
    }
  }
}

export default MeshGLTFLoader;

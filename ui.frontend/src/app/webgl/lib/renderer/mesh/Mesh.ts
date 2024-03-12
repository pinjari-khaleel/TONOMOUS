import VertexAttribute from './VertexAttribute';
import Renderer from '../render/Renderer';
import AttributeChannel from './AttributeChannel';
import GL from '../base/GL';
import LogGL from '../core/LogGL';
import IWebGLDestructible from '../core/IWebGLDestructible';

interface InterleavedMesh extends Mesh {
  interleaved: true;
  interleavedBuffer: WebGLBuffer;
  interleavedStrideSum: number;
}

interface MeshWithIndices extends Mesh {
  indices: Uint16Array | Uint32Array;
  indexType: number;
}

export default class Mesh implements IWebGLDestructible {
  private static staticId: number = 0;

  public name: string = 'unnamed';
  public readonly id: number;
  public animatorId: number = -1;

  public indexBuffer: WebGLBuffer | undefined;
  public interleaved: boolean;
  public interleavedBuffer: WebGLBuffer | undefined;
  public interleavedStrideSum: number = 0;
  public isDynamic: boolean;
  public indices: Uint16Array | Uint32Array | undefined;
  public attributes: VertexAttribute[];
  public renderer: Renderer;
  public indexType: number = GL.UNSIGNED_SHORT;

  protected _vertexCount: number = 0;
  protected _isInterleavedBufferDirty: boolean = true;

  private _attributeNames: { [s: string]: boolean } = {};

  constructor(renderer: Renderer, interleavedBuffer: boolean = true, dynamic: boolean = false) {
    this.renderer = renderer;
    this.attributes = [];
    this._vertexCount = 0;
    this.id = Mesh.staticId++;
    this.interleaved = interleavedBuffer;
    this.isDynamic = dynamic;
  }

  public setJSONData(json: any, storeData: boolean = false) {
    this.animatorId = json.animatorId;
    this.isDynamic = json.isDynamic || false;

    if (json.indices && json.indices.length > 0) {
      if (json.use32BitIndices || false) {
        this.setIndices32(new Uint32Array(json.indices));
      } else {
        this.setIndices(new Uint16Array(json.indices));
      }
    }

    for (let j = 0; j < json.attributes.length; j++) {
      const attribute = json.attributes[j];
      this.setAttribute(
        attribute.name,
        attribute.stride,
        new Float32Array(attribute.data),
        storeData,
      );
    }
  }

  // used for saving meshes with fewer attributes. Not tested for rendering.
  public clone(): Mesh {
    const mesh: Mesh = new Mesh(this.renderer, this.interleaved, this.isDynamic);
    //note that the attributes are references.
    for (let i: number = 0; i < this.attributes.length; i++) {
      mesh.attributes.push(this.attributes[i]);
    }
    mesh._vertexCount = this._vertexCount;
    return mesh;
  }

  public interleaveData(): void {
    if (!this._isInterleavedBufferDirty || !this.interleaved) {
      return;
    }

    this.interleavedStrideSum = 0;
    for (let i: number = 0; i < this.attributes.length; i++) {
      this.interleavedStrideSum += this.attributes[i].stride;
    }
    const data: Float32Array = new Float32Array(this.interleavedStrideSum * this._vertexCount);
    let index: number = 0;

    for (let i: number = 0; i < this._vertexCount; i++) {
      for (let j: number = 0; j < this.attributes.length; j++) {
        const attribute = this.attributes[j];
        for (let k: number = 0; k < attribute.stride; k++) {
          data[index++] = (<Float32Array>attribute.data)[i * attribute.stride + k];
        }
      }
    }

    for (let i: number = 0; i < this.attributes.length; i++) {
      if (!this.attributes[i].storeData) {
        this.attributes[i].data = null;
      }
    }

    this.interleavedBuffer = <WebGLBuffer>this.renderer.context.createBuffer();
    const gl: WebGLRenderingContext = this.renderer.context;
    gl.bindBuffer(GL.ARRAY_BUFFER, this.interleavedBuffer);
    gl.bufferData(GL.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this._isInterleavedBufferDirty = false;

    //LogGL.log('Mesh: finalize', this.attributes.length);
  }

  public isInterleaved(): this is InterleavedMesh {
    return this.interleaved;
  }

  public hasIndices(): this is MeshWithIndices {
    return !!this.indices;
  }

  public setAttribute(
    name: string,
    stride: number,
    data: Float32Array,
    storeData: boolean = false,
  ): void {
    this.setData(data, name, stride, storeData);
  }

  public setPositions(data: Float32Array, storeData: boolean = false) {
    const attr: AttributeChannel = AttributeChannel.POSITION;
    this.setData(data, attr.name, attr.stride, storeData);
  }

  public getPositions(): Float32Array | null {
    return this.getData(AttributeChannel.POSITION.name);
  }

  public setNormals(data: Float32Array, storeData: boolean = false) {
    const attr: AttributeChannel = AttributeChannel.NORMAL;
    this.setData(data, attr.name, attr.stride, storeData);
  }

  public getNormals() {
    return this.getData(AttributeChannel.NORMAL.name);
  }

  public setColors(data: Float32Array) {
    const attr: AttributeChannel = AttributeChannel.COLOR0;
    this.setData(data, attr.name, attr.stride);
  }

  public getColors() {
    return this.getData(AttributeChannel.COLOR0.name);
  }

  public setColors1(data: Float32Array) {
    const attr: AttributeChannel = AttributeChannel.COLOR1;
    this.setData(data, attr.name, attr.stride);
  }

  public getColors1() {
    return this.getData(AttributeChannel.COLOR1.name);
  }

  public setUV0(data: Float32Array, storeData: boolean = false) {
    const attr: AttributeChannel = AttributeChannel.TEXCOORD0;
    this.setData(data, attr.name, attr.stride, storeData);
  }

  public getUV0(): Float32Array | null {
    return this.getData(AttributeChannel.TEXCOORD0.name);
  }

  public setUV1(data: Float32Array, storeData: boolean = false) {
    const attr: AttributeChannel = AttributeChannel.TEXCOORD1;
    this.setData(data, attr.name, attr.stride, storeData);
  }

  public getUV1(): Float32Array | null {
    return this.getData(AttributeChannel.TEXCOORD1.name);
  }

  public setTangents(data: Float32Array, storeData: boolean = false) {
    const attr: AttributeChannel = AttributeChannel.TANGENT;
    this.setData(data, attr.name, attr.stride, storeData);
  }

  public getTangents(): Float32Array | null {
    return this.getData(AttributeChannel.TANGENT.name);
  }

  // TODO: update VAO in the renderer! Discuss possible solutions, VAO in mesh perhaps?
  // [ note that the isDynamic flag ensures the VAO is updated in the RendererWebGL1,
  //   however, the rendererWebGL2 doesn't update the VAO on setData. ]
  // stride is in groups of 4 bytes (e.g. 3 channel float position attribute would have a stride of 3)
  public setData(data: Float32Array, name: string, stride: number, storeData: boolean = false) {
    this._attributeNames = {};

    const attributeIndex = this.getAttributeIndex(name);
    const vertexCount: number = data.length / stride;

    if (attributeIndex < 0) {
      // create new buffer
      this.attributes.push(
        new VertexAttribute(this.renderer, name, data, stride, storeData, !this.interleaved),
      );
    } else {
      // write new data to attribute
      if (this.attributes[attributeIndex].vertexCount == vertexCount) {
        // replace data
        // LogGL.log('replacing attribute data: ', name, data.length / stride, data);
        this.attributes[attributeIndex].setData(data, storeData);
      } else {
        // create new buffer
        // LogGL.log('replacing attribute', name, data.length / stride);
        this.attributes[attributeIndex].destruct();
        this.attributes[attributeIndex] = new VertexAttribute(
          this.renderer,
          name,
          data,
          stride,
          storeData,
          !this.interleaved,
        );
      }
    }
    this._vertexCount = vertexCount;

    if (this.interleaved) {
      this._isInterleavedBufferDirty = true;
    }
  }

  public deleteAttribute(name: string): void {
    const attributeIndex = this.getAttributeIndex(name);

    if (attributeIndex >= 0) {
      this.attributes.splice(attributeIndex, 1);
    }
    this._isInterleavedBufferDirty = true;
    // this.finalize();
    this._attributeNames = {};
  }

  public hasAttribute(name: string): boolean {
    const luv = this._attributeNames[name];
    if (luv === true || luv === false) {
      return luv;
    }
    const index = this.getAttributeIndex(name);
    this._attributeNames[name] = index >= 0;
    return this._attributeNames[name];
  }

  public getAttribute(name: string): VertexAttribute | null {
    const attributeIndex = this.getAttributeIndex(name);
    if (attributeIndex >= 0) {
      return this.attributes[attributeIndex];
    }
    return null;
  }

  private getAttributeIndex(name: string): number {
    for (let i: number = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  public getData(name: string): Float32Array | null {
    const va = this.getAttribute(name);
    if (va && va.data) {
      return va.data;
    } else {
      LogGL.log('Mesh: getData', name, 'no data');
      return null;
    }
  }

  public setIndices(indices: Uint16Array) {
    if (!(indices instanceof Uint16Array)) {
      throw 'Indices need to be of type Uint16Array';
      // For some reason the type is not checked by the compiler.
      // Very easy to make mistakes that are very hard to debug
      // since no-one throws an error except for a badly readable
      // WebGL error, without a stack trace!
    }

    this.indexType = GL.UNSIGNED_SHORT;
    this.indices = indices;
    const gl: WebGLRenderingContext = this.renderer.context;
    if (!this.indexBuffer) {
      this.indexBuffer = <WebGLBuffer>gl.createBuffer();
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  }

  public setIndices32(indices: Uint32Array) {
    if (!(indices instanceof Uint32Array)) {
      throw 'Indices need to be of type Uint32Array';
      // For some reason the type is not checked by the compiler.
      // Very easy to make mistakes that are very hard to debug
      // since no-one throws an error except for a badly readable
      // WebGL error, without a stack trace!
    }

    // if (this.renderer.extensionManager.element_index_uint) { // || (this.renderer instanceof RendererWebGL2) - dit geeft problemen
    if (
      this.renderer.extensionManager.element_index_uint ||
      this.renderer.context instanceof WebGL2RenderingContext
    ) {
      this.indexType = GL.UNSIGNED_INT;
      this.indices = indices;
      const gl: WebGLRenderingContext = this.renderer.context;
      if (!this.indexBuffer) {
        this.indexBuffer = <WebGLBuffer>gl.createBuffer();
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    } else {
      LogGL.log(
        'mesh: setIndices32: extension not supported: element_index_uint: using 16 bits indices',
      );
      this.setIndices(new Uint16Array(indices));
    }
  }

  public getNumVertices(): number {
    return this._vertexCount;
  }

  public isSkinned(): boolean {
    return this.hasAttribute('aSkinIndex');
  }

  destruct() {
    this.renderer.destructVAO(this);

    const gl: WebGLRenderingContext = this.renderer.context;

    if (this.interleavedBuffer) {
      gl.deleteBuffer(this.interleavedBuffer);
    }

    if (this.indexBuffer) {
      gl.deleteBuffer(this.indexBuffer);
    }

    if (this.attributes) {
      for (let i = 0; i < this.attributes.length; i++) {
        this.attributes[i].destruct();
      }
    }
  }
}

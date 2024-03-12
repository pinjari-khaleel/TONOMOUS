import Renderer from '../render/Renderer';
import GL from '../base/GL';
import IWebGLDestructible from '../core/IWebGLDestructible';

export default class VertexAttribute implements IWebGLDestructible {
  public data: Float32Array | null = null;
  public name: string;
  public stride: number;
  public storeData: boolean;
  public buffer: WebGLBuffer | null = null;
  public vertexCount: number = -1;

  private _renderer: Renderer;

  constructor(
    renderer: Renderer,
    name: string,
    data: Float32Array,
    stride: number,
    storeData: boolean,
    setBuffer: boolean,
  ) {
    this._renderer = renderer;
    this.stride = stride;
    // used for interleaved
    // if(!this.buffer)this.data = data;
    this.name = name;
    this.storeData = storeData;
    this.vertexCount = data.length / stride;

    if (setBuffer) {
      this.buffer = <WebGLBuffer>this._renderer.context.createBuffer();
      this.setData(data, storeData);
    } else {
      this.data = data;
    }
    // LogGL.log ("VertexAttribute: length: " +  this.getBufferLength(), name, "storeData", storeData);
  }

  // used only when not interleaved
  public setData(data: Float32Array, storeData: boolean) {
    if (storeData || !this.buffer) {
      this.data = data;
    } else {
      this.data = null;
    }
    if (data.length === 0) {
      // LogGL.log("probably a mesh file could not be loaded");
      console.warn(
        'VertexAttribute: no data: probably a mesh file could not be loaded: ' + this.name,
      );
      return;
    }

    if (this.buffer) {
      const gl: WebGLRenderingContext = this._renderer.context;
      gl.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
      // use DYNAMIC_DRAW when creating dynamic meshes
      gl.bufferData(GL.ARRAY_BUFFER, data.byteLength, GL.STATIC_DRAW);
      gl.bufferSubData(GL.ARRAY_BUFFER, 0, data);
    }
  }

  public getBufferLength(): number {
    if (this.data) {
      return this.data.length;
    } else {
      if (!this.buffer) {
        throw new ReferenceError('Cannot get buffer length: no buffer set on VertextAttribute');
      }

      const gl: WebGLRenderingContext = this._renderer.context;
      gl.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
      return gl.getBufferParameter(GL.ARRAY_BUFFER, GL.BUFFER_SIZE) / 4;
    }
  }

  public destruct() {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
    }
    this.data = null;
  }
}

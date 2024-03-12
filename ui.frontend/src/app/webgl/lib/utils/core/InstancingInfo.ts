import Renderer from '../../renderer/render/Renderer';
import RendererWebGL2 from '../../renderer/render/RendererWebGL2';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export interface InstancedAttribute {
  index: number;
  nrComponents: number;
  buffer: WebGLBuffer;
  bufferStride: number;
  bufferOffset: number;
}

export class InstancingInfo implements IWebGLDestructible {
  public attributes: InstancedAttribute[] = [];
  private _renderer: RendererWebGL2; // instancing is a WebGL2 specific feature.
  private buffers: { [attributeIndex: number]: WebGLBuffer } = {};

  constructor(renderer: Renderer) {
    this._renderer = <RendererWebGL2>renderer;
  }

  /*
	 Adds (one or more) instanced attributes to the total list of instanced vertex
	 attributes. When passed to the renderer, all instanced attributes will be
	 enabled in the subsequent instanced render calls.

	 nrComponents specifies the number of floating point components e.g. a
	 vec3 instanced vertex attribute will hold a total of 3 components.

	 Attribute types that require more than 1 vertex attribute (e.g. mat3/4) should
	 call addAttribteData for each attribute (see addMat4Attribute).

	 */
  public addAttributeData(attributeIndex: number, nrComponents: number, data: Float32Array): void {
    const context: WebGL2RenderingContext = <WebGL2RenderingContext>this._renderer.context;

    // create a new buffer and fill with instanced data

    if (this.buffers[attributeIndex] == null)
      this.buffers[attributeIndex] = <WebGLBuffer>context.createBuffer();
    const buffer = this.buffers[attributeIndex];
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, data.byteLength, context.STATIC_DRAW);
    context.bufferSubData(context.ARRAY_BUFFER, 0, data.buffer);

    const instancedArray: InstancedAttribute = {
      index: attributeIndex,
      nrComponents,
      buffer,
      bufferStride: nrComponents * 4,
      bufferOffset: 0,
    };
    this.attributes.push(instancedArray);
  }

  // reserve attribute startIndex + 0, startIndex + 1, startIndex + 2, startIndex + 3
  public addMat4Attribute(startIndex: number, data: Float32Array): void {
    const matrixData: Float32Array[] = [];
    const instanceCount = data.length / 16;

    for (let i: number = 0; i < 4; i++) {
      matrixData[i] = new Float32Array(instanceCount * 4);
    }

    // cut it up into 4 arrays
    for (let instance: number = 0; instance < instanceCount; instance++) {
      for (let row: number = 0; row < 4; row++) {
        for (let column: number = 0; column < 4; column++) {
          matrixData[row][instance * 4 + column] = data[instance * 16 + row * 4 + column];
        }
      }
    }

    // a matrix attribute consists of 4 vec4 attributes
    for (let i: number = 0; i < 4; i++) {
      this.addAttributeData(startIndex + i, 4, matrixData[i]);
    }
  }

  destruct() {
    for (let i: number = 0; i < this.attributes.length; ++i) {
      this._renderer.context.deleteBuffer(this.attributes[i].buffer);
    }
    this.attributes = [];
  }
}

import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import RequireContextIndex from 'mediamonks-webgl/utils/assets/RequireContextIndex';
import Material from '../material/Material';
import Mesh from '../mesh/Mesh';
import VertexAttribute from '../mesh/VertexAttribute';
import ShaderAttribute from '../material/ShaderAttribute';
import { InstancingInfo } from '../../utils/core/InstancingInfo';
import Renderer from './Renderer';

export default class RendererWebGL2 extends Renderer {
  // todo: discuss how we want to manage VAOs; store in renderer, store in mesh?
  private vertexArrayObjects: { [id: number]: WebGLVertexArrayObject[] } = {};

  constructor(
    preloader: WebGLPreLoader,
    canvas: HTMLCanvasElement,
    shaderIndexOrContext:
      | RequireContextIndex<string>
      | __WebpackModuleApi.RequireContext
      | null
      | null,
    antialias: boolean,
    transparent: boolean = false,
    autoClear: boolean = true,
    stencil: boolean = true,
    xrCompatible: boolean = false,
  ) {
    super(
      preloader,
      canvas,
      Renderer.webgl2ContextNames,
      shaderIndexOrContext,
      antialias,
      transparent,
      autoClear,
      stencil,
      xrCompatible,
    );

    this.vertexArrayObjects = {};
  }

  public preprocessShaderString(shader: string): string {
    const position: number = shader.indexOf('#version');
    let version: string = '';
    if (position > -1) {
      version = shader.substr(position, shader.indexOf('\n', position) - position);
    }
    shader = shader.replace(version, '');
    shader = version + '\n' + '#define WEBGL2\n' + shader;

    return shader;
  }

  public destructVAO(mesh: Mesh) {
    const meshVaos: any = this.vertexArrayObjects[mesh.id];
    for (const k in meshVaos) {
      const vao = meshVaos[k];
      (<WebGL2RenderingContext>this.context).deleteVertexArray(vao);
    }
    delete this.vertexArrayObjects[mesh.id];
  }

  public getVAO(mesh: Mesh, material: Material): WebGLVertexArrayObject {
    let vao: WebGLVertexArrayObject | null = null;
    let meshVaos: WebGLVertexArrayObject[] = this.vertexArrayObjects[mesh.id];

    if (meshVaos) {
      vao = meshVaos[material.id];
      if (!vao) {
        vao = this.initVAO(mesh, material);
        meshVaos[material.id] = vao;
      }
    } else {
      meshVaos = [];
      vao = this.initVAO(mesh, material);
      meshVaos[material.id] = vao;
      this.vertexArrayObjects[mesh.id] = meshVaos;
    }
    return vao;
  }

  // note, VAOs are core in WebGL 2.0
  public initVAO(mesh: Mesh, material: Material): WebGLVertexArrayObject {
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.context;
    const vao = <WebGLVertexArrayObject>gl.createVertexArray();
    gl.bindVertexArray(vao);
    {
      // if mesh has interleaved data, store all interleaved data into the vertex buffer.
      let offset: number = 0.0;
      if (mesh.isInterleaved()) {
        mesh.interleaveData();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, mesh.interleavedBuffer);
      } // otherwise, buffers are already filled/configured within mesh attributes

      for (let i: number = 0; i < mesh.attributes.length; i++) {
        const va: VertexAttribute = mesh.attributes[i];
        const sa = <ShaderAttribute>material.shader.getAttributeByName(va.name);

        if (sa) {
          if (va.stride !== sa.stride) {
            LogGL.log("Renderer: initVAO: strides don't match: ", va.stride, sa.stride);
            continue;
          }

          if (mesh.isInterleaved()) {
            gl.enableVertexAttribArray(sa.loc);
            gl.vertexAttribPointer(
              sa.loc,
              sa.stride,
              gl.FLOAT,
              false,
              mesh.interleavedStrideSum * 4,
              offset,
            );
          } else {
            if (va.buffer === null) {
              throw new ReferenceError(
                'Expected buffer to be defined on VertexAttribute on non-interleaved mesh.',
              );
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, va.buffer);
            gl.enableVertexAttribArray(sa.loc);
            gl.vertexAttribPointer(sa.loc, sa.stride, gl.FLOAT, false, sa.stride * 4, 0);
          }
        } else {
          // LogGL.log("initVAO: mesh has attribute that material does not have: " + va.name + ": " +
          // material.shader.name);
        }
        if (mesh.interleaved) {
          offset += va.stride * 4;
        }
      }
      if (mesh.indexBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
      }
    }

    return vao;
  }

  public draw(mesh: Mesh, material: Material, startIndex: number = 0, elementCount: number = -1) {
    material.setActive();

    const vao: WebGLVertexArrayObject = this.getVAO(mesh, material);
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.context;
    gl.bindVertexArray(vao);
    this.drawElements(mesh, material, startIndex, elementCount);
    gl.bindVertexArray(null);
  }

  public startBatch(mesh: Mesh, material: Material): void {
    material.setActive();
    const vao: WebGLVertexArrayObject = this.getVAO(mesh, material);
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.context;
    gl.bindVertexArray(vao);
  }

  public drawElements(
    mesh: Mesh,
    material: Material,
    startIndex: number = 0,
    elementCount: number = -1,
  ): void {
    if (mesh.hasIndices()) {
      // @ts-ignore
      const maxCount = (<Mesh>mesh).indices.length;
      if (elementCount > 0) {
        this.context.drawElements(
          material.drawType,
          Math.min(maxCount, elementCount),
          mesh.indexType,
          0,
        );
      } else {
        this.context.drawElements(material.drawType, maxCount, mesh.indexType, 0);
      }
    } else {
      const maxCount = (<Mesh>mesh).getNumVertices() - startIndex;
      if (elementCount > 0) {
        this.context.drawArrays(material.drawType, startIndex, Math.min(maxCount, elementCount));
      } else {
        this.context.drawArrays(material.drawType, startIndex, maxCount);
      }
    }
  }

  /*    public endBatch():void {
	 if (this.extensionManager.vertex_array_object) {
	 this.extensionManager.vertex_array_object.bindVertexArrayOES(null);
	 }
	 }*/

  //TODO: this can go wrong when a mesh material combo is drawn with different instancingInfos. this is fixed in the getty project but at the cost of mesh destructor not destructing the vao.
  public drawInstanced(
    mesh: Mesh,
    material: Material,
    instanceCount: number,
    instancingInfo: InstancingInfo,
  ) {
    material.setActive();

    // const vaoConfigured: boolean = this.vertexArrayObjects &&
    //   (this.vertexArrayObjects[mesh.id] !== null) && (this.vertexArrayObjects[mesh.id][material.id] !== null);
    const vao: WebGLVertexArrayObject = this.getVAO(mesh, material);
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.context;

    gl.bindVertexArray(vao);
    // configure instanced arrays for each vertex attribute; only if it hasn't been configured before
    // if (!vaoConfigured) {
    for (const attributeInfo of instancingInfo.attributes) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attributeInfo.buffer);
      gl.enableVertexAttribArray(attributeInfo.index);
      gl.vertexAttribPointer(
        attributeInfo.index,
        attributeInfo.nrComponents,
        gl.FLOAT,
        false,
        attributeInfo.bufferStride,
        attributeInfo.bufferOffset,
      );
      gl.vertexAttribDivisor(attributeInfo.index, 1);
    }
    // }

    // then draw
    if (mesh.hasIndices()) {
      gl.drawElementsInstanced(
        material.drawType,
        mesh.indices.length,
        mesh.indexType,
        0,
        instanceCount,
      );
    } else {
      gl.drawArraysInstanced(material.drawType, 0, (<Mesh>mesh).getNumVertices(), instanceCount);
    }
  }

  destruct() {
    LogGL.log('RendererWebGL2: destruct');

    if (this.vertexArrayObjects) {
      for (const meshId in this.vertexArrayObjects) {
        for (let i: number = 0; i < this.vertexArrayObjects[meshId].length; ++i) {
          (<WebGL2RenderingContext>this.context).deleteVertexArray(
            this.vertexArrayObjects[meshId][i],
          );
        }
      }
    }

    // always call this last
    super.destruct();
  }
}

import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import RequireContextIndex from 'mediamonks-webgl/utils/assets/RequireContextIndex';
import Material from '../material/Material';
import Mesh from '../mesh/Mesh';
import Renderer from './Renderer';
import GL from '../base/GL';

export default class RendererWebGL1 extends Renderer {
  private vertexArrayObjects: any;
  private currentVAO: any;

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
    premultipliedAlpha: boolean = true,
  ) {
    super(
      preloader,
      canvas,
      Renderer.webgl1ContextNames,
      shaderIndexOrContext,
      antialias,
      transparent,
      autoClear,
      stencil,
      premultipliedAlpha,
    );

    this.vertexArrayObjects = {};
  }

  public preprocessShaderString(shader: string): string {
    return '#define WEBGL1\n' + shader;
  }

  public initVAO(mesh: Mesh, material: Material): any {
    const ext: any = this.extensionManager.vertex_array_object;
    const vao: any = ext.createVertexArrayOES();
    ext.bindVertexArrayOES(vao);
    this.setStates(mesh, material);
    ext.bindVertexArrayOES(null);
    return vao;
  }

  public setStates(mesh: Mesh, material: Material): void {
    const gl: WebGLRenderingContext = this.context;

    if (mesh.isInterleaved()) {
      mesh.interleaveData();
      gl.bindBuffer(gl.ARRAY_BUFFER, <WebGLBuffer>mesh.interleavedBuffer);
      let offset: number = 0;

      mesh.attributes.forEach((va) => {
        const sa = material.shader.getAttributeByName(va.name);

        if (sa) {
          gl.enableVertexAttribArray(sa.loc);
          gl.vertexAttribPointer(
            sa.loc,
            sa.stride,
            gl.FLOAT,
            false,
            mesh.interleavedStrideSum * 4,
            offset,
          );
        }
        offset += va.stride * 4;
      });
    } else {
      mesh.attributes.forEach((va) => {
        const sa = material.shader.getAttributeByName(va.name);

        if (sa) {
          if (va.buffer === null) {
            throw new ReferenceError(
              'Expected buffer to be defined on VertexAttribute when setting states.',
            );
          }
          gl.bindBuffer(gl.ARRAY_BUFFER, va.buffer);
          gl.enableVertexAttribArray(sa.loc);
          gl.vertexAttribPointer(sa.loc, sa.stride, gl.FLOAT, false, sa.stride * 4, 0);
        }
      });
    }

    if (mesh.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    }
  }

  public destructVAO(mesh: Mesh) {
    const ext: any = this.extensionManager.vertex_array_object;
    if (ext) {
      const meshVaos: any = this.vertexArrayObjects[mesh.id];
      for (const k in meshVaos) {
        const vao = meshVaos[k];
        ext.deleteVertexArrayOES(vao);
      }
      this.vertexArrayObjects[mesh.id] = [];
    }
  }

  // TODO: a vao could be a property of the model class which has a mesh and a material
  public getVAO(mesh: Mesh, material: Material): any {
    let vao: any;
    let meshVaos: any = this.vertexArrayObjects[mesh.id];

    if (meshVaos) {
      vao = meshVaos[material.id];
      if (!vao) {
        vao = this.initVAO(mesh, material);
        meshVaos[material.id] = vao;
      }
    } else {
      meshVaos = {};
      vao = this.initVAO(mesh, material);
      meshVaos[material.id] = vao;
      this.vertexArrayObjects[mesh.id] = meshVaos;
    }
    return vao;
  }

  private bindVAO(vao: any) {
    const ext: any = this.extensionManager.vertex_array_object;
    if (vao != this.currentVAO) {
      ext.bindVertexArrayOES(vao);
      this.currentVAO = vao;
    }
  }

  public drawVAO(
    vao: any,
    mesh: Mesh,
    material: Material,
    startIndex: number = 0,
    vertexCount: number = -1,
  ) {
    material.setActive();
    this.bindVAO(vao);
    this.drawElements(mesh, material, startIndex, vertexCount);
    this.bindVAO(null);
  }

  public draw(mesh: Mesh, material: Material, startIndex: number = 0, vertexCount: number = -1) {
    material.setActive();

    const ext: any = this.extensionManager.vertex_array_object;
    if (!ext || mesh.isDynamic) {
      // TODO: remove this when vertexArrayObject extension is broadly supported
      this.setStates(mesh, material);
      this.drawElements(mesh, material, startIndex, vertexCount);
    } else {
      const vao = this.getVAO(mesh, material);
      this.bindVAO(vao);
      this.drawElements(mesh, material, startIndex, vertexCount);
      this.bindVAO(null);
    }
  }

  public startBatch(mesh: Mesh, material: Material): void {
    material.setActive();

    const ext: any = this.extensionManager.vertex_array_object;
    if (ext) {
      this.extensionManager.vertex_array_object.bindVertexArrayOES(this.getVAO(mesh, material));
    } else {
      this.setStates(mesh, material);
    }
  }

  public drawElements(
    mesh: Mesh,
    material: Material,
    startIndex: number = 0,
    vertexCount: number = -1,
  ): void {
    if (mesh.indices) {
      if (vertexCount > 0) {
        this.context.drawElements(
          material.drawType,
          Math.min(vertexCount, mesh.indices.length),
          mesh.indexType,
          startIndex * (mesh.indexType == GL.UNSIGNED_SHORT ? 2 : 4),
        );
      } else {
        this.context.drawElements(material.drawType, mesh.indices.length, mesh.indexType, 0);
      }
    } else {
      const maxCount = mesh.getNumVertices() - startIndex;
      if (vertexCount > 0) {
        this.context.drawArrays(material.drawType, startIndex, Math.min(maxCount, vertexCount));
      } else {
        this.context.drawArrays(material.drawType, startIndex, maxCount);
      }
    }
  }

  public endBatch(): void {
    if (this.extensionManager.vertex_array_object) {
      this.extensionManager.vertex_array_object.bindVertexArrayOES(null);
    }
  }

  destruct() {
    LogGL.log('RendererWebGL1: destruct');
    const ext: any = this.extensionManager.vertex_array_object;
    if (ext) {
      if (this.vertexArrayObjects) {
        for (let i = 0; i < this.vertexArrayObjects.length; i++) {
          // TODO: test
          ext.deleteVertexArrayOES(this.vertexArrayObjects[i]);
        }
      }
    }
    // always call this last
    super.destruct();
  }
}

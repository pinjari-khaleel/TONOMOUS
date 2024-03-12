import LogGL from 'mediamonks-webgl/renderer/core/LogGL';

// http://alteredqualia.com/tmp/webgl-maxparams-test/
export default class MaxParams {
  public MAX_VERTEX_ATTRIBS: number;
  public MAX_VARYING_VECTORS: number;
  public MAX_VERTEX_UNIFORM_VECTORS: number;
  public MAX_FRAGMENT_UNIFORM_VECTORS: number;
  public MAX_TEXTURE_IMAGE_UNITS: number;
  public MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
  public MAX_TEXTURE_SIZE: number;
  public MAX_CUBE_MAP_TEXTURE_SIZE: number;
  public MAX_VIEWPORT_DIMS: number;
  public MAX_RENDERBUFFER_SIZE: number;
  public MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;

  public UNMASKED_RENDERER: string;
  public UNMASKED_VENDOR: string;

  constructor(gl: WebGLRenderingContext) {
    this.MAX_VERTEX_ATTRIBS = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    this.MAX_VARYING_VECTORS = gl.getParameter(gl.MAX_VARYING_VECTORS);
    this.MAX_VERTEX_UNIFORM_VECTORS = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    this.MAX_FRAGMENT_UNIFORM_VECTORS = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    this.MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this.MAX_VERTEX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    this.MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.MAX_CUBE_MAP_TEXTURE_SIZE = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
    this.MAX_VIEWPORT_DIMS = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    this.MAX_RENDERBUFFER_SIZE = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    this.MAX_COMBINED_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    const glExtensionDebugRendererInfo: any = gl.getExtension('WEBGL_debug_renderer_info');
    this.UNMASKED_RENDERER =
      glExtensionDebugRendererInfo &&
      gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);
    this.UNMASKED_VENDOR =
      glExtensionDebugRendererInfo &&
      gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL);

    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        LogGL.log(property, this[property]);
      }
    }
  }
}

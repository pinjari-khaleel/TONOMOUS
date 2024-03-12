import LogGL from 'mediamonks-webgl/renderer/core/LogGL';

export default class ExtensionManager {
  public color_buffer_float: any;
  public color_buffer_half_float: any;
  public texture_float: any;
  public texture_float_linear: any;
  public texture_half_float: any;
  public texture_half_float_linear: any;
  public shader_texture_lod: any;
  public standard_derivatives: any;
  public blend_minmax: any;
  public seamless_cube_map: any;
  public filter_anisotropic: any;
  public frag_depth: any;
  public depth_texture: any;
  public vertex_array_object: any;
  public element_index_uint: any;

  public maxAnisotropy: number = 0;

  public enableExtensions(context: WebGLRenderingContext): void {
    this.color_buffer_float =
      ExtensionManager.enableExtension(context, 'WEBGL_color_buffer_float') ||
      ExtensionManager.enableExtension(context, 'EXT_color_buffer_float');
    this.color_buffer_half_float = ExtensionManager.enableExtension(
      context,
      'EXT_color_buffer_half_float',
    );

    this.texture_float = ExtensionManager.enableExtension(context, 'OES_texture_float');
    this.texture_float_linear = ExtensionManager.enableExtension(
      context,
      'OES_texture_float_linear',
    );

    this.texture_half_float = ExtensionManager.enableExtension(context, 'OES_texture_half_float');
    this.texture_half_float_linear = ExtensionManager.enableExtension(
      context,
      'OES_texture_half_float_linear',
    );

    this.shader_texture_lod = ExtensionManager.enableExtension(context, 'EXT_shader_texture_lod');
    this.standard_derivatives = ExtensionManager.enableExtension(
      context,
      'OES_standard_derivatives',
    );
    this.blend_minmax = ExtensionManager.enableExtension(context, 'EXT_blend_minmax');
    this.seamless_cube_map = ExtensionManager.enableExtension(context, 'OES_seamless_cube_map');
    this.vertex_array_object = ExtensionManager.enableExtension(context, 'OES_vertex_array_object');

    this.filter_anisotropic = ExtensionManager.enableExtension(
      context,
      'EXT_texture_filter_anisotropic',
    );
    if (!this.filter_anisotropic) {
      this.filter_anisotropic = ExtensionManager.enableExtension(
        context,
        'texture_filter_anisotropic',
      );
    }
    if (!this.filter_anisotropic) {
      this.filter_anisotropic = ExtensionManager.enableExtension(
        context,
        'MOZ_EXT_texture_filter_anisotropic',
      );
    }
    if (!this.filter_anisotropic) {
      this.filter_anisotropic = ExtensionManager.enableExtension(
        context,
        'WEBKIT_EXT_texture_filter_anisotropic',
      );
    }
    if (this.filter_anisotropic) {
      this.maxAnisotropy = context.getParameter(
        this.filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT,
      );
      LogGL.log('MAX_TEXTURE_MAX_ANISOTROPY_EXT: ', this.maxAnisotropy);
    }

    this.frag_depth = ExtensionManager.enableExtension(context, 'EXT_frag_depth');
    this.depth_texture = ExtensionManager.enableExtension(context, 'WEBGL_depth_texture');

    this.element_index_uint = ExtensionManager.enableExtension(context, 'OES_element_index_uint');

    this.enableTextureCompression(context);
  }

  private static enableExtension(context: WebGLRenderingContext, name: string): any {
    const ext = context.getExtension(name);
    if (!ext) {
      LogGL.log('extension ' + name + ' is not supported');
    } else {
      LogGL.log('enabled extension ' + name);
    }
    return ext;
  }

  private enableTextureCompression(gl: WebGLRenderingContext) {
    const ct = ExtensionManager.enableExtension(gl, 'WEBGL_compressed_texture_s3tc');
    if (ct) {
      const formats: any = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
      if (formats.length > 0) {
        for (const i in formats) {
          if (formats[i] === ct.COMPRESSED_RGB_S3TC_DXT1_EXT) {
            LogGL.log('support found for texture compression: RGB_S3TC_DXT1');
          }
          if (formats[i] === ct.COMPRESSED_RGBA_S3TC_DXT1_EXT) {
            LogGL.log('support found for texture compression: RGBA_S3TC_DXT1');
          }
          if (formats[i] === ct.COMPRESSED_RGBA_S3TC_DXT3_EXT) {
            LogGL.log('support found for texture compression: RGBA_S3TC_DXT3');
          }
          if (formats[i] === ct.COMPRESSED_RGBA_S3TC_DXT5_EXT) {
            LogGL.log('support found for texture compression: RGBA_S3TC_DXT5');
          }
          // LogGL.log("support found for texture compression: ", formats[i]);
        }
      } else {
        LogGL.log('no support found for texture compression ');
      }
    }
  }

  public getMinMaxSupported(): boolean {
    return this.blend_minmax !== null;
  }
}

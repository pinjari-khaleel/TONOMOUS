import Texture3D from './Texture3D';
import RendererWebGL2 from '../render/RendererWebGL2';
import IRenderTexture from './IRenderTexture';
import LogGL from '../core/LogGL';

export default class RenderTexture3D extends Texture3D implements IRenderTexture {
  public scaleToCanvas: boolean = false;
  public sizeMultiplier: number = 1;

  public frameBuffer: WebGLFramebuffer;
  public frameBufferComplete: boolean = false;

  constructor(
    renderer: RendererWebGL2,
    width: number = 1,
    height: number = 1,
    depth: number = 1,
    format: number,
    useMips: boolean = false,
    filterLinear: boolean = true,
    clampToEdge: boolean = true,
  ) {
    super(renderer, width, height, depth, format, useMips, filterLinear, clampToEdge);

    let gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;

    this.frameBuffer = <WebGLBuffer>gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this.textureGL, 0, 0);

    this.frameBufferComplete = this.testBuffer();
  }

  protected testBuffer(): boolean {
    const gl = this.renderer.context;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

    switch (status) {
      case gl.FRAMEBUFFER_COMPLETE:
        return true;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        LogGL.error('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT', this.format);
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        LogGL.error(
          'Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
          this.format,
        );
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        LogGL.error('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS', this.format);
        return false;
      case gl.FRAMEBUFFER_UNSUPPORTED:
        LogGL.error('Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED', this.format);
        return false;
      default:
        LogGL.error('Incomplete framebuffer: ' + status, this.format);
        return false;
    }
  }

  public setSlice(sliceIndex: number, mipLevel: number = 0) {
    // TODO: not like this!!!
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTextureLayer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      this.textureGL,
      mipLevel,
      sliceIndex,
    );
  }

  // or extend and make sure base-class does not create an attachment texture
  public setTexture3DSlice(texture3d: Texture3D, sliceIndex: number, mipLevel: number = 0) {
    // TODO: not like this!!!
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTextureLayer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      texture3d.textureGL,
      mipLevel,
      sliceIndex,
    );
  }

  public setAsTarget(): void {
    const gl = this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    this.renderer.renderState.setDepthMask(false);

    this.mipsDirty = true;
  }

  public hasDepth(): boolean {
    return false;
  }
}

import Renderer from '../render/Renderer';
import GL from '../base/GL';
import DepthTexture from './DepthTexture';
import Texture3D from './Texture3D';
import IRenderTexture from './IRenderTexture';
import Texture2D from './Texture2D';
import TextureFormat from './TextureFormat';

export default class RenderTexture extends Texture2D implements IRenderTexture {
  public frameBuffer: WebGLFramebuffer | null = null;
  //used in webgl2 for multisample render textures
  public renderBuffer: WebGLRenderbuffer | null = null;
  public colorFramebuffer: WebGLFramebuffer | null = null;
  public scaleToCanvas: boolean = false;
  public sizeMultiplier: number = 1.0;
  public depthBuffer: WebGLRenderbuffer | undefined;
  public stencilBuffer: WebGLRenderbuffer | undefined;
  public depthStencilBuffer: WebGLRenderbuffer | undefined;
  public depthTexture: DepthTexture | undefined;
  public frameBufferComplete: boolean = false;
  //webgl2 only
  private _antiAlias: boolean = false;
  private readonly aaSamples: number = 4;

  constructor(
    renderer: Renderer,
    width: number = 1,
    height: number = 1,
    type: string = TextureFormat.RGBA_UNSIGNED_BYTE,
    mips: boolean = false,
    filterLinear: boolean = false,
    clampToEdge: boolean = true,
    useDepth: boolean = false,
    useStencil: boolean = false,
    aa: boolean = false,
  ) {
    // currently rendering to single channel textures is not possible (opengl es)
    // super(renderer, width, height, type, false, filterLinear, clampToEdge);
    //  (window['isiOS'] && type == TextureFormat.RGBA_FLOAT) ? TextureFormat.RGBA_HALF_FLOAT : (window['isiOS'] && type ==
    // TextureFormat.RGB_FLOAT) ? TextureFormat.RGB_HALF_FLOAT : type,
    super(renderer, type, mips, filterLinear, clampToEdge);

    this.setSize(width, height);

    const gl = this.renderer.context;

    this.frameBuffer = <WebGLFramebuffer>gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureGL, 0);

    if (aa && this.renderer.isWebgl2) {
      this._antiAlias = true;
      this.addMultisampleRenderBuffer();
    }

    if (useDepth && useStencil) {
      this.depthStencilBuffer = this.createDepthStencilBuffer(width, height);
    } else if (useDepth) {
      this.depthBuffer = this.createDepthBuffer(width, height);
    } else if (useStencil) {
      this.stencilBuffer = this.createStencilBuffer(width, height);
    }

    this.frameBufferComplete = this.testBuffer();

    // this breaks some examples
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  //don't forget to call resolveMultisampleBuffer after drawing to a multisampled framebuffer
  private addMultisampleRenderBuffer() {
    if (this.renderer.isWebgl2) {
      const gl = <WebGL2RenderingContext>this.renderer.context;

      this.colorFramebuffer = gl.createFramebuffer();

      this.renderBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        this.aaSamples,
        this._internalFormat,
        this.width,
        this.height,
      );
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.RENDERBUFFER,
        this.renderBuffer,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.colorFramebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.textureGL,
        0,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  public resolveMultisampleBuffer() {
    if (this.renderer.isWebgl2) {
      if (this.renderBuffer) {
        const gl = <WebGL2RenderingContext>this.renderer.context;

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.colorFramebuffer);
        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
        gl.blitFramebuffer(
          0,
          0,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height,
          gl.COLOR_BUFFER_BIT,
          gl.NEAREST,
        );
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
    }
  }

  protected testBuffer(): boolean {
    const gl = this.renderer.context;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    switch (status) {
      case gl.FRAMEBUFFER_COMPLETE:
        return true;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        console.log('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT', this.formatType);
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        console.log(
          'Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
          this.formatType,
        );
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        console.log('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS', this.formatType);
        return false;
      case gl.FRAMEBUFFER_UNSUPPORTED:
        console.log('Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED', this.formatType);
        return false;
      default:
        console.log('Incomplete framebuffer: ' + status, this.formatType);
        return false;
    }
  }

  // TODO: consider making a renderTexture3D class (although it is not really 3d)
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

  public addDepthTexture(): void {
    if (this.renderer.extensionManager.depth_texture) {
      this.setDepthTexture(new DepthTexture(this.renderer, this.width, this.height));
    } else {
      console.log('addDepthTexture: extension not supported');
    }
  }

  public setDepthTexture(texture: DepthTexture): void {
    texture.setSize(this.width, this.height);

    this.depthTexture = texture;
    const gl = this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture.textureGL,
      0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private initDepthBuffer(depthBuffer: WebGLRenderbuffer, width: number, height: number) {
    const gl = this.renderer.context;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

    if (this._antiAlias && this.renderer.isWebgl2) {
      const gl2 = <WebGL2RenderingContext>this.renderer.context;
      gl2.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        this.aaSamples,
        gl.DEPTH_COMPONENT16,
        width,
        height,
      );
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    }
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
  }

  private initStencilBuffer(buffer: WebGLRenderbuffer, width: number, height: number) {
    const gl = this.renderer.context;
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    if (this._antiAlias && this.renderer.isWebgl2) {
      const gl2 = <WebGL2RenderingContext>this.renderer.context;
      gl2.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        this.aaSamples,
        gl2.STENCIL_INDEX8,
        width,
        height,
      );
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
    }
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
  }

  private initDepthStencilBuffer(buffer: WebGLRenderbuffer, width: number, height: number) {
    const gl = this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    if (this._antiAlias && this.renderer.isWebgl2) {
      const gl2 = <WebGL2RenderingContext>this.renderer.context;
      gl2.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        this.aaSamples,
        gl2.DEPTH24_STENCIL8,
        width,
        height,
      );
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
  }

  private createDepthBuffer(width: number, height: number): WebGLRenderbuffer {
    const gl = this.renderer.context;
    const buffer = <WebGLRenderbuffer>gl.createRenderbuffer();

    this.initDepthBuffer(buffer, width, height);

    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, buffer);
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
    return buffer;
  }

  private createDepthStencilBuffer(width: number, height: number): WebGLRenderbuffer {
    const gl = this.renderer.context;
    const buffer = <WebGLRenderbuffer>gl.createRenderbuffer();

    this.initDepthStencilBuffer(buffer, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_STENCIL_ATTACHMENT,
      gl.RENDERBUFFER,
      buffer,
    );
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
    return buffer;
  }

  private createStencilBuffer(width: number, height: number): WebGLRenderbuffer {
    const gl = this.renderer.context;
    const buffer = <WebGLRenderbuffer>gl.createRenderbuffer();
    this.initStencilBuffer(buffer, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    //gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, buffer);
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
    return buffer;
  }

  public setAsTarget(): void {
    const gl = this.renderer.context;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

    if (this.hasDepth()) {
      this.renderer.renderState.setDepthMask(true);
    } else {
      this.renderer.renderState.setDepthMask(false);
    }

    this.mipsDirty = true;
  }

  public hasDepth(): boolean {
    return this.depthBuffer != null || this.depthTexture != null || this.depthStencilBuffer != null;
  }

  public setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) {
      return;
    }

    if (this.depthStencilBuffer) {
      this.initDepthStencilBuffer(this.depthStencilBuffer, width, height);
    }

    if (this.depthBuffer) {
      this.initDepthBuffer(this.depthBuffer, width, height);
    }

    if (this.stencilBuffer) {
      this.initStencilBuffer(this.stencilBuffer, width, height);
    }

    if (this.renderBuffer) {
      const gl = <WebGL2RenderingContext>this.renderer.context;

      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        this.aaSamples,
        this._internalFormat,
        width,
        height,
      );
      gl.bindRenderbuffer(GL.RENDERBUFFER, null);
    }

    if (this.depthTexture) {
      this.depthTexture.setSize(width, height);
    }

    super.setSize(width, height);
  }

  public getData(framebuffer: WebGLFramebuffer | null = null) {
    return super.getData(this.frameBuffer);
  }

  public getDataRef(data: any): void {
    const gl: WebGLRenderingContext = this.renderer.context;
    gl.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);
    gl.readPixels(0, 0, this.width, this.height, this.format, this.type, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public getPixelU8(x: number, y: number): Uint8Array {
    const gl: WebGLRenderingContext = this.renderer.context;
    gl.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);

    const data = new Uint8Array(4);

    gl.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return data;
  }

  public getPixel(x: number, y: number): any {
    const gl: WebGLRenderingContext = this.renderer.context;
    gl.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);

    let data;

    switch (this.formatType) {
      case TextureFormat.RGBA_FLOAT:
        data = new Float32Array(4);
        break;
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        data = new Uint8Array(4);
        break;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        data = new Uint8Array(1);
        break;
      case TextureFormat.LUMINANCE_FLOAT:
        data = new Float32Array(1);
        break;
      default:
        throw new Error('Can not yet get data for format type: ' + this.formatType);
    }

    gl.readPixels(x, y, 1, 1, this.format, this.type, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return data;
  }

  destruct() {
    const gl: WebGLRenderingContext = this.renderer.context;

    if (this.frameBuffer) {
      gl.deleteFramebuffer(this.frameBuffer);
      this.frameBuffer = null;
    }

    if (this.colorFramebuffer) {
      gl.deleteFramebuffer(this.colorFramebuffer);
      this.colorFramebuffer = null;
    }

    if (this.depthStencilBuffer) {
      gl.deleteRenderbuffer(this.depthStencilBuffer);
      delete this.depthStencilBuffer;
    }

    if (this.depthBuffer) {
      gl.deleteRenderbuffer(this.depthBuffer);
      delete this.depthBuffer;
    }

    if (this.stencilBuffer) {
      gl.deleteRenderbuffer(this.stencilBuffer);
      delete this.stencilBuffer;
    }

    if (this.renderBuffer) {
      gl.deleteRenderbuffer(this.renderBuffer);
      this.renderBuffer = null;
    }

    if (this.depthTexture) {
      this.depthTexture.destruct();
      delete this.depthTexture;
    }

    // always call this last
    super.destruct();
  }
}

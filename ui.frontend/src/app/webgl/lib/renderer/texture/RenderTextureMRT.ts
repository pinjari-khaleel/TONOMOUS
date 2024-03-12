import Renderer from '../render/Renderer';
import RenderTexture from './RenderTexture';
import Texture2D from './Texture2D';
import TextureFormat from './TextureFormat';
import LogGL from '../core/LogGL';

export default class RenderTextureMRT extends RenderTexture {
  public colorAttachments: Texture2D[] = [];

  private isFilterLinear: boolean;
  private isWrapClamp: boolean;

  constructor(
    renderer: Renderer,
    width: number = 1,
    height: number = 1,
    type: string = TextureFormat.RGBA_UNSIGNED_BYTE,
    mips: boolean = false,
    filterLinear: boolean = false,
    wrapClamp: boolean = true,
    useDepth: boolean = false,
    antialias: boolean = false,
    nrColorAttachments: number = 1,
  ) {
    super(renderer, width, height, type, mips, filterLinear, wrapClamp, useDepth, false, antialias);

    this.isFilterLinear = filterLinear;
    this.isWrapClamp = wrapClamp;

    this.colorAttachments.push(this);

    if (nrColorAttachments > 1) {
      // create new textures
      for (let i: number = 1; i < nrColorAttachments; ++i) {
        this.addColorAttachment();
      }
    }
    this.setSize(width, height);

    this.testBuffer();
  }

  public addColorAttachment(type: string = TextureFormat.RGBA_UNSIGNED_BYTE): void {
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;

    const attachment: Texture2D = new Texture2D(
      this.renderer,
      type,
      this.useMips,
      this.isFilterLinear,
      this.isWrapClamp,
    );
    attachment.setSize(this.width, this.height);
    this.colorAttachments.push(attachment);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + this.colorAttachments.length - 1,
      gl.TEXTURE_2D,
      attachment.textureGL,
      0,
    );

    // update enabled draw buffers for this framebuffer
    const attachments: number[] = [];
    for (let i: number = 0; i < this.colorAttachments.length; ++i) {
      attachments.push(gl.COLOR_ATTACHMENT0 + i);
    }
    gl.drawBuffers(attachments);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // custom texture size logic: we also want to resize all color
  // attachments other than the primary color attachment.
  public setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) {
      return;
    }
    LogGL.log('resize:MRT', this.colorAttachments);
    super.setSize(width, height);

    //can come from RenderTexture constructor
    if (this.colorAttachments) {
      for (const t of this.colorAttachments) {
        t.setSize(width, height);
      }
    }
  }

  destruct() {
    for (const t of this.colorAttachments) {
      t.destruct();
    }
    this.colorAttachments = [];

    super.destruct();
  }
}

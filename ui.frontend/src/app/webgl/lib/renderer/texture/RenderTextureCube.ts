import Vector3 from '../math/Vector3';
import Renderer from '../render/Renderer';
import TextureCube from './TextureCube';
import GL from '../base/GL';
import Transform from '../core/Transform';
import TextureFormat from './TextureFormat';
import LogGL from '../core/LogGL';
import Camera from '../camera/Camera';

export default class RenderTextureCube extends TextureCube {
  public pivot: Transform;
  public cameras: Camera[];
  private isDirty: boolean = true;
  public readonly framebuffer: WebGLFramebuffer;
  private depthBuffer: WebGLRenderbuffer | undefined;
  public readonly resolution: number;
  private offset = 0;
  private yAngle = 0;

  private readonly angles = [
    new Vector3(0, 3 + this.offset, 2.0),
    new Vector3(0, 1 + this.offset, 2),
    new Vector3(1, 2 + this.yAngle + this.offset, 2),
    new Vector3(-1, 2 + this.yAngle + this.offset, 2),
    new Vector3(2, 0 + this.offset, 0),
    new Vector3(2, 2 + this.offset, 0),
  ];

  constructor(
    renderer: Renderer,
    res: number = 256,
    useDepth: boolean = true,
    formatType: string = TextureFormat.RGBA_UNSIGNED_BYTE,
  ) {
    super(renderer, formatType, false);

    this.resolution = res;
    this.pivot = new Transform();
    this.cameras = [];
    for (let side = 0; side < 6; side++) {
      this.cameras[side] = new Camera(Math.PI / 2, 0.01, 100);
      this.cameras[side].projection.aspectRatio = 1;
      this.cameras[side].view.transform.setParent(this.pivot);

      // degrees
      this.angles[side].multiplyScalar(Math.PI / 2);
    }

    this.initTextures(res);

    const gl = this.renderer.context;
    this.framebuffer = <WebGLBuffer>gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      GL.FRAMEBUFFER,
      GL.COLOR_ATTACHMENT0,
      GL.TEXTURE_CUBE_MAP_POSITIVE_X + 0,
      this.textureGL,
      0,
    );

    if (useDepth) {
      this.depthBuffer = this.createDepthBuffer(res, res);
      LogGL.log('_depthBuffer', this.depthBuffer);
    }

    this.testBuffer();
  }

  protected testBuffer(): boolean {
    const gl = this.renderer.context;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

    switch (status) {
      case gl.FRAMEBUFFER_COMPLETE:
        return true;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        LogGL.error('RenderTextureCube: Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        LogGL.error(
          'RenderTextureCube: Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
        );
        return false;
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        LogGL.error('RenderTextureCube: Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
        return false;
      case gl.FRAMEBUFFER_UNSUPPORTED:
        LogGL.error('RenderTextureCube: Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED');
        return false;
      default:
        LogGL.error('RenderTextureCube: Incomplete framebuffer: ' + status);
        return false;
    }
  }

  private createDepthBuffer(width: number, height: number): WebGLRenderbuffer {
    const gl = this.renderer.context;
    const depthBuffer = <WebGLBuffer>gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    return depthBuffer;
  }

  private updateViews(): void {
    for (let side = 0; side < 6; side++) {
      this.cameras[side].view.transform.euler = this.angles[side];
    }
    this.isDirty = false;
  }

  public setPosition(pos: Vector3): void {
    this.pivot.position = pos;
    this.isDirty = true;
  }

  public setPositionValues(x: number, y: number, z: number): void {
    this.pivot.setPositionValues(x, y, z);
    this.isDirty = true;
  }

  public renderToTexture(renderScene: (camera: Camera, side?: number) => any) {
    if (this.isDirty) {
      this.updateViews();
    }
    const gl = this.renderer.context;

    this.renderer.setSize(this.resolution, this.resolution);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    if (this.depthBuffer) {
      this.renderer.renderState.setDepthMask(true);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        this.depthBuffer,
      );
    }

    for (let side = 0; side < 6; side++) {
      gl.framebufferTexture2D(
        GL.FRAMEBUFFER,
        GL.COLOR_ATTACHMENT0,
        GL.TEXTURE_CUBE_MAP_POSITIVE_X + side,
        this.textureGL,
        0,
      );
      gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

      renderScene(this.cameras[side], side);
    }

    this.renderer.unsetRenderTarget(true);

    this.mipsDirty = true;
  }
}

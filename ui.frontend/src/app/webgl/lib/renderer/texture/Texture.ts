import Renderer from '../render/Renderer';
import GL from 'mediamonks-webgl/renderer/base/GL';
import GL2 from 'mediamonks-webgl/renderer/base/GL2';
import IWebGLDestructible from '../core/IWebGLDestructible';

export default class Texture implements IWebGLDestructible {
  public name = '';
  public readonly textureGL: WebGLTexture;
  public readonly target: number;
  public renderer: Renderer;

  public unpackAlignment: number = 4;
  public flipY: boolean = false;
  public autoGenerateMips: boolean = true;

  public dirty: boolean = true;
  public mipsDirty: boolean = false;

  public isDestructed: boolean = false;

  protected _format: number = -1;
  protected _type: number = -1;
  protected _formatType: string = '';
  // for webgl 2
  protected _internalFormat = -1;

  private _useMips: boolean = false;
  private _minFilterLinear: boolean = true;
  private _magFilterLinear: boolean = true;
  private _clampS: boolean = true;
  private _clampT: boolean = true;
  private _clampR: boolean | null = null;
  private _anisotropy: number = -1;

  constructor(
    renderer: Renderer,
    target: number = GL.TEXTURE_2D,
    useMips: boolean = false,
    filterLinear: boolean = true,
    clampToEdge: boolean = true,
  ) {
    this.renderer = renderer;
    this.renderer.textureCount++;
    this.target = target;
    this.textureGL = <WebGLTexture>this.renderer.context.createTexture();
    this.useMips = useMips;
    this.filterLinear = filterLinear;
    this.clampToEdge = clampToEdge;
  }

  public bindToSlot(value: number = 0): void {
    this.renderer.renderState.bindTextureToSlot(this, value);
    if (this.dirty || this.mipsDirty) {
      // make sure the slot of this texture is active
      this.renderer.renderState.activateSlot(value);
      if (this.useMips && this.mipsDirty && this.autoGenerateMips) {
        this.generateMips();
      }
      if (this.dirty) {
        this.updateTexParameters();
      }
      this.mipsDirty = false;
      this.dirty = false;
    }
  }

  public bind(): void {
    this.renderer.renderState.activateSlot(this.renderer.maxParams.MAX_TEXTURE_IMAGE_UNITS - 1);
    this.renderer.context.bindTexture(this.target, this.textureGL);
    if (this.dirty) {
      this.updateTexParameters();
      this.dirty = false;
    }
  }

  public setSize(width: number, height?: number, depth?: number): void {
    // override
  }

  public get format(): number {
    return this._format;
  }

  public get type(): number {
    return this._type;
  }

  public get formatType(): string {
    return this._formatType;
  }

  public get internalFormat(): number {
    return this._internalFormat;
  }

  public get useMips(): boolean {
    return this._useMips;
  }

  public set useMips(useMips: boolean) {
    this._useMips = useMips;
    this.dirty = true;
  }

  public set filterNearest(isNearest: boolean) {
    this.filterLinear = !isNearest;
  }

  public set filterLinear(isLinear: boolean) {
    this._minFilterLinear = isLinear;
    this._magFilterLinear = isLinear;
    this.dirty = true;
  }

  public set minFilterLinear(isLinear: boolean) {
    this._minFilterLinear = isLinear;
    this.dirty = true;
  }

  public set magFilterLinear(isLinear: boolean) {
    this._magFilterLinear = isLinear;
    this.dirty = true;
  }

  public set anisotropy(amount: number) {
    this.filterLinear = true;
    this._anisotropy = amount;
    this.dirty = true;
  }

  public set clampToEdge(value: boolean) {
    this._clampS = value;
    this._clampT = value;
    if (this.target === GL2.TEXTURE_3D) {
      this._clampR = value;
    }
    this.dirty = true;
  }

  public set clampS(value: boolean) {
    // horizontal
    this._clampS = value;
    this.dirty = true;
  }

  public set clampT(value: boolean) {
    // vertical
    this._clampT = value;
    this.dirty = true;
  }

  public set clampR(value: boolean) {
    // vertical
    this._clampR = value;
    this.dirty = true;
  }

  private updateTexParameters() {
    // called from bindToSlot: texture is already bind
    const gl: WebGLRenderingContext = this.renderer.context;

    gl.texParameteri(
      this.target,
      GL.TEXTURE_MAG_FILTER,
      this._magFilterLinear ? GL.LINEAR : GL.NEAREST,
    );
    gl.texParameteri(
      this.target,
      GL.TEXTURE_MIN_FILTER,
      this.useMips && !this.mipsDirty
        ? this._minFilterLinear
          ? GL.LINEAR_MIPMAP_LINEAR
          : GL.NEAREST_MIPMAP_LINEAR
        : this._minFilterLinear
        ? GL.LINEAR
        : GL.NEAREST,
    );

    gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, this._clampS ? GL.CLAMP_TO_EDGE : GL.REPEAT);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, this._clampT ? GL.CLAMP_TO_EDGE : GL.REPEAT);
    if (this._clampR !== null) {
      gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, this._clampR ? GL.CLAMP_TO_EDGE : GL.REPEAT);
    }

    if (this._anisotropy > 1 && this.renderer.extensionManager.filter_anisotropic) {
      this._anisotropy = Math.min(this.renderer.extensionManager.maxAnisotropy, this._anisotropy);
      gl.texParameterf(
        this.target,
        this.renderer.extensionManager.filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,
        this._anisotropy,
      );
    }
  }

  protected generateMipsIfNeeded(): void {
    if (this.useMips && this.autoGenerateMips && this.mipsDirty) {
      this.generateMips();
    }
  }

  public generateMips(): void {
    // bind texture first!
    this.renderer.context.generateMipmap(this.target);
    this.mipsDirty = false;
  }

  destruct() {
    if (this.textureGL) {
      this.renderer.context.deleteTexture(this.textureGL);
    }
    this.isDestructed = true;
  }
}

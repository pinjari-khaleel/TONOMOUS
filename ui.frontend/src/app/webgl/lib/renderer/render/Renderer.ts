import MaxParams from './MaxParams';
import Color from 'mediamonks-webgl/renderer/math/Color';
import RenderState from './RenderState';
import ExtensionManager from './ExtensionManager';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import RequireContextIndex from 'mediamonks-webgl/utils/assets/RequireContextIndex';
import Texture from '../texture/Texture';
import Material from '../material/Material';
import Mesh from '../mesh/Mesh';
import GL from '../base/GL';
import Vector2 from '../math/Vector2';
import Utils from '../core/Utils';
import IRenderTexture from '../texture/IRenderTexture';
import MouseListener from '../input/MouseListener';
import IWebGLDestructible from '../core/IWebGLDestructible';
import Shader from '../material/Shader';

export default class Renderer implements IWebGLDestructible {
  private static staticId: number = 0;
  public static webgl2ContextNames: string[] = ['webgl2'];
  public static webgl1ContextNames: string[] = ['webgl', 'experimental-webgl'];

  public id: number;
  public context: WebGLRenderingContext | WebGL2RenderingContext;
  public maxParams: MaxParams;

  public renderState: RenderState;
  public readonly extensionManager: ExtensionManager;
  public static staticExtensionManager: ExtensionManager;
  public textureCount = 0;
  public readonly isWebgl2: boolean = false;
  public shaderIndex: RequireContextIndex<string>;
  public readonly canvas: HTMLCanvasElement;

  public readonly antialias: boolean;
  public readonly transparent: boolean;
  public readonly autoClear: boolean;
  public readonly stencil: boolean;
  public readonly premultipliedAlpha: boolean;

  protected _clearColor: Color = new Color(0.5, 0.5, 0.5, 1);
  protected _size = new Vector2();
  protected _mouseListener: MouseListener | undefined;

  private copyTextureMaterial: Material;
  private blitMesh: Mesh;
  private _renderTarget: IRenderTexture | null = null;

  constructor(
    preloader: WebGLPreLoader,
    canvas: HTMLCanvasElement,
    contexts: string[],
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
    xrCompatible: boolean = false,
  ) {
    this.id = Renderer.staticId++;

    this.antialias = antialias;
    this.transparent = transparent;
    this.autoClear = autoClear;
    this.stencil = stencil;
    this.premultipliedAlpha = premultipliedAlpha;

    if (!shaderIndexOrContext) {
      this.shaderIndex = new RequireContextIndex<string>();
    } else if (typeof shaderIndexOrContext === 'function') {
      this.shaderIndex = new RequireContextIndex<string>();
      this.shaderIndex.addContext(<__WebpackModuleApi.RequireContext>shaderIndexOrContext);
    } else {
      this.shaderIndex = <RequireContextIndex<string>>shaderIndexOrContext;
    }

    this.canvas = canvas;
    this.canvas.addEventListener('resize', () => this.handleCanvasResize());

    if (contexts === Renderer.webgl2ContextNames) {
      this.isWebgl2 = true;
    } else {
      if (!transparent) {
        if (!this.getAlphaIsCorrect()) {
          // on some macs, in chrome, when alpha is false, alpha is set to 63 and the canvas is alpha blended
          // with white this counters the issue
          transparent = true;
        }
      }
    }

    // preserveDrawingBuffer should be false
    const attributes = {
      alpha: transparent,
      stencil: stencil,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: !autoClear,
      premultipliedAlpha: premultipliedAlpha,
      antialias: antialias,
      xrCompatible: xrCompatible,
    };

    contexts.forEach((context) => {
      this.context = this.context || <any>this.canvas.getContext(context, attributes);
    });

    // @ts-ignore
    if (!this.context) {
      throw new Error('could not get a 3d context: aborting');
    }

    this.maxParams = new MaxParams(this.context);

    this.renderState = new RenderState(this);
    Renderer.staticExtensionManager = this.extensionManager = new ExtensionManager();
    this.extensionManager.enableExtensions(this.context);

    const defaultShader = new Shader(this);
    defaultShader.init(
      'default',
      `attribute vec3 aPos;attribute vec2 aUV0;varying vec2 vUV;void main(void) {vUV = aUV0;gl_Position = vec4(aPos, 1.0);}`,
      `precision mediump float;varying vec2 vUV; uniform sampler2D uTexture; void main(void) { gl_FragColor = texture2D(uTexture, vUV); }`,
    );

    this.copyTextureMaterial = new Material(this, 'default', defaultShader);
    this.copyTextureMaterial.depthTest = false;
    this.copyTextureMaterial.depthWrite = false;

    // this.copyTextureMaterial.setAlphaBlending();

    this.blitMesh = this.createTriangle();
  }

  private getAlphaIsCorrect(): boolean {
    const canvas3D = document.createElement('canvas');
    canvas3D.width = 1;
    canvas3D.height = 1;
    const context3D = <WebGLRenderingContext>canvas3D.getContext('experimental-webgl', {
      alpha: false,
      preserveDrawingBuffer: false,
    });

    context3D.clearColor(1, 0, 0, 1);
    context3D.clear(context3D.COLOR_BUFFER_BIT | context3D.DEPTH_BUFFER_BIT);

    const canvas2D = document.createElement('canvas');
    const context2D = <CanvasRenderingContext2D>canvas2D.getContext('2d');
    context2D.drawImage(canvas3D, 0, 0);

    const imageData = context2D.getImageData(0, 0, 1, 1);
    const isCorrect = imageData.data[3] === 255;
    if (!isCorrect) {
      LogGL.log('alpha bug detected');
    }
    return isCorrect;
  }

  public init(): void {
    LogGL.log('renderer: textureCount', this.textureCount);
    this.unsetRenderTarget();
    this.handleCanvasResize();
  }

  // processes a shader string for per-renderer specifics.
  public preprocessShaderString(shader: string): string {
    return shader;
  }

  public draw(mesh: Mesh, material: Material, startIndex: number = 0, vertexCount: number = -1) {
    // implement in derived class
  }

  public startBatch(mesh: Mesh, material: Material): void {
    // implement in derived class
  }

  public drawElements(
    mesh: Mesh,
    material: Material,
    startIndex: number = 0,
    vertexCount: number = -1,
  ): void {
    // implement in derived class
  }

  public endBatch(): void {
    // implement in derived class
  }

  private createTriangle(): Mesh {
    const quad = new Mesh(this);

    const positionData: Float32Array = new Float32Array([-1, -1, 0, -1, 3, 0, 3, -1, 0]);
    quad.setPositions(positionData);

    const uvData: Float32Array = new Float32Array([0, 0, 0, 2, 2, 0]);
    quad.setUV0(uvData);

    const indices: Uint16Array = new Uint16Array([0, 2, 1]);
    quad.setIndices(indices);
    return quad;
  }

  public get mouseListener(): MouseListener {
    if (!this._mouseListener) {
      //pass document.body as the first argument to add the events to the body
      this._mouseListener = new MouseListener(document.body, this.canvas);
    }
    return this._mouseListener;
  }

  public get width(): number {
    return this._size.x;
  }

  public get height(): number {
    return this._size.y;
  }

  public get size(): Vector2 {
    return this._size;
  }

  public handleCanvasResize() {
    this.setSize(this.canvas.width, this.canvas.height);
  }

  public enablePointSprites(): void {
    this.context.enable(0x8642);
  }

  public blit(
    source: Texture | null = null,
    destination: IRenderTexture | null = null,
    material: Material | null = null,
    clear: boolean = false,
    unset: boolean = true,
  ) {
    const m: Material = material != null ? material : this.copyTextureMaterial;

    if (destination) {
      this.renderTarget = destination;
    }

    if (source) {
      m.setTexture('uTexture', source);
    }

    if (clear) {
      if (destination && destination.hasDepth()) {
        this.clear();
      } else {
        //no need to clear the depth buffer
        this.context.clear(GL.COLOR_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);
      }
    }

    this.draw(this.blitMesh, m);

    if (destination && unset) {
      //when rendering to subsequent RenderTextures, it is not needed to unset it in between
      this.unsetRenderTarget();
    }
    //this is done because the texture could be a renderTexture. The renderTexture could then not be used anymore since it is bound as a texture elsewhere
    if (source) m.unSetTexture('uTexture');
  }

  public set renderTarget(rt: IRenderTexture | null) {
    if (rt) {
      if (rt.scaleToCanvas) {
        rt.setSize(
          Math.round(this.canvas.width * rt.sizeMultiplier),
          Math.round(this.canvas.height * rt.sizeMultiplier),
        );
      }
      rt.setAsTarget();
      this.setSize(rt.width, rt.height);
      this._renderTarget = rt;
    } else {
      this.unsetRenderTarget();
    }
  }

  public unsetRenderTarget(forceUnset: boolean = false) {
    if (this._renderTarget || forceUnset) {
      const gl = this.context;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);

      // TODO: write this out (not needed when repeatedly rendering to texture)
      this.setSize(this.canvas.width, this.canvas.height);
    }
    this._renderTarget = null;
  }

  public get renderTarget(): IRenderTexture | null {
    return this._renderTarget;
  }

  public clearWithColor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
    this.context.clearColor(r, g, b, a);
    this.context.depthMask(true);
    this.context.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);

    // restore to settings in render state
    this.context.depthMask(this.renderState.getDepthMask());
    this.context.clearColor(
      this._clearColor.r,
      this._clearColor.g,
      this._clearColor.b,
      this._clearColor.a,
    );
  }

  public clearRenderTexture(
    rt: IRenderTexture,
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0,
  ): void {
    this.renderTarget = rt;
    this.clearWithColor(r, g, b, a);
    this.unsetRenderTarget();
  }

  public get aspectRatio(): number {
    return this.width / this.height;
  }

  public clearDepth(): void {
    this.renderState.setDepthMask(true);
    this.context.clear(GL.DEPTH_BUFFER_BIT);
  }

  public set clearColor(color: Color) {
    this._clearColor.copy(color);
    this.context.clearColor(color.r, color.g, color.b, color.a);
  }

  public get clearColor(): Color {
    return this._clearColor;
  }

  public clear() {
    //need depthMask enabled to clear depth
    if (!this.renderState.getDepthMask()) this.context.depthMask(true);
    this.context.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);

    // restore to settings in render state if a change has been made
    if (!this.renderState.getDepthMask()) this.context.depthMask(this.renderState.getDepthMask());
  }

  public setSize(width: number, height: number): void {
    //floor
    width = width | 0;
    height = height | 0;

    if (this.width !== width || this.height !== height) {
      this._size.setValues(width, height);
      this.context.viewport(0, 0, this.width, this.height);
    }
  }

  public setScissor(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    updateViewport: boolean = false,
  ): void {
    startX = Utils.clamp01(startX);
    startY = Utils.clamp01(startY);
    endX = Utils.clamp01(endX);
    endY = Utils.clamp01(endY);

    const dx: number = endX - startX;
    const dy: number = endY - startY;
    const w = this.width;
    const h = this.height;

    this.context.enable(GL.SCISSOR_TEST);
    this.context.scissor((startX * w) | 0, (startY * h) | 0, (dx * w) | 0, (dy * h) | 0);

    if (updateViewport) {
      this.context.viewport((startX * w) | 0, (startY * h) | 0, (dx * w) | 0, (dy * h) | 0);
    }
  }

  // use pixel coords
  public setScissorPixels(startX: number, startY: number, endX: number, endY: number): void {
    this.context.enable(GL.SCISSOR_TEST);
    this.context.scissor(startX, startY, endX - startX, endY - startY);
  }

  public unsetScissor(): void {
    this.context.disable(GL.SCISSOR_TEST);
  }

  public setViewPort(startX: number, startY: number, width: number, height: number): void {
    this._size.setValues(width, height);
    this.context.viewport(startX, startY, this.width, this.height);
  }

  public unsetViewPort(): void {
    this._size.setValues(this.canvas.width, this.canvas.height);
    this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public setChannelMask(
    r: boolean = false,
    g: boolean = false,
    b: boolean = false,
    a: boolean = false,
  ): void {
    this.context.colorMask(r, g, b, a);
  }

  public clearChannelMask(): void {
    this.context.colorMask(true, true, true, true);
  }

  // stencil functionality is very limited: it will write 1 to a 0 buffer and does a compare against 1
  public setStencilEnabled(value: boolean): void {
    value ? this.context.enable(GL.STENCIL_TEST) : this.context.disable(GL.STENCIL_TEST);
  }

  public startDrawToStencil(): void {
    const gl = this.context;
    this.setStencilEnabled(true);
    gl.stencilFunc(GL.ALWAYS, 1, 0xff);
    gl.stencilOp(GL.KEEP, GL.KEEP, GL.REPLACE);
    gl.stencilMask(0xff);
  }

  public setStencilFuncEqual(value: boolean): void {
    this.context.stencilFunc(value ? GL.EQUAL : GL.NOTEQUAL, 1, 0xff);
  }

  public destructVAO(mesh: Mesh) {}

  destruct() {
    LogGL.log('Renderer: destruct');

    const gl: WebGLRenderingContext = this.context;

    const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    for (let unit = 0; unit < numTextureUnits; ++unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(null);

    const extension = gl.getExtension('WEBGL_lose_context');
    if (extension) {
      extension.loseContext();
    }

    if (this.blitMesh) {
      this.blitMesh.destruct();
    }
    if (this.copyTextureMaterial) {
      this.copyTextureMaterial.destruct();
    }

    this.canvas.removeEventListener('resize', this.handleCanvasResize);

    if (this._mouseListener) {
      this._mouseListener.destruct();
    }
  }
}

import Material from '../../renderer/material/Material';
import Shader from '../../renderer/material/Shader';
import Renderer from '../../renderer/render/Renderer';
import RenderTexture from '../../renderer/texture/RenderTexture';
import TextureFormat from '../../renderer/texture/TextureFormat';

export type FloatTextureFormat = 'RGBA_FLOAT' | 'RGB_FLOAT' | 'RGBA_HALF_FLOAT' | 'RGB_HALF_FLOAT';

export default class RenderTextureFormatTest {
  public RGBA_FLOAT: boolean = false;
  public RGB_FLOAT: boolean = false;
  public RGBA_HALF_FLOAT: boolean = false;
  public RGB_HALF_FLOAT: boolean = false;

  public floatSupported: boolean = false;

  private testMaterial: Material | undefined;
  private blitMaterial: Material | undefined;
  private renderer: Renderer;
  private readTexture: RenderTexture | undefined;
  private filterLinear: boolean;
  private blend: boolean;

  constructor(renderer: Renderer, linear: boolean, blend: boolean) {
    this.renderer = renderer;
    this.filterLinear = linear;
    this.blend = blend;

    const ext = renderer.extensionManager;
    if (ext.texture_float) {
      this.RGBA_FLOAT = this.test(TextureFormat.RGBA_FLOAT);
      this.RGB_FLOAT = this.test(TextureFormat.RGB_FLOAT);
    }
    if (ext.texture_half_float) {
      this.RGBA_HALF_FLOAT = this.test(TextureFormat.RGBA_HALF_FLOAT);
      this.RGB_HALF_FLOAT = this.test(TextureFormat.RGB_HALF_FLOAT);
    }
    this.floatSupported =
      this.RGBA_FLOAT || this.RGB_FLOAT || this.RGBA_HALF_FLOAT || this.RGB_HALF_FLOAT;
  }

  private test(formatType: string) {
    // Galaxy Nexus 7 ,Android 4.4.3 will fail with filtering and pass without
    const filtering = this.filterLinear;
    const rt = new RenderTexture(this.renderer, 1, 1, formatType, false, filtering);
    let result = rt.frameBufferComplete;
    if (result) {
      result = this.functionalTest(rt);
    }
    rt.destruct();
    return result;
  }

  private createRedMaterial(): Material {
    const shader = new Shader(this.renderer);
    const vs: string = this.getVS();
    const fs: string = this.getFS();
    shader.init('red', vs, fs, null);
    let material = new Material(this.renderer, 'red', shader);
    // blend = true in combination with rgba float did not work on Galaxy Nexus 7 ,Android 4.4.3
    if (this.blend) {
      material.setAdditiveBlending();
    }
    return material;
  }

  private createBlitMaterial(): Material {
    const shader = new Shader(this.renderer);
    const vs: string = this.getVS();
    const fs: string = this.getBlitFS();
    shader.init('red', vs, fs, null);
    const material = new Material(this.renderer, 'blit', shader);
    return material;
  }

  // blit red to a float texture, blit that to a uint8 texture and read it (reading directly from float might fail)
  private functionalTest(rt: RenderTexture): boolean {
    if (!this.testMaterial) {
      this.testMaterial = this.createRedMaterial();
    }
    if (!this.blitMaterial) {
      this.blitMaterial = this.createBlitMaterial();
    }
    if (!this.readTexture) {
      this.readTexture = new RenderTexture(this.renderer, 1, 1, TextureFormat.RGBA_UNSIGNED_BYTE);
    }
    this.renderer.blit(null, rt, this.testMaterial);
    this.renderer.blit(rt, this.readTexture, this.blitMaterial);
    // getData will fail on RGB_FLOAT
    const data: Uint8Array = this.readTexture.getUint8Data();
    const result = data[0] > 254;
    if (!result) {
      console.log('RenderTextureFormatTest failed on float texture', rt.formatType, data[0]);
    }
    return result;
  }

  private getVS(): string {
    return (
      'attribute vec3 aPos; \n attribute vec2 aUV0; \n varying vec2 vUV; \n void main(void) {\n vUV = aUV0;' +
      ' \n gl_Position =vec4(aPos, 1.0);\n }'
    );
  }

  private getFS(): string {
    return 'void main(void) { \n gl_FragColor = vec4(1,1,1,1);\n  }';
  }

  private getBlitFS(): string {
    return (
      'precision mediump float; \n varying vec2 vUV; \n uniform sampler2D uTexture;' +
      ' \n' +
      ' void main(void) { \n gl_FragColor = texture2D(uTexture, vUV);\n  }'
    );
  }
}

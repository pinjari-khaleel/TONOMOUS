import Renderer from '../renderer/render/Renderer';
import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import MaterialLoader from '../renderer/material/MaterialLoader';
import HDRTextureLoader from '../utils/loaders/HDRTextureLoader';
import RenderTexture from '../renderer/texture/RenderTexture';
import PbrPrecomputeSphericalToCubemap from './internal/PbrPrecomputeSphericalToCubemap';
import TextureCube from '../renderer/texture/TextureCube';
import Material from '../renderer/material/Material';
import Vector3 from '../renderer/math/Vector3';
import Vector2 from '../renderer/math/Vector2';
import Box from '../utils/mesh/Box';
import Mesh from '../renderer/mesh/Mesh';
import ImageUtils from '../utils/image/ImageUtils';
import TextureFormat from '../renderer/texture/TextureFormat';
import Camera from '../renderer/camera/Camera';
import Matrix3x3 from 'mediamonks-webgl/renderer/math/Matrix3x3';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import PbrPrecomputeUnityReflectionProbeToCubemap from 'mediamonks-webgl/pbr/internal/PbrPrecomputeUnityReflectionProbeToCubemap';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';
import Texture2D from '../renderer/texture/Texture2D';

export default class PbrPrecompute implements IWebGLDestructible {
  private _renderer: Renderer;

  private _brdfLutMaterial: MaterialLoader;

  private _backgroundCubeMaterial: MaterialLoader;
  private _specularCubeMaterial: MaterialLoader;
  private _diffuseCubeMaterial: MaterialLoader;

  private _backgroundCube: PbrPrecomputeSphericalToCubemap;
  private _backgroundReflectionProbe: PbrPrecomputeUnityReflectionProbeToCubemap;

  public saveToFile: boolean = false;
  private _resolution: number = 256; // 256 is enough if not used for environment cube but only for reflection
  private _backgroundCubeMapResolution: number = 1024;
  private _resolutionDiffuse: number = 64;

  private _captureFramebuffer: RenderTexture;
  private _cubeMesh: Mesh;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    this._renderer = renderer;

    this._brdfLutMaterial = new MaterialLoader(this._renderer, preloader, 'brdf');

    this._backgroundCubeMaterial = new MaterialLoader(
      this._renderer,
      preloader,
      'prefilter_cube_background',
    );
    this._specularCubeMaterial = new MaterialLoader(
      this._renderer,
      preloader,
      'prefilter_cube_specular',
    );
    this._diffuseCubeMaterial = new MaterialLoader(
      this._renderer,
      preloader,
      'prefilter_cube_diffuse',
    );

    this._backgroundCube = new PbrPrecomputeSphericalToCubemap(this._renderer, preloader);
    this._backgroundReflectionProbe = new PbrPrecomputeUnityReflectionProbeToCubemap(
      this._renderer,
      preloader,
    );
    this._captureFramebuffer = new RenderTexture(
      this._renderer,
      512,
      512,
      TextureFormat.RGBA_UNSIGNED_BYTE,
      false,
      false,
      true,
      true,
    );
    this._cubeMesh = new Box(renderer);

    console.error(
      'PBR Precompute class - only include this class to precompute an environment map',
    );
  }

  public precompute(background: HDRTextureLoader) {
    //   this.precomputeBRDFLUT(background);

    this.precomputeCubeMaps(background);
  }

  private precomputeBRDFLUT() {
    const captureWidth = 256;
    const captureBRDFLUT = new RenderTexture(
      this._renderer,
      captureWidth,
      captureWidth,
      TextureFormat.RGBA_UNSIGNED_BYTE,
      false,
      false,
    );
    this._renderer.blit(null, captureBRDFLUT, this._brdfLutMaterial);

    const pixels: Float32Array | Uint8Array = captureBRDFLUT.getData();
    if (pixels instanceof Uint8Array) {
      this.save(pixels, captureBRDFLUT.width, captureBRDFLUT.height, 'brdfLut.png');
    } else {
      console.warn('precomputeBRDFLUT: pixels should be of type: Uint8Array');
    }
  }

  public precomputeCubeMaps(background: Texture2D): Uint8Array[] {
    let outputDatas: Uint8Array[] = [];
    const environment: TextureCube =
      background.width === background.height * 6
        ? this._backgroundReflectionProbe.toCubemap(background, this._backgroundCubeMapResolution)
        : this._backgroundCube.toCubemap(background, this._backgroundCubeMapResolution);

    let size = this._resolution;

    const width = this._resolution;
    const height = width * 8;
    const nummipmaps = Math.floor(Math.log(width) / Math.log(2));
    const mipmapWithMaxRoughness = nummipmaps - 4;

    this._specularCubeMaterial.setFloat(
      '_MaxBackgroundLod',
      Math.floor(Math.log(this._backgroundCubeMapResolution) / Math.log(2)),
    );

    let data = new Uint8Array(width * height * 4);

    let mipmap = 0;
    let offset = 0;

    while (size >= 1) {
      this._specularCubeMaterial.setFloat(
        '_Roughness',
        Math.min(1, mipmap / mipmapWithMaxRoughness),
      );
      this.processCube(environment, this._specularCubeMaterial, size, size, mipmap, data, offset);

      offset += size * size * 4 * 6;

      size /= 2;
      mipmap++;
    }
    outputDatas.push(data);
    this.save(data, width, height, 'specular.png');
    let ldrSpecularData: Uint8Array = this.convertToLDR(data, width, height);
    outputDatas.push(ldrSpecularData);
    this.save(ldrSpecularData, width, height, 'ldr_specular.png');

    data = new Uint8Array(this._resolutionDiffuse * this._resolutionDiffuse * 4 * 6);
    this.processCube(
      environment,
      this._diffuseCubeMaterial,
      this._resolutionDiffuse,
      this._resolutionDiffuse,
      0,
      data,
      0,
    );
    outputDatas.push(data);
    this.save(data, this._resolutionDiffuse, this._resolutionDiffuse * 6, 'diffuse.png');
    let ldrDiffuse: Uint8Array = this.convertToLDR(
      data,
      this._resolutionDiffuse,
      this._resolutionDiffuse * 6,
    );
    outputDatas.push(ldrDiffuse);
    this.save(ldrDiffuse, this._resolutionDiffuse, this._resolutionDiffuse * 6, 'ldr_diffuse.png');

    // var data = new Uint8Array(width * width * 4 * 6);
    // this.processCube(environment, this._backgroundCubeMaterial, width, width, 0, data, 0);
    // this.save(data, width, width*6, "background.png");
    return outputDatas;
  }

  private convertToLDR(data: Uint8Array, width: number, height: number): Uint8Array {
    const byteData = new Uint8Array(width * height * 4);
    let offset = 0;
    for (let i = 0; i < data.byteLength; i += 4) {
      //                gl_FragColor = vec4(col.rgb * exp2( e* 255. - 128. ), 1.);
      const e = Math.pow(2, data[i + 3] - 128) / 255;
      const r = data[i + 0] * e;
      const g = data[i + 1] * e;
      const b = data[i + 2] * e;
      // vec3 ldr = pow(hdr*.125, vec3(1./4.));
      byteData[offset++] = Math.min(255, Math.pow(r * 0.125, 0.25) * 255);
      byteData[offset++] = Math.min(255, Math.pow(g * 0.125, 0.25) * 255);
      byteData[offset++] = Math.min(255, Math.pow(b * 0.125, 0.25) * 255);
      byteData[offset++] = 255;
    }
    return byteData;
  }

  private processCube(
    environment: TextureCube,
    material: Material,
    captureWidth: number,
    captureHeight: number,
    mipmap: number = 0,
    data: Uint8Array,
    offset: number,
  ): void {
    material.setCullingDisabled();
    material.depthWrite = false;
    material.blend = false;
    material.setTexture('_CubeSampler', environment);
    material.setFloat('_SourceDim', this._backgroundCubeMapResolution);

    const context: WebGLRenderingContext = this._renderer.context;

    const faces: number[] = [
      context.TEXTURE_CUBE_MAP_POSITIVE_X,
      context.TEXTURE_CUBE_MAP_NEGATIVE_X,
      context.TEXTURE_CUBE_MAP_POSITIVE_Y,
      context.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      context.TEXTURE_CUBE_MAP_POSITIVE_Z,
      context.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];
    const eulerAngles: Vector3[] = [
      new Vector3(0.0, 270.0, 180.0),
      new Vector3(0.0, 90.0, 180.0),
      new Vector3(90.0, 180.0, 180.0),
      new Vector3(-90.0, 180.0, 180.0),
      new Vector3(180.0, 0.0, 0.0),
      new Vector3(180.0, 180.0, 0.0),
    ];
    const cameras: Camera[] = [];
    for (let face: number = 0; face < 6; ++face) {
      cameras[face] = new Camera(Math.PI / 2, 0.01, 10.0);
      cameras[face].projection.aspectRatio = captureWidth / captureHeight;
      cameras[face].view.transform.euler = Utils.degToRadVec3(eulerAngles[face]);
    }

    this._captureFramebuffer.setSize(captureWidth, captureHeight);
    const originalRenderSize: Vector2 = this._renderer.size;
    this._renderer.setSize(captureWidth, captureHeight);

    for (let face: number = 0; face < 6; ++face) {
      const camera: Camera = cameras[face];

      this._renderer.renderTarget = this._captureFramebuffer;
      this._renderer.clear();
      const view = new Matrix3x3();
      Matrix3x3.fromMat4(view, camera.viewMatrix);
      material.setMatrix3x3('_View', view);
      material.setMatrix('_Projection', camera.projection.matrix);
      this._renderer.draw(this._cubeMesh, material);
      this._renderer.unsetRenderTarget();

      const pixels = this._captureFramebuffer.getData();
      if (pixels.length + offset <= data.length) {
        data.set(pixels, offset);
      }

      offset += pixels.length;
    }
    this._renderer.setSize(originalRenderSize.x, originalRenderSize.y);
  }

  private save(pixels: Uint8Array, width: number, height: number, fileName: string) {
    if (this.saveToFile) {
      const canvas: HTMLCanvasElement = ImageUtils.putToCanvas(pixels, width, height);
      this.saveFile(canvas.toDataURL(), fileName);
    } else {
      ImageUtils.dataToBrowserTab(pixels, width, height);
    }
  }

  private dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private saveFile(dataUrl: string, fileName: string) {
    var blob = this.dataURLtoBlob(dataUrl);
    var objurl = URL.createObjectURL(blob);

    if (fileName) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = objurl;
      a['download'] = fileName;
      a.click();
      console.log('saveMeshToBin', fileName);
    } else {
      if (top) {
        top.location.href = objurl;
      }
    }
  }

  public destruct(): void {}
}

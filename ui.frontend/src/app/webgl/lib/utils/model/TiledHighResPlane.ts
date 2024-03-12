// Class to render a (high res) image on a plane using a pyramid tiling system (similar to google maps).
// You can create the pyramid images using libvips:
//
// https://libvips.github.io/libvips/API/current/Making-image-pyramids.md.html
// .\vips.exe dzsave .\imagename.jpg directoryname --layout google --suffix .jpg[Q=90] --tile-size 512
//
// Usage:
// 1. Construct and place the plane. The plane will have the following dimension: (-aspectRatio, -1, 0) x (aspectRatio, 1, 0):
//     this.esfahan = new TiledHighResPlane(this.renderer, preloader, 4096, 4096, 512, s => esfahanAssets('.' + s + '.webp').default);
//     this.esfahan.transform.setPositionValues(0, 0, -2);
//
// - The 'width' and 'height' argument in the constructor are the dimensions of the original image.
// - getURLCallback is a method that returns the url of an image based on the image name.
// - You can add an extra argument to set the 'downloadmanager'. This way, multiple TiledHighResPlanes can share
//   the same downloadmanager and available texture pool (i.e. if you create a cubemap).
//
// 2. Update and draw the plane:
//     this.esfahan.update(this.cameraController);
//     this.esfahan.draw(this.cameraController, this.material);
//
// Note: you have to create a material to draw the tiles yourself. The most basic shaders to create such material looks like this:
// 1. Vertex shader:
//
// attribute vec3 aPos;
// attribute vec2 aUV0;
//
// uniform mat4 _ViewProjection;
// uniform mat4 _Model;
// uniform vec3 _LeftTop;
// uniform vec3 _BottomRight;
// uniform vec2 _UVScale;
//
// varying vec2 vUV;
//
// void main(void) {
//   vUV = aUV0 * _UVScale;
//   vec4 pos = _Model * vec4(mix(_LeftTop.x, _BottomRight.x, aUV0.x), mix(_LeftTop.y, _BottomRight.y, aUV0.y), 0, 1);
//   gl_Position = _ViewProjection * pos;
// }
//
// 2. Fragment shader:
//
// precision mediump float;
//
// uniform sampler2D _Texture;
// uniform float _Depth;
//
// varying vec2 vUV;
//
// void main(void) {
//   gl_FragColor = texture2D(_Texture, vUV);
// }

import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Plane from 'mediamonks-webgl/utils/mesh/Plane';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import TiledHighResPlaneTile from './tiledHighResPlane/TiledHighResPlaneTile';
import TiledHighResPlaneDownloadManager from './tiledHighResPlane/TiledHighResPlaneDownloadManager';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';

export default class TiledHighResPlane {
  public transform: Transform = new Transform();
  public width: number;
  public height: number;
  public tileSize: number;
  public baseSize: number;
  public renderer: Renderer;
  public maxPixelSize: number = Math.sqrt(2);

  public model: Transform = new Transform();

  private root: TiledHighResPlaneTile;
  private mesh: Mesh;

  private frame: number = 0;
  private getURLCallback: (filename: string) => string;
  private downloadManager: TiledHighResPlaneDownloadManager;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    width: number,
    height: number,
    tileSize: number = 512,
    getURLCallback: (filename: string) => string,
    manager: TiledHighResPlaneDownloadManager | null = null,
    plane: Mesh | null = null,
  ) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.getURLCallback = getURLCallback;

    if (manager) {
      this.downloadManager = manager;
    } else {
      this.downloadManager = new TiledHighResPlaneDownloadManager(renderer);
    }

    this.baseSize = Utils.nextPowerOfTwo(Math.max(width, height) / 512) * 512;
    const maxDepth = Math.log2(this.baseSize / 512);

    LogGL.log(`TileRenderer (dimensions: ${width}x${height}, tileSize: ${tileSize})`);
    LogGL.log(`- virtual size of base tile: ${this.baseSize}x${this.baseSize}`);
    LogGL.log(`- max depth: ${maxDepth}`);

    this.root = new TiledHighResPlaneTile(this, null, 0, 0, 0, maxDepth);
    this.downloadManager.addRoot(this.root);

    this.mesh = plane ? plane : new Plane(renderer);

    // always directly load texture for baseTile
    this.downloadManager.downloadTile(this.root);

    this.model.setScaleValues(2 / height, 2 / height, 1);
    this.model.setPositionValues(-width / height, -1, 0);
    this.model.setParent(this.transform);
  }

  public get tileDownloadManager(): TiledHighResPlaneDownloadManager {
    return this.downloadManager;
  }

  public getURLForTile(tile: TiledHighResPlaneTile) {
    return this.getURLCallback(`/${tile.depth}/${tile.tileY}/${tile.tileX}`);
  }

  public update(camera: Camera) {
    this.frame++;
    this.downloadManager.update(camera, this.frame);
  }

  public draw(camera: Camera, material: Material, topToBottom: boolean = true) {
    material.setMatrix('_ViewProjection', camera.viewProjection);
    material.setMatrix('_Model', this.model.worldMatrix);

    this.root.draw(this.frame, this.renderer, this.mesh, material, topToBottom);
  }
}

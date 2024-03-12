import TiledHighResPlaneTile from 'mediamonks-webgl/utils/model/tiledHighResPlane/TiledHighResPlaneTile';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Frustum from 'mediamonks-webgl/utils/camera/Frustum';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';

export default class TiledHighResPlaneDownloadManager {
  public MAX_SIM_DOWNLOADS: number = 2;
  public MAX_TEXTURE_UPDATES_PER_FRAME: number = 1;
  public TEXTURE_POOL: number = 32;

  private allTiles: TiledHighResPlaneTile[] = [];
  private rootTiles: TiledHighResPlaneTile[] = [];

  private frame: number = -1;

  private texturePool: Texture2D[] = [];
  private numDownloads: number = 0;
  private loadedTiles: { image: HTMLImageElement; tile: TiledHighResPlaneTile }[] = [];

  private frustum: Frustum = new Frustum();

  private static canvas: HTMLCanvasElement;
  private static context: CanvasRenderingContext2D;

  constructor(renderer: Renderer) {
    for (let i = 0; i < this.TEXTURE_POOL; i++) {
      this.texturePool.push(
        new Texture2D(renderer, TextureFormat.RGBA_UNSIGNED_BYTE, true, true, true),
      );
    }
  }

  public addRoot(root: TiledHighResPlaneTile) {
    this.rootTiles.push(root);
    this.allTiles.push(...root.allTiles());
  }

  public update(camera: Camera, frame: number) {
    if (this.frame === frame) {
      return;
    }

    this.frame = frame;

    this.frustum.updateForCamera(camera);

    this.rootTiles.forEach((root) =>
      root.update(this.frustum, camera, camera.view.transform.worldForward, this.frame),
    );

    // clear unused tiles if needed
    if (this.texturePool.length < this.MAX_TEXTURE_UPDATES_PER_FRAME) {
      const tilesUnused = this.allTiles
        .filter((a) => !a.visible(frame) && a.loaded(frame) && !a.aChildLoaded(frame))
        .sort((a, b) => b.lastFrameVisible - a.lastFrameVisible);
      for (let i = 0; i < Math.min(this.MAX_TEXTURE_UPDATES_PER_FRAME, tilesUnused.length); i++) {
        tilesUnused[i].clear(this.texturePool);
      }
    }

    // find all tiles that should want to be loaded
    const tilesToLoad = this.allTiles
      .filter((a) => a.lastFrameVisible === this.frame && !a.loading && a.texture === null)
      .sort((a, b) => a.downloadWeight(frame) - b.downloadWeight(frame));
    const tilesLoaded = this.loadedTiles
      .filter((a) => a.tile.lastFrameVisible === this.frame)
      .sort((a, b) => b.tile.downloadWeight(frame) - a.tile.downloadWeight(frame));

    // start downloads
    for (
      let i = 0, s = Math.min(this.MAX_SIM_DOWNLOADS - this.numDownloads, tilesToLoad.length);
      i < s;
      i++
    ) {
      const tile = tilesToLoad[i];
      this.downloadTile(tile);
    }

    if (tilesLoaded.length > 0) {
      // clear used tiles if needed
      if (this.texturePool.length < this.MAX_TEXTURE_UPDATES_PER_FRAME) {
        const tilesVisible = this.allTiles
          .filter((a) => a.loaded(frame) && !a.aChildLoaded(frame))
          .sort((a, b) => a.downloadWeight(frame) - b.downloadWeight(frame));
        for (
          let i = 0,
            s = Math.min(
              this.MAX_TEXTURE_UPDATES_PER_FRAME - this.texturePool.length,
              tilesVisible.length,
              tilesLoaded.length,
            );
          i < s;
          i++
        ) {
          const tile = tilesVisible[i];
          if (tile.downloadWeight > tilesLoaded[i].tile.downloadWeight) {
            tile.clear(this.texturePool);
          }
        }
      }

      // process loaded tiles
      for (
        let i = 0,
          s = Math.min(
            this.MAX_TEXTURE_UPDATES_PER_FRAME,
            this.texturePool.length,
            tilesLoaded.length,
          );
        i < s;
        i++
      ) {
        const data = <{ image: HTMLImageElement; tile: TiledHighResPlaneTile }>tilesLoaded.pop();
        if (data.tile.loading) {
          const texture = <Texture2D>this.texturePool.pop();
          data.tile.loading = false;
          data.tile.texture = texture;
          data.tile.texture.setImage(
            this.checkImage(data.image, data.tile.context.tileSize),
            false,
          );
        }
      }
    }

    this.loadedTiles = this.loadedTiles.filter((a) => a.tile.loading);
  }

  public downloadTile(tile: TiledHighResPlaneTile) {
    this.numDownloads++;
    tile.loading = true;

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      image.decode().then(() => {
        this.numDownloads--;
        this.loadedTiles.push({ image, tile });
      });
    };
    image.onerror = () => {
      this.numDownloads--;
      tile.clear(this.texturePool);
    };
    image.src = tile.context.getURLForTile(tile);
  }

  public checkImage(image: HTMLImageElement, size: number): HTMLCanvasElement | HTMLImageElement {
    if (image.width === size && image.height === size) {
      return image;
    }
    if (!TiledHighResPlaneDownloadManager.canvas) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      TiledHighResPlaneDownloadManager.canvas = canvas;
      TiledHighResPlaneDownloadManager.context = <CanvasRenderingContext2D>canvas.getContext('2d');
    }
    const context = TiledHighResPlaneDownloadManager.context;

    context.drawImage(image, 0, 0);

    return TiledHighResPlaneDownloadManager.canvas;
  }
}

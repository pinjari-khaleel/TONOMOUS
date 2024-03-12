import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Frustum from 'mediamonks-webgl/utils/camera/Frustum';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Material from 'mediamonks-webgl/renderer/material/Material';
import TiledHighResPlane from 'mediamonks-webgl/utils/model/TiledHighResPlane';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';

export default class TiledHighResPlaneTile {
  public texture: Texture2D | null = null;
  public loading: boolean = false;
  public lastFrameVisible: number = -1;

  public depth: number;
  public tileX: number;
  public tileY: number;

  private _allChildLoaded: boolean = false;
  private _aChildVisibleAndLoaded: boolean = false;
  private _weight: number = 1000;
  private _lastFrameInViewport: number = -1;

  public context: TiledHighResPlane;
  public children: TiledHighResPlaneTile[] = [];
  public parent: TiledHighResPlaneTile | null = null;

  public lt: Vector3;
  public rt: Vector3;
  public rb: Vector3;
  public lb: Vector3;

  public uvScale: Vector2 = new Vector2(1, 1);

  private childrenVisible: boolean = false;

  constructor(
    context: TiledHighResPlane,
    parent: TiledHighResPlaneTile | null,
    tileX: number,
    tileY: number,
    depth: number,
    maxDepth: number,
  ) {
    this.context = context;
    this.parent = parent;
    this.depth = depth;

    this.tileX = tileX;
    this.tileY = tileY;

    const tilesForDepth = 1 << depth;
    const scale = context.baseSize / tilesForDepth;

    this.lt = new Vector3(tileX * scale, Math.max(0, context.height - tileY * scale), 0);
    this.rt = new Vector3(
      Math.min(context.width, (tileX + 1) * scale),
      Math.max(0, context.height - tileY * scale),
      0,
    );
    this.rb = new Vector3(
      Math.min(context.width, (tileX + 1) * scale),
      Math.max(0, context.height - (tileY + 1) * scale),
      0,
    );
    this.lb = new Vector3(tileX * scale, Math.max(0, context.height - (tileY + 1) * scale), 0);

    this.uvScale.setValues((this.rb.x - this.lt.x) / scale, (this.lt.y - this.rb.y) / scale);

    // create children if needed
    if (depth < maxDepth) {
      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 2; y++) {
          const child = new TiledHighResPlaneTile(
            context,
            this,
            tileX * 2 + x,
            tileY * 2 + y,
            depth + 1,
            maxDepth,
          );
          if (child.lt.x < child.rb.x && child.lt.y > child.rb.y) {
            this.children.push(child);
          }
        }
      }
    }
  }

  public allTiles(): TiledHighResPlaneTile[] {
    const allTiles: TiledHighResPlaneTile[] = [];
    this.children.forEach((child) => allTiles.push(...child.allTiles()));
    allTiles.push(this);
    return allTiles;
  }

  public visible(frame: number): boolean {
    return this.lastFrameVisible === frame;
  }

  public inViewport(frame: number): boolean {
    return this._lastFrameInViewport === frame;
  }

  public loaded(frame: number): boolean {
    return this.texture !== null;
  }

  public visibleAndLoaded(frame: number): boolean {
    return this.visible(frame) && this.loaded(frame);
  }

  public inViewportAndLoaded(frame: number): boolean {
    return this.inViewport(frame) && this.loaded(frame);
  }

  public downloadWeight(frame: number): number {
    return this._weight + (frame !== this.lastFrameVisible ? 1000 : 0);
  }

  public aChildLoaded(frame: number): boolean {
    return this._allChildLoaded || this.depth === 0;
  }

  public update(frustum: Frustum, camera: Camera, forward: Vector3, frame: number) {
    let visible = true;
    let childrenVisible = false;
    let weight = 1000;

    // first frustum check
    const lt3 = Vector3.transform(this.lt, this.context.model.worldMatrix);
    const rt3 = Vector3.transform(this.rt, this.context.model.worldMatrix);
    const lb3 = Vector3.transform(this.lb, this.context.model.worldMatrix);
    const rb3 = Vector3.transform(this.rb, this.context.model.worldMatrix);

    // if (frustum.boxInFrustum(
    //   new Vector3(Math.min(lt3.x, rt3.x, lb3.x, rb3.x), Math.min(lt3.y, rt3.y, lb3.y, rb3.y), Math.min(lt3.z, rt3.z, lb3.z, rb3.z)),
    //   new Vector3(Math.max(lt3.x, rt3.x, lb3.x, rb3.x), Math.max(lt3.y, rt3.y, lb3.y, rb3.y), Math.max(lt3.z, rt3.z, lb3.z, rb3.z)))) {
    //   this.visible = true;
    // }

    if (visible) {
      const lt = camera.worldToScreenPoint(lt3);
      const lb = camera.worldToScreenPoint(lb3);
      const rt = camera.worldToScreenPoint(rt3);
      const rb = camera.worldToScreenPoint(rb3);

      const bblt = new Vector2(Math.min(lt.x, lb.x, rt.x, rb.x), Math.min(lt.y, lb.y, rt.y, rb.y));
      const bbrb = new Vector2(Math.max(lt.x, lb.x, rt.x, rb.x), Math.max(lt.y, lb.y, rt.y, rb.y));

      if (bblt.x < 1 && bbrb.x > 0 && bblt.y < 1 && bbrb.y > 0) {
        // calculate ~'pixel density'
        const rw = this.context.renderer.width;
        const rh = this.context.renderer.height;
        const w1 = Math.sqrt((rw * (lt.x - rt.x)) ** 2 + (rh * (lt.y - rt.y)) ** 2);
        const w2 = Math.sqrt((rw * (lb.x - rb.x)) ** 2 + (rh * (lb.y - rb.y)) ** 2);
        const h1 = Math.sqrt((rw * (lt.x - lb.x)) ** 2 + (rh * (lt.y - lb.y)) ** 2);
        const h2 = Math.sqrt((rw * (rt.x - rb.x)) ** 2 + (rh * (rt.y - rb.y)) ** 2);

        const density =
          Math.max(((w1 + w2) * 0.5) / this.uvScale.x, ((h1 + h2) * 0.5) / this.uvScale.y) /
          this.context.tileSize;
        if (density > this.context.maxPixelSize) {
          childrenVisible = true;
        } else if (density < this.context.maxPixelSize * 0.5) {
          // visible = false;
        }
        weight =
          this.depth + 0.25 * Utils.clamp01(1 - (0.25 * density) / this.context.maxPixelSize);

        const center = Vector3.add(lt3, rb3).multiplyScalar(0.5);
        const v = center.subtract(camera.view.transform.worldPosition).normalize();

        weight += 0.25 * (0.5 + 0.5 * Vector3.dot(forward, v));

        this._lastFrameInViewport = frame;
      } else {
        visible = false;
      }
    }

    if (visible) {
      this.lastFrameVisible = frame;
    }

    this._weight = weight;

    this._allChildLoaded = this.children.length > 0 && childrenVisible;
    this._aChildVisibleAndLoaded = false;
    this.childrenVisible = childrenVisible;

    this.children.forEach((child) => {
      if (childrenVisible) {
        child.update(frustum, camera, forward, frame);
      }
      if (child.inViewport(frame) && !child.inViewportAndLoaded(frame)) {
        this._allChildLoaded = false;
      }
      if (child.aChildLoaded(frame) || child.loaded(frame)) {
        this._aChildVisibleAndLoaded = true;
      }
    });
  }

  public clear(pool: Texture2D[]) {
    if (this.texture !== null) {
      pool.push(this.texture);
    }
    this._weight = 1000;
    this.loading = false;
    this.texture = null;
    this._aChildVisibleAndLoaded = false;
    this._allChildLoaded = false;
    this._lastFrameInViewport = -1;
    this.lastFrameVisible = -1;
  }

  public draw(
    frame: number,
    renderer: Renderer,
    mesh: Mesh,
    material: Material,
    topToBottom: boolean = true,
  ) {
    if (!this.visible(frame) && this.depth !== 0) {
      return;
    }

    if (!topToBottom && this.childrenVisible) {
      this.children.forEach((child) => child.draw(frame, renderer, mesh, material, topToBottom));
    }

    if (this.visibleAndLoaded(frame) && !this._allChildLoaded) {
      material.setTexture('_Texture', <Texture2D>this.texture);
      material.setVector2('_UVScale', this.uvScale);
      material.setVector3('_LeftTop', this.lt);
      material.setVector3('_BottomRight', this.rb);
      material.setFloat('_Depth', this.depth);
      renderer.draw(mesh, material);
    }

    if (topToBottom && this.childrenVisible) {
      this.children.forEach((child) => child.draw(frame, renderer, mesh, material, topToBottom));
    }
  }
}

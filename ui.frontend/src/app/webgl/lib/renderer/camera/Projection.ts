import Vector3 from '../math/Vector3';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';

export default class Projection {
  public frustumHeight: number = 1;

  protected projectionMatrix = new Matrix4x4();
  protected fov: number;
  protected _nearPlane: number;
  protected _farPlane: number;
  protected _aspectRatio: number;

  private _dirty: boolean = true;
  private _changeCallback: () => void;
  private _tmpMat4: Matrix4x4 = new Matrix4x4();
  private _frustumCorner: Vector3 = new Vector3();

  private _jitter: Vector2 = new Vector2();
  private _jitterFrame: number = 0;

  constructor(
    changeCallback: () => void,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 10,
  ) {
    this.fov = fov;
    this.frustumHeight = Math.tan(this.fov * 0.5) * 2;
    this._nearPlane = nearPlane;
    this._farPlane = farPlane;
    this._aspectRatio = 1;
    this._changeCallback = changeCallback;

    this.dirty = true;
  }

  public set dirty(dirty: boolean) {
    if (this._dirty != dirty) {
      this._dirty = dirty;
      if (dirty) {
        this._changeCallback();
      }
    }
  }

  public get dirty(): boolean {
    return this._dirty;
  }

  public get matrix(): Matrix4x4 {
    this.updateMatrix();
    return this.projectionMatrix;
  }

  protected updateMatrix() {
    if (!this.dirty) {
      return;
    }
    Matrix4x4.perspective(
      this.projectionMatrix,
      this.fov,
      this._aspectRatio,
      this._nearPlane,
      this._farPlane,
    );

    this.dirty = false;

    this.getFrustumCornerRef(this._frustumCorner);
  }

  public set aspectRatio(value: number) {
    if (value !== this._aspectRatio) {
      this._aspectRatio = value;
      this.dirty = true;
    }
  }

  public get aspectRatio(): number {
    return this._aspectRatio;
  }

  public set farPlane(value: number) {
    if (value !== this._farPlane) {
      this._farPlane = value;
      this.dirty = true;
    }
  }

  public get farPlane(): number {
    return this._farPlane;
  }

  public set nearPlane(value: number) {
    if (value !== this._nearPlane) {
      this._nearPlane = value;
      this.dirty = true;
    }
  }

  public get nearPlane(): number {
    return this._nearPlane;
  }

  public set FOV(value: number) {
    if (value !== this.fov) {
      this.fov = value;
      this.frustumHeight = Math.tan(this.fov * 0.5) * 2;
      this.dirty = true;
    }
  }

  public get FOV(): number {
    return this.fov;
  }

  private getFrustumCornerRef(out: Vector3): Vector3 {
    const height: number = this.frustumHeight * 0.5;
    const width: number = height * this._aspectRatio;
    out.setValues(width, height, 1);
    return out;
  }

  public get frustumCorner(): Vector3 {
    if (this.dirty) this.updateMatrix();
    return this._frustumCorner;
  }

  private getHaltonSequence(index: number, base: number): number {
    let result = 0;
    let f = 1;
    let i = index;
    while (i > 0) {
      f = f / base;
      result = result + f * (i % base);
      i = Math.floor(i / base);
    }
    return result;
  }

  public jitter(renderSize: Vector2) {
    this._jitter.setValues(
      this.getHaltonSequence(this._jitterFrame % 51, 2) - 0.5,
      this.getHaltonSequence(this._jitterFrame % 31, 3) - 0.5,
    );

    this._jitterFrame++;

    Matrix4x4.copy(this.projectionMatrix, this.getJitteredMatrix(this._jitter, renderSize));

    this.getFrustumCornerRef(this._frustumCorner);

    this.dirty = false;
  }

  public getJitteredMatrix(
    texelOffset: Vector2,
    renderSize: Vector2,
    projectionExtends: Vector4 | null = null,
  ): Matrix4x4 {
    // see: https://github.com/playdeadgames/temporal/
    const oneExtentY = Math.tan(0.5 * this.FOV);
    const oneExtentX = oneExtentY * (renderSize.x / renderSize.y);
    const texelSizeX = oneExtentX / (0.5 * renderSize.x);
    const texelSizeY = oneExtentY / (0.5 * renderSize.y);
    const oneJitterX = texelSizeX * texelOffset.x;
    const oneJitterY = texelSizeY * texelOffset.y;

    if (projectionExtends !== null) {
      projectionExtends.setValues(
        oneExtentX / renderSize.x,
        oneExtentY / renderSize.y,
        oneJitterX / renderSize.x,
        oneJitterY / renderSize.y,
      );
    }

    const cf = this.farPlane;
    const cn = this.nearPlane;
    const xm = oneJitterX - oneExtentX;
    const xp = oneJitterX + oneExtentX;
    const ym = oneJitterY - oneExtentY;
    const yp = oneJitterY + oneExtentY;

    const x = (2.0 * cn) / (xp * cn - xm * cn);
    const y = (2.0 * cn) / (yp * cn - ym * cn);
    const a = (xp * cn + xm * cn) / (xp * cn - xm * cn);
    const b = (yp * cn + ym * cn) / (yp * cn - ym * cn);
    const c = -(cf + cn) / (cf - cn);
    const d = -(2.0 * cf * cn) / (cf - cn);
    const e = -1.0;

    this._tmpMat4.setValues(x, 0, 0, 0, 0, y, 0, 0, a, b, c, e, 0, 0, d, 0);

    return this._tmpMat4;
  }

  public getJitter(): Vector2 {
    return this._jitter;
  }

  //can be used for AR projects where the projection matrix is provided by the AR framework.
  public setMatrix(matrix: Matrix4x4) {
    Matrix4x4.copy(this.projectionMatrix, matrix);
    this.dirty = false;
  }
}

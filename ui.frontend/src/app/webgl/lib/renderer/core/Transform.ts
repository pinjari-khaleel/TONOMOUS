import Quaternion from '../math/Quaternion';
import Vector3 from '../math/Vector3';
import Matrix3x3 from '../math/Matrix3x3';
import Matrix4x4 from '../math/Matrix4x4';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class Transform {
  public name: string = 'unNamed';
  public id: number = -1;
  public autoUpdate: boolean = true;

  private _rotation = new Quaternion();
  private _position = new Vector3();
  private _scale = new Vector3(1, 1, 1);

  private _parent: Transform | null = null;

  private _matrix = new Matrix4x4();
  private _localMatrix = new Matrix4x4();

  private _changeCallback: (() => void)[] = [];
  private _children: Transform[] = [];

  private _tempMat4 = new Matrix4x4();
  private _tempMat3 = new Matrix3x3();

  private _dirty: boolean = true;
  private _signalDirtyDown: boolean = false;

  public identity() {
    this._position.setValues(0, 0, 0);
    this._rotation.identity();
    this._scale.setValues(1, 1, 1);
  }

  public setParent(parent: Transform | null): void {
    if (this._parent !== parent) {
      if (this._parent) {
        this._parent.removeChild(this);
      }
      this._parent = parent;
      if (parent) {
        parent.addChild(this);
      }
      this.setDirty();
    }
  }

  public getParent(): Transform | null {
    return this._parent;
  }

  public addChild(transform: Transform) {
    const index = this._children.indexOf(transform);
    if (index < 0) {
      this._children.push(transform);
      transform.setParent(this);
    }
  }

  public removeChild(transform: Transform) {
    const index = this._children.indexOf(transform);
    if (index > -1) {
      this._children.splice(index, 1);
      transform.setParent(null);
    }
  }

  public getChildren(): Transform[] {
    return this._children;
  }

  public getChildrenRecursive() {
    const children: Transform[] = [...this._children];
    this._children.forEach((child) => children.push(...child.getChildrenRecursive()));
    return children;
  }

  public addChangeCallBack(callback: () => void) {
    this._changeCallback.push(callback);
  }

  public setDirty(): void {
    if (!this._dirty) {
      this._dirty = true;
      this.signalDirtyDown();
    }
  }

  protected setParentDirty(): void {
    this.signalDirtyDown();
  }

  private signalDirtyDown(): void {
    if (!this._signalDirtyDown) {
      this._signalDirtyDown = true;
      for (let i = this._changeCallback.length - 1; i >= 0; i--) {
        this._changeCallback[i].call(this);
      }
      for (let i = this._children.length - 1; i >= 0; i--) {
        this._children[i].setParentDirty();
      }
    }
  }

  public clone(): Transform {
    return new Transform().copy(this);
  }

  public copy(t: Transform): Transform {
    this._scale.copy(t._scale);
    this._rotation.copy(t._rotation);
    this._position.copy(t._position);
    this._dirty = true;
    return this;
  }

  private updateMatrix(): void {
    if (!this._dirty && !this._signalDirtyDown) {
      return;
    }
    if (this.autoUpdate) {
      if (this._dirty) {
        Matrix4x4.fromRotationTranslationScale(
          this._localMatrix,
          this._rotation,
          this._position,
          this._scale,
        );
      }
      if (this._parent) {
        Matrix4x4.multiply(this._matrix, this._parent.worldMatrix, this._localMatrix);
      } else if (this._dirty) {
        Matrix4x4.copy(this._matrix, this._localMatrix);
      }
    }
    this._dirty = false;
    this._signalDirtyDown = false;
  }

  public lookAt(pos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void {
    this.position = pos;
    this.lookAtFromCurrentPos(target, up);
  }

  public lookAtFromCurrentPos(target: Vector3, up: Vector3 = Vector3.UP) {
    this._rotation = Quaternion.lookAt(this._position, target, up);
    this.setDirty();
  }

  // getters and setters, default is in local space

  public setPositionRotationScale(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this._position.copy(position);
    this._rotation.copy(rotation);
    this._scale.copy(scale);
    this.setDirty();
  }

  // Matrix: getters and setters, default is in local space

  public get worldMatrix(): Matrix4x4 {
    this.updateMatrix();
    return this._matrix;
  }

  public get localMatrix(): Matrix4x4 {
    this.updateMatrix();
    return this._localMatrix;
  }

  // Position: getters and setters, default is in local space

  public get position(): Vector3 {
    return this._position.clone();
  }

  public set position(p: Vector3) {
    this._position.copy(p);
    this.setDirty();
  }

  public setPositionValues(x: number, y: number, z: number): void {
    this._position.setValues(x, y, z);
    this.setDirty();
  }

  public get worldPosition(): Vector3 {
    this.updateMatrix();
    return new Vector3().transform(this._matrix);
  }

  // Scale: getters and setters, default is in local space

  public get scale(): Vector3 {
    return this._scale.clone();
  }

  public set scale(value: Vector3) {
    this._scale.copy(value);
    this.setDirty();
  }

  public set scaleScalar(value: number) {
    this._scale.setValues(value, value, value);
    this.setDirty();
  }

  public setScaleValues(x: number, y: number, z: number): void {
    this._scale.setValues(x, y, z);
    this.setDirty();
  }

  // Translate: getters and setters, default is in local space

  public translateX(value: number): void {
    this._position.x += value;
    this.setDirty();
  }

  public translateY(value: number): void {
    this._position.y += value;
    this.setDirty();
  }

  public translateZ(value: number): void {
    this._position.z += value;
    this.setDirty();
  }

  public translate(value: Vector3): void {
    this._position.add(value);
    this.setDirty();
  }

  public translateValues(x: number, y: number, z: number): void {
    this._position.x += x;
    this._position.y += y;
    this._position.z += z;
    this.setDirty();
  }

  // Rotation - Quaternion: getters and setters, default is in local space

  public get rotation(): Quaternion {
    return this._rotation.clone();
  }

  public set rotation(rotation: Quaternion) {
    this._rotation.copy(rotation);
    this.setDirty();
  }

  public get worldRotation(): Quaternion {
    let q = this._rotation;
    if (this._parent) {
      q = Quaternion.multiply(this._parent.worldRotation, q);
    }
    return q;
  }

  // Rotation - Matrix wrappers: getters and setters, default is in local space

  public get rotationMatrixMat4(): Matrix4x4 {
    Matrix4x4.fromQuat(this._tempMat4, this._rotation);
    return this._tempMat4;
  }

  public get worldRotationMatrixMat3(): Matrix3x3 {
    const nm = this.rotationMatrixMat3;

    if (this._parent) {
      Matrix3x3.multiply(nm, this._parent.worldRotationMatrixMat3, nm);
    }
    return nm;
  }

  public get rotationMatrixMat3(): Matrix3x3 {
    Matrix3x3.fromQuat(this._tempMat3, this._rotation);
    return this._tempMat3;
  }

  //rotationMatrixMat3
  public set rotationMatrixMat3(mat: Matrix3x3) {
    this._rotation.fromMat3(mat);
    this.setDirty();
  }

  public get worldRotationMatrixMat4(): Matrix4x4 {
    const nm = this.rotationMatrixMat4;

    if (this._parent) {
      Matrix4x4.multiply(nm, this._parent.rotationMatrixMat4, nm);
    }
    return nm;
  }

  // Rotation in radians: getters and setters, default is in local space

  public rotateEulerValues(x: number, y: number, z: number): Quaternion {
    this._rotation.rotateEulerValues(x, y, z);
    this.setDirty();
    return this._rotation;
  }

  public rotateEuler(euler: Vector3): Quaternion {
    return this.rotateEulerValues(euler.x, euler.y, euler.z);
  }

  public setEulerValues(x: number, y: number, z: number): Quaternion {
    this._rotation.identity();
    return this.rotateEulerValues(x, y, z);
  }

  // NOTE: axis must be normalized;
  public rotateAxisAngle(axis: Vector3, angle: number): Quaternion {
    this._rotation.rotateAxisAngle(axis, angle);
    this.setDirty();
    return this._rotation;
  }

  public rotateX(value: number): void {
    this._rotation.rotateX(value);
    this.setDirty();
  }

  public rotateY(value: number): void {
    this._rotation.rotateY(value);
    this.setDirty();
  }

  public rotateZ(value: number): void {
    this._rotation.rotateZ(value);
    this.setDirty();
  }

  public set euler(r: Vector3) {
    this._rotation.identity();
    this.rotateEulerValues(r.x, r.y, r.z);
  }

  public set eulerX(value: number) {
    this._rotation.identity();
    this.rotateX(value);
  }

  public set eulerY(value: number) {
    this._rotation.identity();
    this.rotateY(value);
  }

  public set eulerZ(value: number) {
    this._rotation.identity();
    this.rotateZ(value);
  }

  public set eulerXY(value: Vector2) {
    this.setEulerValues(value.x, value.y, 0);
  }

  public get euler(): Vector3 {
    Matrix3x3.fromQuat(this._tempMat3, this._rotation); // get the 3x3 rotation matrix
    return Transform.getEulerYXZ(this._tempMat3);
  }

  private static singularityRange = 0.0001; // don't decrease further, or singularities will not be found

  private static getEulerYXZ(mat: Matrix3x3): Vector3 {
    const m = mat.m;
    let x;
    let y;
    let z;

    // Note, x = asin(m[7]) so m[7] = sin(x), so m[7] can never be larger than 1 or smaller than -1
    if (m[7] < -1 + this.singularityRange) {
      // singularity at x = +90 degrees
      x = Math.PI / 2;
      y = Math.atan2(m[3], m[0]);
      z = 0;
    } else if (m[7] > 1 - this.singularityRange) {
      // singularity at x = -90 degrees
      x = -Math.PI / 2;
      y = -Math.atan2(m[3], m[0]);
      z = 0;
    } else {
      x = Math.asin(-m[7]);
      y = Math.atan2(m[6], m[8]);
      z = Math.atan2(m[1], m[4]);
    }

    return new Vector3(x, y, z);
  }

  // forward, up, right

  public get forward(): Vector3 {
    const mat3 = this.rotationMatrixMat3.m;
    return new Vector3(mat3[6], mat3[7], mat3[8]);
  }

  public get worldForward(): Vector3 {
    const mat3 = this.worldRotationMatrixMat3.m;
    return new Vector3(mat3[6], mat3[7], mat3[8]);
  }

  public get right(): Vector3 {
    const mat3 = this.rotationMatrixMat3.m;
    return new Vector3(mat3[0], mat3[1], mat3[2]);
  }

  public get worldRight(): Vector3 {
    const mat3 = this.worldRotationMatrixMat3.m;
    return new Vector3(mat3[0], mat3[1], mat3[2]);
  }

  public get up(): Vector3 {
    const mat3 = this.rotationMatrixMat3.m;
    return new Vector3(mat3[3], mat3[4], mat3[5]);
  }

  public get worldUp(): Vector3 {
    const mat3 = this.worldRotationMatrixMat3.m;
    return new Vector3(mat3[3], mat3[4], mat3[5]);
  }

  public setDirection(forward: Vector3, up: Vector3) {
    const right = Vector3.cross(up, forward);
    right.normalize();

    const up2 = Vector3.cross(forward, right);
    up2.normalize();

    Matrix3x3.setValues(
      this._tempMat3,
      right.x,
      right.y,
      right.z,
      up2.x,
      up2.y,
      up2.z,
      forward.x,
      forward.y,
      forward.z,
    );
    this.rotationMatrixMat3 = this._tempMat3;
  }

  public get direction(): Vector3 {
    return new Vector3(0, 0, 1).transformMat3(this.worldRotationMatrixMat3);
  }
}

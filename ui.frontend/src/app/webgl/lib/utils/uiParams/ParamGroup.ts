import Material from '../../renderer/material/Material';
import Vector3 from '../../renderer/math/Vector3';
import ActionParam from './ActionParam';
import BoolParam from './BoolParam';
import ColorParam from './ColorParam';
import FloatParam from './FloatParam';
import IntParam from './IntParam';
import ParamBase, { ParamCallback } from './ParamBase';
import TextParam from 'mediamonks-webgl/utils/uiParams/TextParam';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export default class ParamGroup implements IWebGLDestructible {
  private static _id: number = 0;
  private static _usedGroupNames: string[] = [];

  public materials: Material[] = [];
  public params: ParamBase[] = [];
  public name: string = '';
  public children: ParamGroup[] = [];
  public collapsed: boolean = false;
  public id: number = 0;

  constructor() {
    this.id = ParamGroup._id++;
  }

  public addGroup(name: string, materials: any = null, collapsed = false): ParamGroup {
    const child: ParamGroup = new ParamGroup();
    child.init(name, materials, collapsed);
    this.children.push(child);
    return child;
  }

  // Note: like addGroup, you need to initialize a new DatGui with this paramGroup after removing a group
  public removeGroup(name: string) {
    let childToRemove: ParamGroup | null = null;
    for (const child of this.children) {
      console.log('checking', child.name, name);
      if (child.name === name) {
        childToRemove = child;
        break;
      }
    }
    if (childToRemove) {
      this.children.splice(this.children.indexOf(childToRemove), 1);
    }
  }

  // Note: like addGroup, you need to initialize a new DatGui with this paramGroup after removing a group
  public removeAllGroups() {
    this.children = [];
  }

  public pushGroup(group: ParamGroup): void {
    this.children.push(group);
  }

  public init(name: string, materials: any = null, collapsed = false): void {
    //a unique name is needed when using, for instance, a preset to store values: a parameter is found a ParamGroup.name / Parameter.name
    if (ParamGroup._usedGroupNames.indexOf(name) > 0)
      console.warn(
        'another ParamGroup with this name already exists: consider giving it a unique name: ',
        name,
      );
    this.name = name;
    ParamGroup._usedGroupNames.push(this.name);
    this.collapsed = collapsed;

    if (!materials) {
      this.materials = [];
    } else {
      this.materials = [].concat(materials);
    }
  }

  /*  public addMaterial(material:Material):void
	 {
	 this.materials.push(material);
	 }*/

  public static exposeParam(param: ParamBase): void {
    // param.expose(this._exposedParams);
    param.expose();
  }

  public addParamFloat(
    name: string,
    value: number,
    min: number = 0.0,
    max: number = 1.0,
    callback: ParamCallback<number> | null = null,
  ): FloatParam {
    const param: FloatParam = new FloatParam(this, name, value, min, max, [], callback);
    this.params.push(param);
    return param;
  }

  public addShaderParamFloat(
    name: string,
    value: number,
    min: number = 0.0,
    max: number = 1.0,
    callback: ParamCallback<number> | null = null,
  ): FloatParam {
    if (!this.materials || this.materials.length == 0) {
      console.warn('Adding shader param to param group that has no materials: ', name);
    }

    const param: FloatParam = new FloatParam(this, name, value, min, max, this.materials, callback);
    this.params.push(param);
    return param;
  }

  public addParamInt(
    name: string,
    value: number,
    min: number = 0,
    max: number = 1,
    callback: ParamCallback<number> | null = null,
  ): IntParam {
    const param: IntParam = new IntParam(this, name, value, min, max, null, callback);
    this.params.push(param);
    return param;
  }

  public addShaderParamInt(
    name: string,
    value: number,
    min: number = 0,
    max: number = 1,
    callback: ParamCallback<number> | null = null,
  ): IntParam {
    if (!this.materials || this.materials.length == 0) {
      console.warn('Adding shader param to param group that has no materials: ', name);
    }

    const param: IntParam = new IntParam(this, name, value, min, max, this.materials, callback);
    this.params.push(param);
    return param;
  }

  public addParamBool(
    name: string,
    value: boolean,
    callback: ParamCallback<boolean> | null = null,
  ): BoolParam {
    const param: BoolParam = new BoolParam(this, name, value, null, callback);
    this.params.push(param);
    return param;
  }

  public addShaderParamBool(
    name: string,
    value: boolean,
    callback: ParamCallback | null = null,
  ): BoolParam {
    if (!this.materials || this.materials.length == 0) {
      console.warn('Adding shader param to param group that has no materials: ', name);
    }

    const param: BoolParam = new BoolParam(this, name, value, this.materials, callback);
    this.params.push(param);
    return param;
  }

  public addParamColor(
    name: string,
    value: Vector3,
    callback?: (value: number[]) => void,
  ): ColorParam {
    const param: ColorParam = new ColorParam(this, name, value, [], callback);
    this.params.push(param);
    return param;
  }

  public addShaderParamColor(
    name: string,
    value: Vector3,
    callback?: (value: number[]) => void,
  ): ColorParam {
    if (!this.materials || this.materials.length == 0) {
      console.warn('Adding shader param to param group that has no materials: ', name);
    }

    const param: ColorParam = new ColorParam(this, name, value, this.materials, callback);
    this.params.push(param);
    return param;
  }

  public addParamText(
    name: string,
    value: string,
    callback: ParamCallback<string> | null = null,
  ): TextParam {
    const param: TextParam = new TextParam(this, name, value, null, callback);
    this.params.push(param);
    return param;
  }

  /*
    public addShaderParamVector3(name: string, value: Vector3, displayName?: string, callback?: (value: number[]) => void): ColorParam {
      if (!this.materials || this.materials.length == 0) {
        console.warn("Adding shader param to param group that has no materials");
      }

      const param: Vector3Param = new Vector3Param(this, name, value, this.materials, displayName, callback);
      this.params.push(param);
      return param;
    }
  */

  public addButton(name: string, callback: ParamCallback<void> | null = null): ActionParam {
    const param: ActionParam = new ActionParam(this, name, callback);
    this.params.push(param);
    return param;
  }

  public getParameters(): ParamBase[] {
    let parameters: ParamBase[] = [];

    for (const child of this.children) {
      parameters = parameters.concat(child.getParameters());
    }
    for (const param of this.params) {
      parameters.push(param);
      // console.log(param.dataName);
    }

    return parameters;
  }

  public static destruct() {
    ParamGroup._usedGroupNames = [];
    ParamGroup._id = 0;
  }

  destruct() {
    if (this.params) {
      for (let i = 0; i < this.params.length; i++) {
        this.params[i].destruct();
      }
    }

    if (this.children) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].destruct();
      }
    }
  }
}

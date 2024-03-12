import { GUI, GUIController, GUIParams } from 'dat.gui';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import ParamGroup from './ParamGroup';
import ParamBase from './ParamBase';
import FloatParam from './FloatParam';
import IntParam from './IntParam';
import BoolParam from './BoolParam';
import ActionParam from './ActionParam';
import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import ColorParam from './ColorParam';
import Vector3Param from 'mediamonks-webgl/utils/uiParams/Vector3Param';
import TextParam from 'mediamonks-webgl/utils/uiParams/TextParam';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export default class DatGui implements IWebGLDestructible, IWebGLPreloadable {
  private _gui: GUI | undefined;
  private _jsonExportEnabled: boolean;
  private _params: GUIParams = {};
  private _uniqueNames: string[] = [];

  constructor(
    preloader: WebGLPreLoader | null = null,
    exportJson: boolean = true,
    params: GUIParams = {},
  ) {
    if (preloader) {
      preloader.add(this);
    }

    this._jsonExportEnabled = exportJson;
    this._params = params;
  }

  public load(callback: () => any): void {
    callback.call(this);
  }

  public init(rootGroup: ParamGroup): GUI | undefined {
    if (typeof window === 'undefined') return undefined;

    (async () => {
      const dat = await import('dat.gui');
      let paramObject = {};
      this._gui = new dat.GUI(this._params);
      // @ts-ignore
      this.readGroup(undefined, rootGroup, paramObject, this._gui);

      if (this._jsonExportEnabled) {
        this._gui.remember(paramObject);
      }

      this.setVisible(true);
    })();

    return this._gui;
  }

  public getDatGUI(): GUI | undefined {
    return this._gui;
  }

  private readGroup(
    parentGroup: ParamGroup,
    group: ParamGroup,
    paramObject: any,
    parentUi: GUI,
  ): void {
    if (!group.name) {
      throw new Error('group name not initialized');
    }
    if (!this._gui) {
      throw new Error('cannot read group: DatGui not initialized');
    }

    let groupName = this.uniqueName(parentUi.__folders, group.name);
    let groupUi = parentUi.addFolder(groupName);
    if (!group.collapsed) {
      groupUi.open();
    }

    for (let p of group.params) {
      const dataName = this.uniqueName(paramObject, p.name);
      this._uniqueNames[p.id] = dataName;

      if (paramObject[dataName] == undefined) {
        paramObject[dataName] = p.value;
      } else {
        console.log('property ' + dataName + ' already exists on param object', paramObject);
      }

      let controller: GUIController | undefined;

      if (p instanceof FloatParam) {
        const fp: FloatParam = <FloatParam>p;
        controller = groupUi.add(paramObject, dataName, fp.min, fp.max);
      } else if (p instanceof IntParam) {
        const ip: IntParam = <IntParam>p;
        controller = groupUi.add(paramObject, dataName, ip.min, ip.max).step(1);
      } else if (p instanceof BoolParam) {
        controller = groupUi.add(paramObject, dataName);
      } else if (p instanceof ActionParam) {
        controller = groupUi.add(paramObject, dataName);
      } else if (p instanceof Vector3Param) {
        controller = groupUi.add(paramObject, dataName);
      } else if (p instanceof ColorParam) {
        controller = groupUi.addColor(paramObject, dataName);
      } else if (p instanceof TextParam) {
        controller = groupUi.add(paramObject, dataName);
      } else {
        if (controller === undefined) {
          throw new TypeError('Unknown type of parameter');
        }
      }

      if (!(p instanceof ActionParam)) {
        this.addHandlers(controller, paramObject, p);
      }
    }

    for (let child of group.children) {
      let childParamObject = {};
      if (this._jsonExportEnabled) {
        this._gui.remember(childParamObject);
      }
      this.readGroup(group, child, childParamObject, groupUi);
    }
  }

  public uniqueName(params: {}, newName: string): string {
    if (newName in params) {
      return this.uniqueName(params, '_' + newName);
    } else {
      return newName;
    }
  }

  private addHandlers(controller: GUIController, paramObject: Object, param: ParamBase): void {
    //when setting a param from code, it needs to update the ui

    param.setUpdateUICallback((value: any) => {
      // @ts-ignore @fixme
      paramObject[this._uniqueNames[param.id]] = value;
    });

    controller.listen();

    controller.onChange((value: any) => {
      // @ts-ignore @fixme
      paramObject[this._uniqueNames[param.id]] = value;
      param.setFromUI(value);
    });

    // @ts-ignore
    controller.onFinishChange = (value) => param.setFromUI(value);
  }

  public setVisible(value: boolean): void {
    if (!this._gui) {
      throw new Error('cannot set visible: DatGui not initialized');
    }
    if (this._gui.domElement.parentElement) {
      this._gui.domElement.parentElement.style.zIndex = (value ? 999 : 0).toString();
      this._gui.domElement.parentElement.style.visibility = (value
        ? 'visible'
        : 'hidden'
      ).toString();
    }
  }

  destruct() {
    if (this._gui) {
      if (this._gui.domElement.parentElement) {
        this._gui.domElement.parentElement.removeChild(this._gui.domElement);
      }
      delete this._gui;
    }
  }
}

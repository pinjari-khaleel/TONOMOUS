import Renderer from '../../renderer/render/Renderer';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import ParamGroup from './ParamGroup';
import Vector3 from '../../renderer/math/Vector3';
import ParamBase from './ParamBase';
import DatGui from './DatGui';
import ColorParam from './ColorParam';
import Time from '../../renderer/core/Time';
import Utils from '../../renderer/core/Utils';
import LogGL from '../../renderer/core/LogGL';
import FloatParam from 'mediamonks-webgl/utils/uiParams/FloatParam';
import IntParam from 'mediamonks-webgl/utils/uiParams/IntParam';
import BoolParam from 'mediamonks-webgl/utils/uiParams/BoolParam';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export interface IParam {
  name?: string;
  parentName?: string;
  value?: number | number[];
}

export interface IPreset {
  name?: string;
  params?: IParam[];
}

//big optimization while blending presets
export class Transition {
  public param: ParamBase;
  public v0: any;
  public v1: any;

  constructor(param: ParamBase, v0: any, v1: any) {
    this.param = param;
    this.v0 = v0;
    this.v1 = v1;
  }
}

export default class PresetManager implements IWebGLDestructible {
  private _datGui!: DatGui;
  private _params: ParamBase[] = [];
  private _presets: IPreset[] = [];
  private _blendTargetPresetID: number = -1;
  private _activePreset!: IPreset;
  private _fileName: string;
  private _loadedPresets: {};
  private _blendTime: number = 1;
  private _blendDuration: number = 1;
  private _endPreset!: IPreset;
  private _transitions!: Transition[];
  private _showUI: boolean;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    presets: {},
    fileName: string,
    showUI: boolean = true,
  ) {
    this._fileName = fileName;
    // presets = [];
    this._loadedPresets = presets;
    this._showUI = showUI;
    this.initDropZone(renderer.canvas);
  }

  public init(paramGroup: ParamGroup, params: ParamBase[]): void {
    if (LogGL.ENABLED) console.log('PresetManager: init', params, this._loadedPresets);
    this._params = this.filterParams(params);
    this.cleanPresets(this._presets);
    this.setPresets(this._loadedPresets);
  }

  public setPresets(presetsJson: any): void {
    this._presets = presetsJson;
    this.cleanPresets(this._presets);
    this.refreshUI();
  }

  private filterParams(source: ParamBase[]): ParamBase[] {
    let filtered: ParamBase[] = [];
    for (let param of source) {
      if (param instanceof FloatParam) {
        filtered.push(param);
      } else if (param instanceof IntParam) {
        filtered.push(param);
      } else if (param instanceof BoolParam) {
        filtered.push(param);
      } else if (param instanceof ColorParam) {
        filtered.push(param);
        //}else{
        //console.log('filtered',param );
      }
    }
    return filtered;
  }

  private cleanPresets(presets: IPreset[]) {
    for (let preset of presets) {
      if (preset.params) {
        //remove preset params that do not have an application parameter
        let i = preset.params.length;
        while (i--) {
          let param: IParam = preset.params[i];
          let presetParam = this.getParamBase(param);
          if (!presetParam) {
            //the parameter does not exist anymore
            preset.params.splice(i, 1);
            console.log('removed preset param', param.name, preset.name, preset.params.length);
          }
        }
        for (const paramBase of this._params) {
          let presetParam = this.getParam(paramBase, preset);
          if (!presetParam) {
            preset.params.push(this.serialize(paramBase));
            console.log('added preset param', paramBase.name, preset.name);
          }
        }
      }
    }
  }

  private getParamBase(param: IParam): ParamBase | null {
    for (const paramBase of this._params) {
      if (param.name == paramBase.name) {
        if (paramBase.parent.name == param.parentName) {
          return paramBase;
        }
      }
    }
    return null;
  }

  private refreshUI() {
    this.RefreshUI();
  }

  public RefreshUI() {
    if (this._showUI) {
      if (this._datGui) this._datGui.destruct();
      this._datGui = new DatGui(null);
    }

    let paramGroup: ParamGroup = new ParamGroup();
    paramGroup.init('Presets');

    paramGroup.addButton('Export', () => this.exportPresets());
    paramGroup.addButton('Create Preset', () => this.createPreset());
    paramGroup.addButton('Update Preset', () => this.updatePreset());
    paramGroup.addButton('Delete Preset', () => this.deletePreset());
    paramGroup.addButton('Blend To Target', () =>
      this.blendToPreset(this._presets[this._blendTargetPresetID], 1.8),
    );
    paramGroup.addParamInt('BlendTarget', -1, -1, this._presets.length - 1, (value) => {
      this._blendTargetPresetID = value;
    });

    let i = 0;
    for (let preset of this._presets) {
      paramGroup.addParamText(
        i.toString(),
        preset.name ? preset.name : 'unNamed',
        (value: string) => {
          preset.name = value;
        },
      );
      paramGroup.addButton(preset.name ? preset.name : 'preset_' + i, () =>
        this.applyPreset(preset),
      );
      i++;
    }
    if (this._showUI) {
      (<DatGui>this._datGui).init(paramGroup); //.hide();
    }
  }

  private updatePreset() {
    if (this._activePreset) {
      this.savePreset(this._activePreset);
    } else {
      console.log('updatePreset: no active preset');
    }
  }

  private deletePreset() {
    if (this._activePreset) {
      let index = this._presets.indexOf(this._activePreset);
      if (index > -1) {
        this._presets.splice(index, 1);
      }
      this.refreshUI();
    } else {
      console.log('deletePreset: no active preset');
    }
  }

  private createPreset() {
    let preset: IPreset = {};
    preset.params = [];
    this.savePreset(preset);
    this._presets.push(preset);
    this.applyPreset(preset);
    this.refreshUI();
  }

  private serialize(param: ParamBase): IParam {
    let paramData: IParam = {};
    paramData.name = param.name;
    paramData.parentName = param.parent.name;

    if (param instanceof ColorParam) {
      let color = (<ColorParam>param).getValueVector3();
      paramData.value = [color.x, color.y, color.z];
      // console.log('serialize: color', paramData.value);
    } else {
      // console.log('serialize: param', param);
      paramData.value = param.value;
    }
    return paramData;
  }

  private deSerialize(param: IParam): number | Vector3 {
    if (Array.isArray(param.value)) {
      let color = new Vector3(param.value[0], param.value[1], param.value[2]);
      //console.log('deSerialize: color', color, param.value);
      return color;
    } else {
      return param.value!;
    }
  }

  private deSerializeParamValue(param: number[] | number): number | Vector3 {
    if (Array.isArray(param)) {
      let color = new Vector3(param[0] / 255, param[1] / 255, param[2] / 255);
      //console.log('deSerialize: color', color, param.value);
      return color;
    } else {
      return param;
    }
  }

  private getParam(param: ParamBase, preset: IPreset): IParam | null {
    if (preset && preset.params) {
      for (let presetParam of preset.params) {
        if (param.name == presetParam.name) {
          if (param.parent.name == presetParam.parentName) {
            return presetParam;
          }
        }
      }
    }
    if (LogGL.ENABLED) console.log('getParam: not found: ', param);
    return null;
  }

  private applyPreset(preset: IPreset) {
    if (LogGL.ENABLED) console.log('applyPreset', preset);
    if (preset.params) {
      for (let param of this._params) {
        let presetParam = this.getParam(param, preset);
        if (presetParam) param.setValue(this.deSerialize(presetParam));
      }
    }
    this._activePreset = preset;
  }

  public applyPresetIndex(presetIndex: number) {
    this.stopBlend();

    this.applyPreset(this._presets[presetIndex]);
  }

  public applyPresetByName(name: string) {
    let preset = this.getPresetByName(name);
    if (preset) {
      if (LogGL.ENABLED) console.log('applyPresetByName', name);
      this.applyPreset(preset);
    } else {
      console.warn('applyPresetByName: preset not found', name);
    }
  }

  public getPresetByName(name: string) {
    for (let preset of this._presets) {
      if (preset.name == name) return preset;
    }
    return null;
  }

  private stopBlend(): void {
    this._blendTime = 1;
  }

  public blendToPreset(preset: IPreset, duration: number = 1) {
    if (LogGL.ENABLED) console.log('blendToPreset', preset);
    this._blendTime = 0;
    this._blendDuration = duration;
    // if(!this._startPreset)this._startPreset = this.createPreset();
    if (!this._activePreset) {
      this._activePreset = {};
      // preset.name = 'preset_'+ this._presets.length;
      this._activePreset.params = [];
      this.savePreset(this._activePreset);
    }
    this._endPreset = preset;
    this._transitions = this.createTransions(this._activePreset, preset);
  }

  public static isNumber(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public static isVector3(n: any): boolean {
    if (
      n.x !== null &&
      this.isNumber(n.x) &&
      n.y !== null &&
      this.isNumber(n.y) &&
      n.z !== null &&
      this.isNumber(n.z)
    )
      return true;
    else return false;
  }

  private lerpTransition(transitions: Transition[], s: number) {
    for (let transition of transitions) {
      if (PresetManager.isNumber(transition.v0)) {
        transition.param.setValue(Utils.lerp(<number>transition.v0, <number>transition.v1, s));
      } else if (PresetManager.isVector3(transition.v0)) {
        transition.param.setValue(Vector3.lerp(<Vector3>transition.v0, <Vector3>transition.v1, s));
      } else if (typeof transition.v0 == 'boolean') {
        transition.param.setValue(transition.v1);
      }
    }
  }

  private createTransions(start: IPreset, end: IPreset): Transition[] {
    let transitions = [];
    for (let param of this._params) {
      let v0;
      let v1;

      let presetParam = this.getParam(param, start);
      if (presetParam) v0 = this.deSerializeParamValue(param.value);

      presetParam = this.getParam(param, end);
      if (presetParam) v1 = this.deSerialize(presetParam);

      if (v0 != null && v1 != null) {
        if (PresetManager.isNumber(v0)) {
          if (Utils.Approximately(<number>v0, <number>v1) == false) {
            transitions.push(new Transition(param, v0, v1));
          }
        } else {
          transitions.push(new Transition(param, v0, v1));
        }
      }
    }
    return transitions;
  }

  public update() {
    if (this._blendTime < 1) {
      this._blendTime += Time.instance.deltaTime / this._blendDuration;
      this._blendTime = Utils.clamp01(this._blendTime);
      let s = Utils.smoothStep01(this._blendTime);

      this.lerpTransition(this._transitions, s);

      if (this._blendTime == 1) {
        this._activePreset = this._endPreset;
        if (LogGL.ENABLED) console.log('blend complete', this._activePreset);
      }
    }
  }

  private savePreset(preset: IPreset) {
    //Background
    for (let param of this._params) {
      let presetParam = this.getParam(param, preset);
      if (presetParam !== null) {
        presetParam.value = this.serialize(param).value;
      } else {
        // @ts-ignore
        preset.params.push(this.serialize(param));
      }
    }
    if (LogGL.ENABLED) console.log('savePreset', preset);
  }

  private exportPresets() {
    if (LogGL.ENABLED) console.log('exportPresets', this._presets);
    let jsonString = JSON.stringify(this._presets);
    let a = document.createElement('a');
    let file = new Blob([jsonString], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a['download'] = this._fileName;
    a.click();
  }

  private initDropZone(dropzone: HTMLCanvasElement) {
    dropzone.ondragover = function (e) {
      e.preventDefault();
      return false;
    };

    dropzone.ondrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        if (LogGL.ENABLED) console.log('dropZone', e.dataTransfer.files);

        let length = e.dataTransfer.files.length;
        for (let i = 0; i < length; i++) {
          let file = e.dataTransfer.files[i];
          let words: string[] = file.name.split('.');
          // @ts-ignore
          let ext = words.pop().toLowerCase();

          if (ext == 'json' || ext == 'txt') {
            this.loadJson(file);
          }
        }
      }
    };
  }

  private loadJson(file: File) {
    if (LogGL.ENABLED) console.log('loadJson', file);
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.setPresets(JSON.parse(e.target.result));
    };
    reader.readAsText(file, 'UTF-8');
  }

  destruct() {}
}

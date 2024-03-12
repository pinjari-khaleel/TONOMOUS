import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Shader from 'mediamonks-webgl/renderer/material/Shader';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';

export default class PostEffectStack extends PostEffectBase {
  public _postEffects: PostEffectBase[] = [];
  private _postStacks: PostEffectStack[] = [];

  constructor(
    renderer: Renderer,
    effects: PostEffectBase[],
    autoSplitStackIfNeeeded: boolean = false,
  ) {
    super(renderer, 'PostEffectStack');

    if (autoSplitStackIfNeeeded) {
      let tmpEffects: PostEffectBase[] = [];

      for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        effect.setStandAlone(false);
        if (effect.shaderSetsColor() && tmpEffects.length > 0) {
          this._postStacks.push(new PostEffectStack(renderer, tmpEffects));
          tmpEffects = [];
        }
        tmpEffects.push(effect);
      }
      this._postEffects = tmpEffects;

      LogGL.log('PostEffectStack auto split in ' + (this._postStacks.length + 1) + ' stacks.');
    } else {
      for (let i = 0; i < effects.length; i++) {
        // checks..
        const effect = effects[i];
        effect.setStandAlone(false);
        if (i > 0 && effect.shaderSetsColor()) {
          throw (
            'PostEffectStack: ' +
            effect._name +
            ' not at first position of stack. Only the first effect of a stack is allowed to set the base color. Use more than one stack, auto-split stack or re-order effects.'
          );
        }
        this._postEffects.push(effect);
      }
    }
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    for (let i = 0; i < this._postStacks.length; i++) {
      this._postStacks[i].init(paramGroup);
    }

    for (let i = 0; i < this._postEffects.length; i++) {
      this._postEffects[i].setMaterial(this._material);
      this._postEffects[i].init(paramGroup);
    }
  }

  public update(source: Texture2D): void {
    for (let i = 0; i < this._postEffects.length; i++) {
      this._postEffects[i].update(source);
    }
  }

  public debug() {
    for (let i = 0; i < this._postStacks.length; i++) {
      this._postStacks[i].debug();
    }
    super.debug();
  }

  protected initMaterial() {
    if (this._standAlone) {
      const name = this._name;

      const vsCode = this.getBaseVSCode();
      let fsCode = this._postEffects[0].getBaseFSCode();

      for (let i = 0; i < this._postEffects.length; i++) {
        const effect = this._postEffects[i];

        fsCode = this.injectFSCode(effect._name, fsCode, effect.getFSCode());
      }
      this._generatedShader = fsCode;

      this._material = new Material(
        this._renderer,
        name,
        new Shader(this._renderer).init(name, vsCode, fsCode),
      );
    }
  }

  public draw(source: Texture2D, toScreen: boolean = false): Texture2D {
    let tex = source;

    for (let i = 0; i < this._postStacks.length; i++) {
      if (this._postStacks[i].enabled) {
        tex = this._postStacks[i].draw(tex);
      }
    }

    super.draw(tex, toScreen);

    return this.output;
  }
}

{{#if transitionComponent}}
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent'
import {{pascalCase componentName}}TransitionController from './{{pascalCase componentName}}TransitionController';
{{^}}
import AbstractComponent from 'app/component/AbstractComponent'
{{/if}}
{{#if lazy}}import { setAsInitialised } from 'app/util/setAsInitialised';{{/if}}

export default class {{pascalCase componentName}} extends {{#if transitionComponent}}AbstractTransitionComponent{{^}}AbstractComponent{{/if}} {
  public static readonly displayName:string = '{{dashCase componentName}}';

  {{#if transitionComponent}}
  public readonly transitionController:{{pascalCase componentName}}TransitionController;

    constructor(el:HTMLElement) {
      super(el);

      this.transitionController = new {{pascalCase componentName}}TransitionController(this);
    }
  {{/if}}
  
  {{#if lazy}}
    public adopted() {
      setAsInitialised(this.element);
    }
  {{/if}}
}

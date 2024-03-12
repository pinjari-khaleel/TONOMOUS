{{#if transitionComponent}}
import AbstractTransitionController from "../../AbstractTransitionController";
import {{pascalCase componentName}} from './{{pascalCase componentName}}{{lazyExtension}}'
import { TimelineMax } from "gsap";

class {{pascalCase componentName}}TransitionController extends AbstractTransitionController<{{pascalCase componentName}}> {
protected setupTransitionInTimeline(timeline: TimelineMax, parent: {{pascalCase componentName}}, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id)
  }

protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: {{pascalCase componentName}},
  id: string,
): void {}

protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: {{pascalCase componentName}},
  id: string,
): void {}
}

export default {{pascalCase componentName}}TransitionController;
{{^}}
// Please remove this file.
{{/if}}

import { ComponentModule, registerComponent } from 'muban-core/lib/utils/componentStore';
import { renderItem } from 'muban-core/lib/utils/dataUtils';

export type TemplateFunc = Parameters<typeof renderItem>[1];

export function createLoadTemplate(
  loadTemplate: () => Promise<{ default: TemplateFunc }>,
  loadComponent: () => Promise<{ default: ComponentModule }>,
): () => Promise<TemplateFunc> {
  return async () => {
    const templatePromise = loadTemplate();
    const componentPromise = loadComponent();

    await Promise.all([templatePromise, componentPromise]);

    registerComponent((await componentPromise).default);

    return (await templatePromise).default;
  };
}

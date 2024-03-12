import { initComponents } from 'muban-core';
import { lazyLoadComponents } from './lazyLoadComponents';
import { isEditor } from './util/aemEditorUtils';
import { addComponentInstancesToScrollManager } from './addComponentInstancesToScrollManager';

export function initiateAemHotreload(appContainer: HTMLElement): void {
  if (!isEditor()) {
    return;
  }

  const mutationObserver = new MutationObserver((mutations) => {
    const shouldInitialize = mutations.some((record) =>
      Array.from(record.addedNodes).some((node) => {
        const element = node as HTMLElement;
        // Check if author added a new component element in aem that
        // would need to have a new associated component instance
        // note: component is added by aem as second child of added node, since
        // aem wraps the components into containers

        const secondChild =
          element.children && element.children.length > 1 && (element.children[1] as HTMLElement);
        if (!secondChild || secondChild.dataset === undefined) {
          return false;
        }

        return secondChild?.dataset?.component !== undefined;
      }),
    );

    // if any block components are added, we need to run initComponents again
    // to create new component instances for them
    if (shouldInitialize) {
      // load any lazy loaded components added by author
      lazyLoadComponents(appContainer);
      initComponents(appContainer);

      // any new scroll components added by author need to be added
      // to the scroll manager after initComponents returns
      addComponentInstancesToScrollManager();
    }
  });

  mutationObserver.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
  });
}

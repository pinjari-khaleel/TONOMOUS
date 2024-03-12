import ICoreComponent from 'muban-core/lib/interface/ICoreComponent';
import EventDispatcher, { IEvent } from 'seng-event';
import { addEventListener } from 'seng-disposable-event-listener';
import { DisposableManager } from 'seng-disposable-manager';
import { getComponentForElement } from 'muban-core';

function abstractComponentMixin<TBase extends Constructor<ICoreComponent>>(Base: TBase) {
  return class AbstractComponentMixin extends Base {
    // Each component has it's own event dispatcher so we can always dispatch events.
    public dispatcher: EventDispatcher = new EventDispatcher();

    // This disposables instance can be used to easily add and remove disposables to the component.
    public disposables = new DisposableManager();

    constructor(...args: any[]) {
      super(...args);
    }

    /**
     * Gets component for component with given name in current component.
     * `parent` argument can be passed to search in a different tree than the
     * current components' `element`
     */
    protected getComponent<T extends ICoreComponent>(name: string, parent?: HTMLElement): T | null {
      const element = this.getElement(`[data-component="${name}"]`, parent);

      if (element == null) {
        return null;
      }

      return getComponentForElement<T>(element);
    }

    /**
     * Gets components with given name in current component.
     * `parent` argument can be passed to search in a different tree than the
     * current components' `element`
     */
    protected getComponents<T extends ICoreComponent>(
      name: string,
      parent?: HTMLElement,
    ): Array<T> {
      return this.getElements(`[data-component="${name}"]`, parent).map((element) =>
        getComponentForElement<T>(element),
      );
    }

    /**
     * Gets components with given name that's closest to current component.
     * `element` argument can be passed to search in a different tree than the
     * current components' `element`.
     */
    protected getClosestComponent<T extends ICoreComponent>(
      name: string,
      child?: HTMLElement,
    ): T | null {
      const componentElement = (child || this.element).closest(`[data-component="${name}"]`) as
        | HTMLElement
        | undefined;

      if (componentElement == null) {
        return null;
      }

      return getComponentForElement<T>(componentElement);
    }

    /**
     * Helper method to easily attach disposable events.
     *
     * @param dispatcher - The element/instance that dispatches the event that you want to listen to.
     * @param event - The name of the event that you want to listen to
     * @param listener - The listener that you want to attach to the event.
     * @param disposables - The DisposableManager instance where you want to add the listener to, by default it's the internal one.
     */
    public addDisposableEventListener<T = IEvent>(
      dispatcher: Window | Document | EventDispatcher | Element,
      event: string,
      listener: (event: T) => void,
      disposables: DisposableManager = this.disposables,
    ): void {
      disposables.add(addEventListener<any, any>(dispatcher, event, listener as any));
    }

    public dispose() {
      this.dispatcher.dispose();
      this.disposables.dispose();

      super.dispose();
    }
  };
}

export default abstractComponentMixin;

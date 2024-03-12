import { getComponentForElement } from 'muban-core';
import App from '../component/layout/app/App';
import timeoutPromise from './timeout-promise';
import type O92WebglContainerLazy from '../component/organism/o92-webgl-container/O92WebglContainer.lazy';

const loadComponent: (element: HTMLElement) => any = (element) => {
  return new Promise((resolve, reject) => {
    const component = getComponentForElement(element);
    if (component) {
      resolve(component);
    } else {
      reject();
    }
  });
};

const awaitElementComponent = <T>(element: HTMLElement): Promise<T> => {
  const getComponent = new Promise((resolve) => {
    const load = () =>
      loadComponent(element)
        .then((component: any) => {
          resolve(component);
        })
        .catch(() => setTimeout(() => load(), 0));
    // If we have a chain of promise handlers that don’t wait for anything,
    // execute right one after another, then the setTimeout set in timeoutPromise
    // can never run in-between them and reject the timeout promise. If that happens,
    // and the component we are loading does not become available, then we 'll get
    //into an infinite loop by recursively calling load(). Hence, the use of setTimeout
    // to call load().
    load();
  });

  return timeoutPromise(
    1000,
    getComponent,
    `Timeout while trying to get component for element ${element.getAttribute('data-component')}`,
  ) as Promise<T>;
};

export function getAppComponent() {
  return awaitElementComponent<App>(
    document.querySelector(`[data-component="app-root"]`) as HTMLElement,
  );
}

export function getWebglComponent() {
  const webglContainerElement = document.querySelector(
    `[data-component="o92-webgl-container"]`,
  ) as HTMLElement;
  if (!webglContainerElement) {
    return Promise.reject('webglContainerElement not found');
  }

  return awaitElementComponent<O92WebglContainerLazy>(webglContainerElement);
}

export default awaitElementComponent;

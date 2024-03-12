import { getWebglComponent } from './getElementComponent';
import WebGLApplication from '../webgl/WebGLApplication';

export const getWebglApplication = async () =>
  (await getWebglComponent()).webglApp as WebGLApplication;

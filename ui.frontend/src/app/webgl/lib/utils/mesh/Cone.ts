import Renderer from '../../renderer/render/Renderer';
import Cylinder from './Cylinder';

export default class Cone extends Cylinder {
  constructor(
    renderer: Renderer,
    radius = 1,
    height = 1,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
  ) {
    super(
      renderer,
      0,
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    );
  }
}

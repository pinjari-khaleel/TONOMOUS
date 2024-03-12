import Renderer from '../../renderer/render/Renderer';
import Box from './Box';

export default class Cube extends Box {
  constructor(renderer: Renderer, size = 2, segments = 1) {
    super(renderer, size, size, size, segments, segments, segments);
  }
}

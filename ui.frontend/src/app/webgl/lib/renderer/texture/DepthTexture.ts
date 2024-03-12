import Renderer from '../render/Renderer';
import Texture2D from './Texture2D';
import TextureFormat from './TextureFormat';

export default class DepthTexture extends Texture2D {
  constructor(
    renderer: Renderer,
    width: number = 1,
    height: number = 1,
    format = TextureFormat.DEPTH_UINTSHORT,
  ) {
    super(renderer, format, false, false, true);
    this.setSize(width, height);
  }
}

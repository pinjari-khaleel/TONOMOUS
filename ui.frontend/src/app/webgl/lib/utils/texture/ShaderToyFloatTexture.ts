import Texture2D from '../../renderer/texture/Texture2D';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';

export default class ShaderToyFloatTexture extends Texture2D {
  constructor(renderer: Renderer) {
    super(renderer, TextureFormat.RGBA_FLOAT, false, true, false);

    ShaderToyFloatTexture.fillShaderToyFloatNoise(this);
  }

  public static fillShaderToyFloatNoise(texture: Texture2D): void {
    // generate list of ascending 2^16 numbers and shuffle as random numbers.
    // this ensures the random numbers are uniformly spread (histogram would be flat)
    const count: number = 65536;
    let random: number[] = [count];
    let random2: number[] = [count];
    for (let i: number = 0; i < count; ++i) {
      random[i] = i;
      random2[i] = i;
    }
    // now shuffle
    for (let i = random.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const k = Math.floor(Math.random() * (i + 1));
      [random[i], random[j]] = [random[j], random[i]];
      [random2[i], random2[k]] = [random2[k], random2[i]];
    }

    // assuming 32-bit floating point precision texture
    const data = new Float32Array(4 * 256 * 256);
    for (let y: number = 0; y < 256; ++y) {
      for (let x: number = 0; x < 256; ++x) {
        data[(y * 256 + x) * 4 + 0] = random[y * 256 + x] / count; // r
        data[(y * 256 + x) * 4 + 2] = random2[y * 256 + x] / count; // b
      }
    }
    let mod = function (n: number, m: number) {
      return ((n % m) + m) % m;
    };

    // offset r,b channels for g,a channels
    for (let y: number = 0; y < 256; ++y) {
      for (let x: number = 0; x < 256; ++x) {
        let x2: number = mod(x - 37, 255);
        let y2: number = mod(x - 17, 255);
        data[(y * 256 + x) * 4 + 1] = data[(y2 * 256 + x2) * 4 + 0]; // r -> g
        data[(y * 256 + x) * 4 + 3] = data[(y2 * 256 + x2) * 4 + 2]; // b -> a
      }
    }

    texture.setData(data, 256, 256);
  }
}

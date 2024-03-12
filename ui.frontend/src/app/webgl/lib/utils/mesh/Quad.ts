import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';

export default class Quad extends Mesh {
  constructor(renderer: Renderer) {
    super(renderer);

    var positionData: Float32Array = new Float32Array([
      -1,
      -1,
      0, //0
      -1,
      1,
      0, //1
      1,
      1,
      0, //2
      1,
      -1,
      0, //3
    ]);
    this.setPositions(positionData);

    var uvData: Float32Array = new Float32Array([
      0,
      0, //0
      0,
      1, //1
      1,
      1, //2
      1,
      0, //3
    ]);
    this.setUV0(uvData);

    var indices: Uint16Array = new Uint16Array([0, 2, 1, 2, 0, 3]);
    this.setIndices(indices);
  }
}

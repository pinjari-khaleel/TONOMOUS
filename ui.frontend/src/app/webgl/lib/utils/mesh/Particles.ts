import Renderer from '../../renderer/render/Renderer';
import Mesh from '../../renderer/mesh/Mesh';

export default class Particles extends Mesh {
  constructor(renderer: Renderer, countX: number = 1, countY: number = 1) {
    super(renderer);

    var positionData: Float32Array = new Float32Array(countX * countY * 3);
    var i: number = 0;
    var invX: number = 1 / (countX - 1);
    var invY: number = 1 / (countY - 1);
    for (var y: number = 0; y < countY + 1; y++) {
      for (var x: number = 0; x < countX + 1; x++) {
        positionData[i++] = x * invX;
        positionData[i++] = y * invY;
        positionData[i++] = 0;
      }
    }
    this.setPositions(positionData);
  }
}

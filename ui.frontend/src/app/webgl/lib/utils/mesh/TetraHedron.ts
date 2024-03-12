import Mesh from '../../renderer/mesh/Mesh';
import Renderer from '../../renderer/render/Renderer';

/**
 * Created by johan on 6-4-2017.
 */

// TODO: create soft normal indexed version
export default class TetraHedron extends Mesh {
  constructor(renderer: Renderer, positionsOnly: boolean = false, storeData: boolean = false) {
    super(renderer);

    if (positionsOnly) {
      this.positionsOnly(storeData);
    } else {
      this.hardNormals(storeData);
    }
  }

  private hardNormals(storeData: boolean) {
    const positionData: Float32Array = new Float32Array([
      0,
      0.5774000287055969,
      0.8165000081062317,
      0.8165000081062317,
      -0.5774000287055969,
      -0,
      0,
      0.5774000287055969,
      -0.8165000081062317,
      0.8165000081062317,
      -0.5774000287055969,
      -0,
      -0.8165000081062317,
      -0.5774000287055969,
      -0,
      0,
      0.5774000287055969,
      -0.8165000081062317,
      -0.8165000081062317,
      -0.5774000287055969,
      -0,
      0,
      0.5774000287055969,
      0.8165000081062317,
      0,
      0.5774000287055969,
      -0.8165000081062317,
      -0.8165000081062317,
      -0.5774000287055969,
      -0,
      0.8165000081062317,
      -0.5774000287055969,
      -0,
      0,
      0.5774000287055969,
      0.8165000081062317,
    ]);
    const normalData: Float32Array = new Float32Array([
      0.8165000081062317,
      0.5774000287055969,
      -0,
      0.8165000081062317,
      0.5774000287055969,
      -0,
      0.8165000081062317,
      0.5774000287055969,
      -0,
      0,
      -0.5774000287055969,
      -0.8165000081062317,
      0,
      -0.5774000287055969,
      -0.8165000081062317,
      0,
      -0.5774000287055969,
      -0.8165000081062317,
      -0.8165000081062317,
      0.5774000287055969,
      -0,
      -0.8165000081062317,
      0.5774000287055969,
      -0,
      -0.8165000081062317,
      0.5774000287055969,
      -0,
      -0,
      -0.5774000287055969,
      0.8165000081062317,
      -0,
      -0.5774000287055969,
      0.8165000081062317,
      -0,
      -0.5774000287055969,
      0.8165000081062317,
    ]);
    const uvData: Float32Array = new Float32Array([
      -0.5,
      0.5,
      0,
      -0.5,
      0.5,
      0.5,
      -0.5,
      0.5,
      -0.5,
      -0.5,
      0.5,
      0,
      0,
      -0.5,
      -0.5,
      0.5,
      0.5,
      0.5,
      -0.5,
      -0.5,
      -0.5,
      0.5,
      0.5,
      0,
    ]);

    this.setPositions(positionData, storeData);
    this.setNormals(normalData, storeData);
    this.setUV0(uvData, storeData);
  }

  private positionsOnly(storeData: boolean) {
    const s2 = 1 / Math.sqrt(2);
    const positionData: Float32Array = new Float32Array([
      -1,
      0,
      -s2,
      1,
      0,
      -s2,
      0,
      -1,
      s2,
      0,
      1,
      s2,
    ]);
    this.setPositions(positionData, storeData);

    const indices = new Uint16Array([1, 0, 3, 0, 2, 3, 3, 2, 1, 0, 1, 2]);

    this.setIndices(indices);
  }
}

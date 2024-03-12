import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Delatin from 'mediamonks-webgl/utils/mesh/Delatin';

export default class HeightMap extends Mesh {
  private delatin: Delatin;

  constructor(renderer: Renderer, heightMap: Texture2D, error: number = 0.01) {
    super(renderer);

    const floatData = this.unPack16(<Uint8Array>heightMap.getData());

    this.delatin = new Delatin(floatData, heightMap.width, heightMap.height);
    this.delatin.run(error);

    const positions = new Float32Array(this.delatin.coords);
    const positions3d = this.normalize(positions, heightMap.width, heightMap.height);

    this.setPositions(positions3d);
    const vertexCount = positions3d.length / 3;

    if (vertexCount < Math.pow(2, 16)) {
      this.setIndices(new Uint16Array(this.delatin.triangles));
    } else {
      this.setIndices32(new Uint32Array(this.delatin.triangles));
    }
  }

  private unPack16(data: Uint8Array): Float32Array {
    const l = data.length / 4;
    let floatHeight = new Float32Array(l);
    let ii = 0;
    for (let i = 0; i < l; i++) {
      floatHeight[i] = (data[ii++] * 256 + data[ii++]) / 65535;
      ii++;
      ii++;
    }
    return floatHeight;
  }

  private normalize(data: Float32Array, width: number, height: number): Float32Array {
    const l = data.length / 2;
    let ii = 0;
    let positions = new Float32Array(l * 3);
    for (let i = 0; i < l; i++) {
      const x = data[ii++];
      const y = data[ii++];
      positions[i * 3] = (x / (width - 1)) * 2 - 1;
      positions[i * 3 + 1] = this.delatin.heightAt(x, y);
      positions[i * 3 + 2] = (y / (height - 1)) * 2 - 1;
    }
    return positions;
  }
}

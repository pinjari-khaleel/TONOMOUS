/**
 * Created by johan on 22-6-2016.
 */
import Renderer from '../../renderer/render/Renderer';
import Mesh from '../../renderer/mesh/Mesh';

class QuadParticles extends Mesh {
  constructor(renderer: Renderer, spriteCount: number = 1000) {
    super(renderer);

    var vertexCount = spriteCount * 4;
    var index: Float32Array = new Float32Array(vertexCount);
    var offsets: Float32Array = new Float32Array(vertexCount * 2);
    var randoms: Float32Array = new Float32Array(vertexCount * 2);

    var ci: number = 0;
    var oi: number = 0;
    var ri: number = 0;

    for (var i: number = 0; i < spriteCount; i++) {
      var rx: number = Math.random() * 2 - 1;
      var ry: number = Math.random() * 2 - 1;

      for (var j: number = 0; j < 4; j++) {
        index[ci++] = i;

        randoms[ri++] = rx;
        randoms[ri++] = ry;
      }

      offsets[oi++] = -1;
      offsets[oi++] = -1;

      offsets[oi++] = -1;
      offsets[oi++] = 1;

      offsets[oi++] = 1;
      offsets[oi++] = 1;

      offsets[oi++] = 1;
      offsets[oi++] = -1;
    }

    var indices: number[] = [];
    var ii: number = 0;
    for (var i: number = 0; i < spriteCount; i++) {
      indices[ii++] = i * 4 + 0;
      indices[ii++] = i * 4 + 1;
      indices[ii++] = i * 4 + 2;

      indices[ii++] = i * 4 + 2;
      indices[ii++] = i * 4 + 3;
      indices[ii++] = i * 4 + 0;
    }

    this.setAttribute('aIndex', 1, index);
    this.setAttribute('aOffset', 2, offsets);
    this.setAttribute('aRandom', 2, randoms);

    if (vertexCount < Math.pow(2, 16)) {
      this.setIndices(new Uint16Array(indices));
    } else {
      this.setIndices32(new Uint32Array(indices));
    }
  }

  /*constructor(renderer:Renderer, countX:number = 64, countY:number = 64) {
		super(renderer);
		var vertexCount:number = countX * countY;

		//var positionData:Float32Array = new Float32Array(countX * countY * 3);
		var centers:Float32Array = new Float32Array(vertexCount * 2);
		var offsets:Float32Array = new Float32Array(vertexCount * 2);
		var randoms:Float32Array = new Float32Array(vertexCount * 2);

		var ci:number = 0;
		var oi:number = 0;
		var ri:number = 0;

		var invX:number = 1 / (countX - 1);
		var invY:number = 1 / (countY - 1);
		for (var y:number = 0; y < countY; y++) {
			for (var x:number = 0; x < countX; x++) {

				var rx:number = Math.random();
				var ry:number = Math.random();

				for (var i:number = 0; i < 4; i++) {
					centers[ci++] = x * invX;
					centers[ci++] = y * invY;

					randoms[ri++] = rx;
					randoms[ri++] = ry;
				}

				offsets[oi++] = -1;
				offsets[oi++] = -1;

				offsets[oi++] = -1;
				offsets[oi++] = 1;

				offsets[oi++] = 1;
				offsets[oi++] = 1;

				offsets[oi++] = 1;
				offsets[oi++] = -1;

				//positionData[i++] = x * invX;
				//positionData[i++] = y * invY;
			}
		}

		var indices:Uint16Array = new Uint16Array(vertexCount * 6);
		var ii:number = 0;
		for (var i:number = 0; i < vertexCount; i++) {
			indices[ii++] = i * 4 + 0;
			indices[ii++] = i * 4 + 1;
			indices[ii++] = i * 4 + 2;

			indices[ii++] = i * 4 + 2;
			indices[ii++] = i * 4 + 3;
			indices[ii++] = i * 4 + 0;
		}


		//this.setPositions(positionData);
		this.setAttribute("aCenter", 2, centers);
		this.setAttribute("aOffset", 2, offsets);
		this.setAttribute("aRandom", 2, randoms);
		this.setIndices(indices);
	}*/
}
export default QuadParticles;

import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';

export default class PlaneTerrain extends Mesh {
  constructor(
    renderer: Renderer,
    segmentsX: number = 1,
    segmentsY: number = 1,
    yUp: boolean = true,
  ) {
    super(renderer);

    this.createPlane(segmentsX, segmentsY, yUp);
  }

  private createPlane(segmentsX: number = 1, segmentsY: number = 1, yUp: boolean = true) {
    var vertexCount: number = (segmentsX + 1) * (segmentsY + 1) + segmentsX * segmentsY;
    var positionData: Float32Array = new Float32Array(vertexCount * 3);
    var uvData: Float32Array = new Float32Array(vertexCount * 2);
    var normalsData: Float32Array = new Float32Array(vertexCount * 3);

    var i: number = 0;
    var iUV: number = 0;
    var iNormal: number = 0;

    for (var y: number = 0; y < segmentsY + 1; y++) {
      for (var x: number = 0; x < segmentsX + 1; x++) {
        positionData[i++] = -1 + (x / segmentsX) * 2;
        positionData[i++] = 0;
        positionData[i++] = -1 + (y / segmentsY) * 2;

        uvData[iUV++] = x / segmentsX;
        uvData[iUV++] = y / segmentsY;

        if (yUp) {
          normalsData[iNormal++] = 0;
          normalsData[iNormal++] = 1;
          normalsData[iNormal++] = 0;
        } else {
          normalsData[iNormal++] = 0;
          normalsData[iNormal++] = 0;
          normalsData[iNormal++] = 1;
        }

        if (x < segmentsX && y < segmentsY) {
          positionData[i++] = -1 + ((x + 0.5) / segmentsX) * 2;
          positionData[i++] = 0;
          positionData[i++] = -1 + ((y + 0.5) / segmentsY) * 2;

          uvData[iUV++] = (x + 0.5) / segmentsX;
          uvData[iUV++] = (y + 0.5) / segmentsY;

          if (yUp) {
            normalsData[iNormal++] = 0;
            normalsData[iNormal++] = 1;
            normalsData[iNormal++] = 0;
          } else {
            normalsData[iNormal++] = 0;
            normalsData[iNormal++] = 0;
            normalsData[iNormal++] = 1;
          }
        }
      }
    }

    this.setPositions(positionData);
    this.setUV0(uvData);
    this.setNormals(normalsData);

    var triCount: number = segmentsX * segmentsY * 4;
    var indices: Uint16Array = new Uint16Array(triCount * 3);

    i = 0;
    for (var y: number = 0; y < segmentsY; y++) {
      for (var x: number = 0; x < segmentsX; x++) {
        var yOffset = y * (segmentsX + segmentsX + 1);
        var yOffsetN = (y + 1) * (segmentsX + segmentsX + 1);
        var xTimes2 = x * 2;
        var xStepN = y < segmentsY - 1 ? 2 : 1;

        indices[i++] = yOffset + xTimes2;
        indices[i++] = yOffset + xTimes2 + 2;
        indices[i++] = yOffset + xTimes2 + 1;

        indices[i++] = yOffset + xTimes2 + 2;
        indices[i++] = yOffsetN + xStepN * (x + 1);
        indices[i++] = yOffset + xTimes2 + 1;

        indices[i++] = yOffsetN + xStepN * (x + 1);
        indices[i++] = yOffsetN + xStepN * x;
        indices[i++] = yOffset + xTimes2 + 1;

        indices[i++] = yOffsetN + xStepN * x;
        indices[i++] = yOffset + xTimes2;
        indices[i++] = yOffset + xTimes2 + 1;
      }
    }

    this.setIndices(indices);
  }
}

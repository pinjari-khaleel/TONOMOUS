import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';

export default class Torus extends Mesh {
  constructor(
    renderer: Renderer,
    outerResolution: number = 24,
    innerResolution: number = 2,
    outerRadius: number = 1,
    innerRadius: number = 0.5,
  ) {
    super(renderer);

    const vertexCount: number = outerResolution * innerResolution;
    const positionData: Float32Array = new Float32Array(vertexCount * 3);
    const uvData: Float32Array = new Float32Array(vertexCount * 2);
    const normalsData: Float32Array = new Float32Array(vertexCount * 3);
    const tangentsData: Float32Array = new Float32Array(vertexCount * 4);

    var i: number = 0;
    var iUV: number = 0;
    var iNormal: number = 0;
    var iTangent: number = 0;

    // var circumference = 2 * radius * Math.PI;
    for (let j = 0; j < outerResolution; j++) {
      var progressCircle = j / (outerResolution - 1);
      var radiansOuter = progressCircle * 2 * Math.PI;

      var posOffset = new Vector3(
        Math.cos(radiansOuter) * outerRadius,
        0,
        Math.sin(radiansOuter) * outerRadius,
      );

      // this.createRing(posOffset, radiansOuter, i, iNormal, innerRadius, innerResolution, positionData, normalsData);

      for (let r = 0; r < innerResolution; r++) {
        var progress = r / (innerResolution - 1);
        var radians = progress * 2 * Math.PI;

        var pos = new Vector3(Math.cos(radians) * innerRadius, Math.sin(radians) * innerRadius, 0);
        // var rot = new Quaternion();
        //Quaternion.fromEuler(rot,0,progress * 360, 0);

        //  pos = pos.rotateY(pos, radiansOuter);

        // var normal = pos.clone();
        // normal = normal.normalize();
        normalsData[iNormal++] = pos.x;
        normalsData[iNormal++] = pos.y;
        normalsData[iNormal++] = pos.z;

        pos = pos.add(posOffset);
        positionData[i++] = pos.x;
        positionData[i++] = pos.y;
        positionData[i++] = pos.z;
      }
    }

    this.setPositions(positionData);
    this.setUV0(uvData);
    this.setNormals(normalsData);

    const triCount: number = outerResolution * ((innerResolution - 1) * 2);
    const indices: Uint16Array = new Uint16Array(triCount * 3);

    i = 0;

    for (let j: number = 0; j < outerResolution - 1; j++) {
      for (let k: number = 0; k < innerResolution - 1; k++) {
        var indexBase = j * innerResolution + k;

        indices[i++] = indexBase;
        indices[i++] = indexBase + 1;
        indices[i++] = indexBase + 1 + innerResolution;

        indices[i++] = indexBase;
        indices[i++] = indexBase + 1 + innerResolution;
        indices[i++] = indexBase + innerResolution;
      }
    }

    this.setIndices(indices);
  }

  private createRing(
    ringPos: Vector3,
    ringRot: number,
    i: number,
    iNormal: number,
    radius: number,
    resolution: number,
    positionDataRef: Float32Array,
    normalsDataRef: Float32Array,
  ): void {
    for (let r = 0; r < resolution; r++) {
      var progress = r / (resolution - 1);
      var radians = progress * 2 * Math.PI;

      var pos = new Vector3(Math.cos(radians) * radius, Math.sin(radians) * radius, 0);

      //pos = pos.rotateY(pos, ringRot);

      var normal = pos.clone();
      normal = normal.normalize();
      normalsDataRef[iNormal++] = pos.x;
      normalsDataRef[iNormal++] = pos.y;
      normalsDataRef[iNormal++] = pos.z;

      pos = pos.add(ringPos);
      positionDataRef[i++] = pos.x;
      positionDataRef[i++] = pos.y;
      positionDataRef[i++] = pos.z;
    }
  }
}

import Mesh from '../../renderer/mesh/Mesh';
import Vector3 from '../../renderer/math/Vector3';
import Vector2 from '../../renderer/math/Vector2';
import AttributeChannel from '../../renderer/mesh/AttributeChannel';
import VertexAttribute from '../../renderer/mesh/VertexAttribute';
import LogGL from '../../renderer/core/LogGL';
import Vector4 from '../../renderer/math/Vector4';
import AABox from '../../renderer/math/AABox';

export default class MeshUtils {
  public static toFloat32ArrayVec2(data: Vector2[]): Float32Array {
    const l: number = data.length;
    const floatArray: Float32Array = new Float32Array(l * 2);
    let ii: number = 0;

    for (let i = 0; i < l; i++) {
      floatArray[ii++] = data[i].x;
      floatArray[ii++] = data[i].y;
    }
    return floatArray;
  }

  public static toFloat32Array(data: Vector3[]): Float32Array {
    const l: number = data.length;
    const floatArray: Float32Array = new Float32Array(l * 3);
    let ii: number = 0;

    for (let i = 0; i < l; i++) {
      floatArray[ii++] = data[i].x;
      floatArray[ii++] = data[i].y;
      floatArray[ii++] = data[i].z;
    }
    return floatArray;
  }

  public static toFloat32ArrayVec4(data: Vector4[]): Float32Array {
    const l: number = data.length;
    const floatArray: Float32Array = new Float32Array(l * 4);
    let ii: number = 0;

    for (let i = 0; i < l; i++) {
      floatArray[ii++] = data[i].x;
      floatArray[ii++] = data[i].y;
      floatArray[ii++] = data[i].z;
      floatArray[ii++] = data[i].w;
    }
    return floatArray;
  }

  public static toVector2Array(data: Float32Array): Vector2[] {
    const l: number = data.length / 2;
    const vectorArray: Vector2[] = [];
    let ii: number = 0;

    for (let i = 0; i < l; i++) {
      vectorArray.push(new Vector2(data[ii++], data[ii++]));
    }
    return vectorArray;
  }

  public static toVector3Array(data: Float32Array): Vector3[] {
    const l: number = data.length / 3;
    const vectorArray: Vector3[] = [];
    let ii: number = 0;

    for (let i = 0; i < l; i++) {
      vectorArray.push(new Vector3(data[ii++], data[ii++], data[ii++]));
    }
    return vectorArray;
  }

  // NOTE(Joey): calculates the absolute local width and height of the mesh
  public static getLocalDimensions(mesh: Mesh): Vector3 {
    const size: Vector3 = new Vector3(0.0, 0.0, 0.0);

    const data = mesh.getData('aPos');
    if (!data) {
      throw new ReferenceError('Could not get local dimensions: mesh data not found');
    }

    for (let i: number = 0; i < mesh.getNumVertices() * 3; i += 3) {
      if (Math.abs(data[i]) > size.x) {
        size.x = Math.abs(data[i]);
      }
      if (Math.abs(data[i + 1]) > size.y) {
        size.y = Math.abs(data[i + 1]);
      }
      if (Math.abs(data[i + 2]) > size.z) {
        size.z = Math.abs(data[i + 2]);
      }
    }
    return size;
  }

  //this can be very slow for meshes with a high vertex count
  public static makeIndexed(mesh: Mesh) {
    LogGL.log('makeIndexed ', mesh.attributes);

    const oldCount: number = mesh.getNumVertices();

    let interleavedStrideSum = 0;
    for (let i: number = 0; i < mesh.attributes.length; i++) {
      interleavedStrideSum += mesh.attributes[i].stride;
    }

    let index: number = 0;
    let n = mesh.getNumVertices();
    let data = new Float32Array(interleavedStrideSum * n);

    const tmpIndices: number[] = [];

    const tempBuffer = new Float32Array(interleavedStrideSum);

    for (let i: number = 0; i < n; i++) {
      let tmpIndex = 0;

      for (let j: number = 0; j < mesh.attributes.length; j++) {
        const attribute = mesh.attributes[j];
        for (let k: number = 0; k < attribute.stride; k++) {
          tempBuffer[tmpIndex++] = (<Float32Array>attribute.data)[i * attribute.stride + k];
        }
      }

      // check if tempBuffer is in data
      const vertexIndex = MeshUtils.getIndexOfSubBuffer(
        data,
        tempBuffer,
        index / interleavedStrideSum,
      );
      if (vertexIndex >= 0) {
        tmpIndices[i] = vertexIndex;
      } else {
        tmpIndices[i] = index / interleavedStrideSum;
        for (let k: number = 0; k < interleavedStrideSum; k++) {
          data[index++] = tempBuffer[k];
        }
      }
    }

    n = index / interleavedStrideSum;
    if (n < Math.pow(2, 16)) {
      mesh.setIndices(new Uint16Array(tmpIndices));
    } else {
      mesh.setIndices32(new Uint32Array(tmpIndices));
    }

    data = new Float32Array(data.buffer, 0, index);

    //-----------------------------------------

    //split the interleaved array into attributes and set them on the mesh
    const attributesData: Float32Array[] = [];
    index = 0;

    for (let i: number = 0; i < mesh.attributes.length; i++) {
      attributesData[i] = new Float32Array(n * mesh.attributes[i].stride);
    }

    for (let i: number = 0; i < n; i++) {
      for (let j: number = 0; j < mesh.attributes.length; j++) {
        const s = mesh.attributes[j].stride;
        for (let k: number = 0; k < s; k++) {
          attributesData[j][i * s + k] = data[index++];
        }
      }
    }
    for (let i: number = 0; i < mesh.attributes.length; i++) {
      mesh.setAttribute(
        mesh.attributes[i].name,
        mesh.attributes[i].stride,
        attributesData[i],
        true,
      );
    }

    LogGL.log('generated indices, reduced amount of vertices from ' + oldCount + ' to ' + n);
  }

  private static getIndexOfSubBuffer(
    src: Float32Array,
    buffer: Float32Array,
    maxIndex: number,
  ): number {
    const n = buffer.length;
    for (let i = 0; i < maxIndex; i++) {
      let found = true;
      for (let j = 0; j < n; j++) {
        if (buffer[j] != src[n * i + j]) {
          found = false;
          break;
        }
      }
      if (found) {
        return i;
      }
    }
    return -1;
  }

  public static addTangents(mesh: Mesh, storeData: boolean = false): boolean {
    if (mesh.getAttribute(AttributeChannel.TANGENT.name)) return false;
    let uvs = mesh.getUV0();
    // if(!uvData)uvData = mesh.getUV0();
    let normals = mesh.getNormals();
    let positions = mesh.getPositions();
    let indices = mesh.indices;

    if (uvs == null) return false;
    if (positions == null) return false;
    if (indices == null) return false;
    if (normals == null) return false;

    let nVertices = positions.length / 3;
    let tangents = new Float32Array(nVertices * 4);

    let tan1 = new Float32Array(nVertices * 3);
    let tan2 = new Float32Array(nVertices * 3);
    let l0: number = 0;
    let tangentNANs: number = 0;
    let tNAN: number = 0;
    let rNAN: number = 0;
    let sdir = new Float32Array(3);
    let tdir = new Float32Array(3);

    function handleTriangle(a: number, b: number, c: number) {
      if (positions == null) return;
      if (uvs == null) return;
      let x1 = positions[b * 3] - positions[a * 3];
      let x2 = positions[c * 3] - positions[a * 3];
      let y1 = positions[b * 3 + 1] - positions[a * 3 + 1];
      let y2 = positions[c * 3 + 1] - positions[a * 3 + 1];
      let z1 = positions[b * 3 + 2] - positions[a * 3 + 2];
      let z2 = positions[c * 3 + 2] - positions[a * 3 + 2];
      let s1 = uvs[b * 2] - uvs[a * 2];
      let s2 = uvs[c * 2] - uvs[a * 2];
      let t1 = uvs[b * 2 + 1] - uvs[a * 2 + 1];
      let t2 = uvs[c * 2 + 1] - uvs[a * 2 + 1];

      let r = 1.0 / (s1 * t2 - s2 * t1);

      //this happens a lot
      if (isNaN(r) || !r || !isFinite(r)) {
        rNAN++;
        r = 1;
      }
      sdir[0] = (t2 * x1 - t1 * x2) * r;
      sdir[1] = (t2 * y1 - t1 * y2) * r;
      sdir[2] = (t2 * z1 - t1 * z2) * r;

      tdir[0] = (s1 * x2 - s2 * x1) * r;
      tdir[1] = (s1 * y2 - s2 * y1) * r;
      tdir[2] = (s1 * z2 - s2 * z1) * r;

      for (let k = 0; k < 3; ++k) {
        tan1[a * 3 + k] += sdir[k];
        tan1[b * 3 + k] += sdir[k];
        tan1[c * 3 + k] += sdir[k];

        tan2[a * 3 + k] += tdir[k];
        tan2[b * 3 + k] += tdir[k];
        tan2[c * 3 + k] += tdir[k];
      }
    }

    let l = indices.length;
    for (let j = 0; j < l; j += 3) {
      handleTriangle(indices[j], indices[j + 1], indices[j + 2]);
    }

    let tmp = new Vector3();
    let tmp2 = new Vector3();
    let n = new Vector3();
    let n2 = new Vector3();
    let w: number;
    let t: Vector3 = new Vector3();
    let t2: Vector3 = new Vector3();
    let test: number;

    function handleVertex(v: number) {
      if (normals == null) return;
      n.setValues(normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]);
      n2.copy(n);

      t.setValues(tan1[v * 3], tan1[v * 3 + 1], tan1[v * 3 + 2]);
      // Gram-Schmidt orthogonalize

      tmp.copy(t);
      if (isNaN(tmp.x)) {
        tNAN++;
        tmp.setValues(1, 0, 0);
      }

      let nDotT = Vector3.dot(n, t);
      n.multiplyScalar(nDotT);
      tmp = Vector3.subtract(tmp, n);

      let l = tmp.length();
      if (l == 0) {
        tmp.setValues(1, 0, 0);
        l0++;
      } else {
        tmp.multiplyScalar(1 / l);
      }

      if (isNaN(tmp.x)) {
        tmp.setValues(1, 0, 0);
        tangentNANs++;
      }
      // Calculate handedness

      t2.setValues(tan2[v * 3], tan2[v * 3 + 1], tan2[v * 3 + 2]);
      test = Vector3.dot(Vector3.cross(n2, t), t2);

      //flipped compared to three.js (to be in line with unity)
      w = test < 0.0 ? 1.0 : -1.0;

      tangents[v * 4] = tmp.x;
      tangents[v * 4 + 1] = tmp.y;
      tangents[v * 4 + 2] = tmp.z;
      tangents[v * 4 + 3] = w;
    }

    for (let j = 0; j < l; j += 3) {
      handleVertex(indices[j + 0]);
      handleVertex(indices[j + 1]);
      handleVertex(indices[j + 2]);
    }

    mesh.setAttribute(
      AttributeChannel.TANGENT.name,
      AttributeChannel.TANGENT.stride,
      tangents,
      storeData,
    );

    /*	if (rNAN > 0 || tNAN > 0 || l0 > 0 || tangentNANs > 0)
		console.error('rNAN', rNAN, 'tNAN', tNAN, 'l0', l0, 'tangentNANs', tangentNANs);*/

    return true;
  }

  public static generateNormals(mesh: Mesh) {
    const positionData = mesh.getPositions();
    if (!positionData) {
      throw new ReferenceError(
        'MeshUtils.generateNormals: failed getting positions data on ' + mesh.name,
      );
    }
    const positions: Vector3[] = MeshUtils.toVector3Array(positionData);
    const normals: Vector3[] = MeshUtils.toVector3Array(new Float32Array(positionData.length));
    let indices = mesh.indices;

    if (!indices) {
      indices = new Uint16Array(positions.map((p, i) => i));
    }

    const vertexCount: number = normals.length;
    const triangleCount: number = indices.length / 3;

    for (let i = 0; i < triangleCount; i++) {
      const i1 = indices[i * 3 + 0];
      const i2 = indices[i * 3 + 1];
      const i3 = indices[i * 3 + 2];

      const v1: Vector3 = positions[i1];
      const v2: Vector3 = positions[i2];
      const v3: Vector3 = positions[i3];

      const normal = Vector3.cross(
        v2.clone().subtract(v1).normalize(),
        v3.clone().subtract(v1).normalize(),
      ).normalize();
      normals[i1].add(normal);
      normals[i2].add(normal);
      normals[i3].add(normal);
    }

    for (let i = 0; i < vertexCount; i++) {
      normals[i].normalize();
    }

    mesh.setNormals(MeshUtils.toFloat32Array(normals));
  }

  public static flipWinding(mesh: Mesh) {
    let indices = mesh.indices;

    if (!indices) {
      const n = mesh.getNumVertices();
      indices = new Uint16Array(n);
      for (let i = 0; i < n; i++) indices[i] = i;
    }
    const triangleCount: number = indices.length / 3;
    for (let i = 0; i < triangleCount; i++) {
      const i0 = indices[i * 3];
      indices[i * 3] = indices[i * 3 + 1];
      indices[i * 3 + 1] = i0;
    }
    mesh.setIndices(<Uint16Array>indices);
  }

  public static flipNormals(mesh: Mesh) {
    const normalData = mesh.getNormals();
    if (normalData) {
      const normals: Vector3[] = MeshUtils.toVector3Array(normalData);
      for (const n of normals) {
        n.multiplyScalar(-1);
      }
      mesh.setNormals(MeshUtils.toFloat32Array(normals));
    }
  }

  public static flipNormalsIfNeeded(mesh: Mesh) {
    const positionData = mesh.getPositions();
    const normalData = mesh.getNormals();
    if (!positionData) {
      throw new ReferenceError(
        'MeshUtils.flipNormalsIfNeeded: failed getting positions data on ' + mesh.name,
      );
    }
    if (!normalData) {
      throw new ReferenceError(
        'MeshUtils.flipNormalsIfNeeded: failed getting normals on ' + mesh.name,
      );
    }
    const positions: Vector3[] = MeshUtils.toVector3Array(positionData);
    const normals: Vector3[] = MeshUtils.toVector3Array(normalData);
    let indices = mesh.indices;

    if (!indices) {
      indices = new Uint16Array(positions.map((p, i) => i));
    }

    const triangleCount: number = indices.length / 3;

    for (let i = 0; i < triangleCount; i++) {
      const i1 = indices[i * 3 + 0];
      const i2 = indices[i * 3 + 1];
      const i3 = indices[i * 3 + 2];

      const v1: Vector3 = positions[i1];
      const v2: Vector3 = positions[i2];
      const v3: Vector3 = positions[i3];

      const normal = Vector3.cross(
        v2.clone().subtract(v1).normalize(),
        v3.clone().subtract(v1).normalize(),
      ).normalize();
      if (Vector3.dot(normal, normals[i * 3 + 0]) < 0) normals[i * 3 + 0].negate();
      if (Vector3.dot(normal, normals[i * 3 + 1]) < 0) normals[i * 3 + 1].negate();
      if (Vector3.dot(normal, normals[i * 3 + 2]) < 0) normals[i * 3 + 2].negate();
    }

    mesh.setNormals(MeshUtils.toFloat32Array(normals));
  }

  public static getElementCenter(mesh: Mesh): Vector3 {
    const d = mesh.getPositions();
    const l: number = mesh.getNumVertices();
    const sum = new Vector3();

    if (!d) {
      throw new ReferenceError('Cannot get element center: positions not defined on mesh');
    }

    for (let i = 0; i < l; i++) {
      sum.x += d[i * 3];
      sum.y += d[i * 3 + 1];
      sum.z += d[i * 3 + 2];
    }

    sum.multiplyScalar(1 / l);
    return sum;
  }

  public static getBoundingBox(mesh: Mesh): AABox {
    const d = mesh.getPositions();
    const l: number = mesh.getNumVertices();
    const box = new AABox();

    if (!d) {
      throw new ReferenceError('Cannot get mesh bounding box: positions not defined on mesh');
    }

    for (let i = 0; i < l; i++) {
      box.expandWithPoint(new Vector3(d[i * 3], d[i * 3 + 1], d[i * 3 + 2]));
    }

    return box;
  }

  public static addBaryCentricCoords(mesh: Mesh): void {
    const indices = mesh.indices;
    if (indices) {
      for (let i: number = 0; i < mesh.attributes.length; i++) {
        const attribute: VertexAttribute = mesh.attributes[i];
        const nonIndexed = MeshUtils.getNonIndexed(
          <Float32Array>attribute.data,
          indices,
          attribute.stride,
        );
        //attribute.setData(nonIndexed, false);
        mesh.setAttribute(attribute.name, attribute.stride, nonIndexed);
      }
      delete mesh.indices;
    }
    const triCount = mesh.getNumVertices() / 3;
    const barycentricData = new Float32Array(triCount * 9);
    let ii = 0;
    for (let i: number = 0; i < triCount; i++) {
      barycentricData[ii++] = 1;
      barycentricData[ii++] = 0;
      barycentricData[ii++] = 0;

      barycentricData[ii++] = 0;
      barycentricData[ii++] = 1;
      barycentricData[ii++] = 0;

      barycentricData[ii++] = 0;
      barycentricData[ii++] = 0;
      barycentricData[ii++] = 1;
    }
    mesh.setAttribute('aBarycentric', 3, barycentricData);
  }

  public static getNonIndexed(
    indexed: Float32Array,
    indices: Uint16Array | Uint32Array,
    stride: number,
  ): Float32Array {
    console.log(arguments);
    let vertexCount = indices.length;
    const out = new Float32Array(vertexCount * stride);
    let ii = 0;
    for (let i: number = 0; i < vertexCount; i++) {
      const index = indices[i];
      for (let j: number = 0; j < stride; j++) {
        out[ii++] = indexed[index * stride + j];
      }
    }
    return out;
  }
}

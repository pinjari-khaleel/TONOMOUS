import Mesh from '../../renderer/mesh/Mesh';
import Vector3 from '../../renderer/math/Vector3';
import AttributeChannel from '../../renderer/mesh/AttributeChannel';
import Transform from '../../renderer/core/Transform';
import Vector4 from '../../renderer/math/Vector4';

export default class MeshMerger {
  public static merge(
    //can pass an array with only 1 mesh
    meshes: Mesh[],
    transforms: Transform[],
    lightMapOffsets: Vector4[] | null = null,
    addIndexAttribute: boolean = false,
  ): Mesh {
    if (meshes.length < 1) console.error('getMergedMesh: mesh count should be more than 0');
    if (transforms.length < meshes.length)
      console.error('getMergedMesh: transform count should be more than or equal to mesh count');
    if (meshes.length > 1 && transforms.length != meshes.length)
      console.error(
        'getMergedMesh: transform count should be equal to mesh count when mesh count is > 1',
      );
    if (lightMapOffsets && lightMapOffsets.length != transforms.length)
      console.error('getMergedMesh: lightMapOffsets count should be equal to transform count');

    while (meshes.length < transforms.length) {
      meshes.push(meshes[0]);
    }

    const mergedMesh = new Mesh(meshes[0].renderer);
    const mergedAttributes: Float32Array[] = [];

    let vertexCount = 0;
    const allAttributes: string[] = [];
    const strides: number[] = [];
    const objectCount = transforms.length;

    for (let mesh of meshes) {
      vertexCount += mesh.getNumVertices();
      for (let attribute of mesh.attributes) {
        if (!(allAttributes.indexOf(attribute.name) >= 0)) {
          allAttributes.push(attribute.name);
          strides.push(attribute.stride);
        }
      }
    }

    const offsets: number[] = [];
    for (let i: number = 0; i < allAttributes.length; i++) {
      offsets[i] = 0;
      mergedAttributes[i] = new Float32Array(vertexCount * strides[i]);
    }

    const indices = MeshMerger.getMergedIndices(meshes, transforms);
    if (indices instanceof Uint32Array) {
      if (!mergedMesh.renderer.isWebgl2 && !mergedMesh.renderer.extensionManager.element_index_uint)
        console.warn('mesh created with 32 bits indices but not supported');
      mergedMesh.setIndices32(<Uint32Array>indices);
    } else {
      mergedMesh.setIndices(<Uint16Array>indices);
    }

    const pos = new Vector3();
    let li = 0;

    for (let i: number = 0; i < objectCount; i++) {
      const mesh = meshes[i];
      const lightMapScaleOffset: Vector4 | null = lightMapOffsets ? lightMapOffsets[i] : null;
      const matrix = transforms[i].worldMatrix;
      const normalMatrix = transforms[i].rotationMatrixMat3;
      const n = mesh.getNumVertices();

      for (let j: number = 0; j < allAttributes.length; j++) {
        const attribute = mesh.getAttribute(allAttributes[j]);
        const mergedAttribute = mergedAttributes[j];
        let ii: number = offsets[j];
        const s = strides[j];
        if (!attribute) {
          ii += n * s;
        } else {
          const attributeData = <Float32Array>attribute.data;
          if (attribute.name == AttributeChannel.POSITION.name) {
            //transform position
            let ki = 0;
            for (let k: number = 0; k < n; k++) {
              pos.x = attributeData[ki++];
              pos.y = attributeData[ki++];
              pos.z = attributeData[ki++];

              pos.transform(matrix);

              mergedAttribute[ii++] = pos.x;
              mergedAttribute[ii++] = pos.y;
              mergedAttribute[ii++] = pos.z;
            }
          } else if (attribute.name == AttributeChannel.NORMAL.name) {
            let ki = 0;

            for (let k: number = 0; k < n; k++) {
              pos.x = attributeData[ki++];
              pos.y = attributeData[ki++];
              pos.z = attributeData[ki++];

              pos.transformMat3(normalMatrix);

              mergedAttribute[ii++] = pos.x;
              mergedAttribute[ii++] = pos.y;
              mergedAttribute[ii++] = pos.z;
            }
          } else {
            mergedAttribute.set(attributeData, ii);
            ii += n * s;
          }

          offsets[j] = ii;
          if (lightMapScaleOffset != null) {
            if (attribute.name == AttributeChannel.TEXCOORD1.name) {
              //create lightMap uvs
              let ki = 0;
              for (let k: number = 0; k < n; k++) {
                mergedAttribute[li++] =
                  attributeData[ki++] * lightMapScaleOffset.x + lightMapScaleOffset.z;
                mergedAttribute[li++] =
                  attributeData[ki++] * lightMapScaleOffset.y + lightMapScaleOffset.w;
              }
            }
          }
        }
      }
    }

    for (let i: number = 0; i < allAttributes.length; i++) {
      mergedMesh.setAttribute(allAttributes[i], strides[i], mergedAttributes[i]);
    }
    if (addIndexAttribute) {
      let ii = 0;
      const indexData = new Float32Array(vertexCount);
      for (let i: number = 0; i < objectCount; i++) {
        const n = meshes[i].getNumVertices();
        for (let j: number = 0; j < n; j++) {
          indexData[ii++] = i;
        }
      }
      mergedMesh.setAttribute('aIndex', 1, indexData);
    }

    return mergedMesh;
  }

  private static getMergedIndices(
    meshes: Mesh[],
    transforms: Transform[],
  ): Uint16Array | Uint32Array | null {
    if (meshes[0].indices) {
      let l = meshes.length;
      let indexCount: number = 0;
      let vertexCount: number = 0;
      for (let i: number = 0; i < l; i++) {
        if (meshes[i].indices === null) {
          throw new ReferenceError(
            'Cannot get merged indices: expected indices to be defined on none or all meshes',
          );
        }
        indexCount += (<Uint16Array | Uint32Array>meshes[i].indices).length;
        vertexCount += meshes[i].getNumVertices();
      }
      let indices: Uint16Array | Uint32Array =
        vertexCount >= 65536 ? new Uint32Array(indexCount) : new Uint16Array(indexCount);
      let ii = 0;
      let indexOffset: number = 0;

      for (let i: number = 0; i < l; i++) {
        let source = <Uint16Array | Uint32Array>meshes[i].indices;
        let il: number = (<Uint16Array | Uint32Array>source).length;
        //a parent can also have a negative scale
        const m = transforms[i].worldMatrix;
        const flipped = m.m[0] * m.m[5] * m.m[10];
        if (flipped > 0) {
          for (let j: number = 0; j < il; j++) {
            indices[ii++] = source[j] + indexOffset;
          }
        } else {
          //flip winding
          for (let j: number = 0; j < il / 3; j++) {
            indices[ii++] = source[j * 3 + 0] + indexOffset;
            indices[ii++] = source[j * 3 + 2] + indexOffset;
            indices[ii++] = source[j * 3 + 1] + indexOffset;
          }
        }

        indexOffset += meshes[i].getNumVertices();
      }
      return indices;
    }
    return null;
  }
}

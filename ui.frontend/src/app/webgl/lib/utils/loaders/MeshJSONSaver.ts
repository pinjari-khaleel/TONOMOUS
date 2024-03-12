import Mesh from '../../renderer/mesh/Mesh';
import VertexAttribute from '../../renderer/mesh/VertexAttribute';

export default class MeshJSONSaver {
  public static save(mesh: Mesh, name: string = 'mesh') {
    let obj: any = {};

    if (mesh.indices) {
      obj.indices = Array.from(mesh.indices);
    }

    let attributes: Array<any> = [];
    obj.atributes = attributes;
    for (let i = 0; i < mesh.attributes.length; i++) {
      let attribute: VertexAttribute = mesh.attributes[i];
      let attributeObject: any = {};
      attributeObject['name'] = attribute.name;
      attributeObject['stride'] = attribute.stride;
      attributeObject['data'] = Array.from(<Float32Array>attribute.data);
      attributes.push(attributeObject);
    }

    let jsonString = JSON.stringify(obj);
    let a = document.createElement('a');
    let file = new Blob([jsonString], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a['download'] = name + '.json';
    a.click();
  }
}

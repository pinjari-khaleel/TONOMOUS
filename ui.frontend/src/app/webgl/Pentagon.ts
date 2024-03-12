import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Texture2D from "mediamonks-webgl/renderer/texture/Texture2D";
import IWebGLDestructible from "mediamonks-webgl/renderer/core/IWebGLDestructible";

export default class Pentagon implements IWebGLDestructible {
  private mesh: Mesh;
  private renderer: Renderer;
  private material: MaterialLoader;
  private pointData: Float32Array = new Float32Array(10);
  private pointsSet: boolean = false;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    this.renderer = renderer;

    this.material = new MaterialLoader(renderer, preloader, 'pentagon');
    this.material.setDrawTypeTriangleFan();
    this.material.setCullingDisabled();
    this.material.depthWrite = false;
    this.material.depthTest = false

    this.mesh = this.createPentagon();

    const a = .5;
    let ii = 0;
    for(let i = 0; i < 5; i++){
      const phase = (i / 5) * Math.PI * 2;
      this.pointData[ii++] = Math.sin(phase) * a;
      this.pointData[ii++] = Math.cos(phase) * a;
    }
  }

  public createPentagon(): Mesh {
    const mesh = new Mesh(this.renderer);
    mesh.setAttribute('aIndex', 1, new Float32Array([0,1,2,3,4,5]));
    return mesh;
  }

  public init(paramGroup: ParamGroup): void {
  }

  //coords between 0 and 1. Update each frame
  public setPoints(points: ReadonlyArray<[number, number]>){
    if(points.length != 5){
      console.warn('Pentagon: 5 points should be passed');
      return;
    }
    let ii = 0;
    for(let i = 0; i < 5; i++){
      this.pointData[ii++] = points[i][0];
      this.pointData[ii++] = points[i][1];
    }
    this.material.setVector2Array('_Points', this.pointData);
    this.pointsSet = true;
  }

  public draw(texture:Texture2D): void {
    if(this.pointsSet) {
      this.material.setFloat('_SourceAspectRatio', texture.aspectRatio);
      this.material.setFloat('_AspectRatio', this.renderer.aspectRatio);
      this.material.setTexture('_Texture', texture);
      this.renderer.draw(this.mesh, this.material);
    }
  }

  public destruct(): void {
    this.material.destruct();
    this.mesh.destruct();
  }
}

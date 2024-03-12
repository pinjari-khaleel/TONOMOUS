export default class ShaderAttribute {
  public name: string;
  public stride: number;
  public loc: number;

  constructor(name: string, stride: number, loc: number) {
    this.name = name;
    this.stride = stride;
    this.loc = loc;
  }
}

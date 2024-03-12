export default class AttributeChannel {
  public static POSITION: AttributeChannel = new AttributeChannel('aPos', 3);
  public static TEXCOORD0: AttributeChannel = new AttributeChannel('aUV0', 2);
  public static TEXCOORD1: AttributeChannel = new AttributeChannel('aUV1', 2);
  public static NORMAL: AttributeChannel = new AttributeChannel('aNormal', 3);
  public static COLOR0: AttributeChannel = new AttributeChannel('aColor0', 3);
  public static COLOR1: AttributeChannel = new AttributeChannel('aColor1', 3);
  public static TANGENT: AttributeChannel = new AttributeChannel('aTangent', 4);

  public readonly name: string;
  public readonly stride: number;

  constructor(name: string, stride: number) {
    this.name = name;
    this.stride = stride;
  }
}

export default class Rect {
  public startX!: number;
  public startY!: number;
  public endX!: number;
  public endY!: number;

  constructor(startX: number = 0, startY: number = 0, endX: number = 1, endY: number = 1) {
    this.set(startX, startY, endX, endY);
  }

  public set(startX: number, startY: number, endX: number, endY: number): void {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }
}

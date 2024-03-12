export default interface IRenderTexture {
  scaleToCanvas: boolean;
  sizeMultiplier: number;
  width: number;
  height: number;

  setAsTarget(): void;

  setSize(width: number, height: number, depth?: number): void;

  hasDepth(): boolean;
}

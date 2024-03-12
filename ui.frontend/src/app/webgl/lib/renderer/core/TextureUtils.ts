import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class TextureUtils {
  public static getTempCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  public static flipX(
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  ): HTMLCanvasElement {
    const canvas = TextureUtils.getTempCanvas(image.width, image.height);
    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.transform(-1, 0, 0, 1, canvas.width, 0);
    context.drawImage(image, 0, 0);
    return canvas;
  }

  public static flipY(
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  ): HTMLCanvasElement {
    const canvas = TextureUtils.getTempCanvas(image.width, image.height);
    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.transform(1, 0, 0, -1, 0, canvas.height);
    context.drawImage(image, 0, 0);
    return canvas;
  }

  public static getSize(
    image: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  ): Vector2 {
    if (image instanceof HTMLVideoElement) {
      return new Vector2(image.videoWidth, image.videoHeight);
    } else if (image instanceof HTMLImageElement) {
      return new Vector2(image.naturalWidth, image.naturalHeight);
    } else {
      return new Vector2(image.width, image.height);
    }
  }

  public static resizeImage(
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    width: number,
    height: number,
  ): HTMLVideoElement | HTMLImageElement | HTMLCanvasElement {
    const size = TextureUtils.getSize(image);
    if (width === size.x && height === size.y) {
      return image;
    }
    const canvas = TextureUtils.getTempCanvas(width, height);
    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.drawImage(image, 0, 0, size.x, size.y, 0, 0, width, height);
    return canvas;
  }

  public static createDummyImage(
    width: number,
    height: number,
    text: string = '',
  ): HTMLCanvasElement {
    const canvas = TextureUtils.getTempCanvas(width, height);
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    ctx.fillStyle = '#eb7d24';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    for (let x = 0; x < width; x += 64) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 64) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.font = '30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(width + 'x' + height, 8, 32);
    if (text.length) {
      ctx.fillText(text, Math.max(0, width / 2 - 8 * text.length), height / 2 + 16);
    }
    return canvas;
  }

  public static checkImageFormatSupported(base64: string, callback: (supported: boolean) => void) {
    const img = new Image();
    img.onload = () => {
      callback(img.width > 0 && img.height > 0);
    };
    img.onerror = () => {
      callback(false);
    };
    try {
      img.src = base64;
    } catch (e) {
      callback(false);
    }
  }

  public static checkWebpSupported(callback: (supported: boolean) => void) {
    TextureUtils.checkImageFormatSupported(
      'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      callback,
    );
  }

  public static checkAvifSupported(callback: (supported: boolean) => void) {
    TextureUtils.checkImageFormatSupported(
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABMAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAABttZGF0EgAKBDgABokyCRAAAAAP+I9ngw==',
      callback,
    );
  }
}

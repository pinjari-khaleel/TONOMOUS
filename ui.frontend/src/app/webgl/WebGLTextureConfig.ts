const dataContext = require.context('./data/', true, /\.png|\.webp|\.mp4|\.jpg$/);

export function getStaticFilename(file: string): string {
  const fileName = dataContext(file);
  if (typeof fileName === 'string') return fileName;
  return fileName.default.src;
}

export default class WebGLTextureConfig {
  public static useWebp: boolean = true;

  public static getFileName(filename: string, transparent: boolean = false): string {
    const map = './';

    if (WebGLTextureConfig.useWebp) {
      return getStaticFilename(map + filename + '.webp');
    } else {
      if (transparent) {
        return getStaticFilename(map + filename + '.png');
      } else {
        return getStaticFilename(map + filename + '.jpg');
      }
    }
  }

  public static checkImageFormatSupported(base64: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      try {
        img.src = base64;
      } catch (e) {
        resolve(false);
      }
    });
  }

  public static checkWebpSupported(): Promise<boolean> {
    return WebGLTextureConfig.checkImageFormatSupported(
      'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    );
  }

  public static checkAvifSupported(): Promise<boolean> {
    return WebGLTextureConfig.checkImageFormatSupported(
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABMAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAABttZGF0EgAKBDgABokyCRAAAAAP+I9ngw==',
    );
  }
}

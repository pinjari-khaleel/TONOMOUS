import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import Renderer from '../../renderer/render/Renderer';
import RendererWebGL1 from '../../renderer/render/RendererWebGL1';
import RenderTexture from '../../renderer/texture/RenderTexture';
import Texture2D from '../../renderer/texture/Texture2D';
import TextureFormat from '../../renderer/texture/TextureFormat';

export default class ImageUtils {
  public static createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  // TODO: there should be a faster way
  public static textureToCanvas(texture: Texture2D, canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    const imgData: ImageData = ctx.createImageData(texture.width, texture.height);
    const data: Uint8Array | Float32Array = texture.getData();

    for (let i = 0; i < data.length; i++) {
      imgData.data[i] = data[i];
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  public static canvasToCanvas(
    source: HTMLCanvasElement | HTMLImageElement,
    destination: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const ctx = <CanvasRenderingContext2D>destination.getContext('2d');
    ctx.drawImage(source, 0, 0);
    return destination;
  }

  public static imageToCanvas(source: HTMLCanvasElement | HTMLImageElement): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = ImageUtils.createCanvas(source.width, source.height);
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    ctx.drawImage(source, 0, 0);
    return canvas;
  }

  public static getImageData(
    source: HTMLCanvasElement | HTMLImageElement,
    flipped: boolean = false,
  ): ImageData {
    const canvas = ImageUtils.createCanvas(source.width, source.height);
    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    if (flipped) {
      context.transform(1, 0, 0, -1, 0, canvas.height);
    }
    context.drawImage(source, 0, 0);
    return context.getImageData(0, 0, source.width, source.height);
  }

  public static renderToCanvas(
    renderer: Renderer,
    drawFunction: any,
    width: number | null = null,
    height: number | null = null,
  ): HTMLCanvasElement {
    const rt: RenderTexture = ImageUtils.renderToTexture(renderer, drawFunction, width, height);
    return ImageUtils.putToCanvas(rt.getUint8Data(), rt.width, rt.height);
  }

  public static renderToPng(
    renderer: Renderer,
    drawFunction: any,
    width: number | null = null,
    height: number | null = null,
  ): string {
    const rt: RenderTexture = ImageUtils.renderToTexture(renderer, drawFunction, width, height);
    const canvas: HTMLCanvasElement = ImageUtils.putToCanvas(
      rt.getUint8Data(),
      rt.width,
      rt.height,
    );
    window.open(canvas.toDataURL(), '_blank');
    return canvas.toDataURL();
  }

  public static renderToTexture(
    renderer: Renderer,
    drawFunction: any,
    width: number | null = null,
    height: number | null = null,
  ): RenderTexture {
    const w = width !== null ? width : renderer.width;
    const h = height !== null ? height : renderer.height;
    const rt: RenderTexture = new RenderTexture(
      renderer,
      w,
      h,
      TextureFormat.RGBA_UNSIGNED_BYTE,
      false,
      true,
      true,
      true,
    );

    renderer.renderTarget = rt;
    renderer.clear();
    drawFunction.call(this);
    renderer.unsetRenderTarget();
    return rt;
  }

  public static putToCanvas(
    data: Uint8Array,
    width: number,
    height: number,
    flipY: boolean = false,
  ): HTMLCanvasElement {
    const canvas = ImageUtils.createCanvas(width, height);
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    const imgData: ImageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      let imgOffset = y * width * 4;
      let dataOffset = flipY ? y * width * 4 : (height - y - 1) * width * 4;
      for (let x = 0; x < width; x++) {
        imgData.data[imgOffset++] = data[dataOffset++];
        imgData.data[imgOffset++] = data[dataOffset++];
        imgData.data[imgOffset++] = data[dataOffset++];
        imgData.data[imgOffset++] = data[dataOffset++];
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /*  // if alpha is 0, rgb will be zero to
    public static textureToBrowserTab(texture: Texture2D): void {
  /!*		const canvas: HTMLCanvasElement = ImageUtils.putToCanvas(texture.getData(), texture.width, texture.height);
      window.open(canvas.toDataURL(), '_blank');*!/

      this.dataToBrowserTab(texture.getData(), texture.width, texture.height);
    }*/

  //TODO: fix: alpha is 0
  // TODO: make this a list of gl calls to improver performance and minimize memory usage
  // does not premultiply alpha: this makes it possible to store data in the alpha channel without breaking rgb
  public static dataToBrowserTab(
    data: Uint8Array | Float32Array,
    width: number,
    height: number,
  ): void {
    const canvas = ImageUtils.createCanvas(width, height);

    const preloader = new WebGLPreLoader();
    const renderer = new RendererWebGL1(preloader, canvas, null, true, true);

    preloader.load(() => {
      renderer.init();
      const texture = new Texture2D(renderer, TextureFormat.RGBA_UNSIGNED_BYTE, false, false);
      texture.setData(data, width, height);
      renderer.blit(texture);

      // window.open(texture.renderer.getCanvas().toDataURL()) doesn't work anymore...

      const url = texture.renderer.canvas.toDataURL();
      const w = window.open('', '_blank');
      if (w) {
        const img = w.document.createElement('img');
        img.src = url;
        w.document.body.appendChild(img);
      } else {
        console.error('Unable to open new window');
      }

      renderer.destruct();
    });
  }

  public static saveDataToDisk(
    data: Uint8Array,
    width: number,
    height: number,
    name: string = 'image',
    fileType: string = 'png',
    quality: number = 1,
  ) {
    let canvas = ImageUtils.putToCanvas(data, width, height);
    ImageUtils.saveCanvasToDisk(canvas, name, fileType, quality);
  }

  public static saveTextureToDisk(
    renderTexture: Texture2D,
    name: string = 'image',
    fileType: string = 'png',
    quality: number = 1,
  ) {
    let canvas = ImageUtils.putToCanvas(
      <Uint8Array>renderTexture.getData(),
      renderTexture.width,
      renderTexture.height,
    );
    ImageUtils.saveCanvasToDisk(canvas, name, fileType, quality);
  }

  public static saveCanvasToDisk(
    canvas: HTMLCanvasElement,
    name: string = 'image',
    fileType: string = 'png',
    quality: number = 1,
  ) {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('No blob!');
        }
        let URLObj = window.URL;
        let a = document.createElement('a');
        a.href = URLObj.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      'image/' + fileType,
      quality,
    );
  }
}

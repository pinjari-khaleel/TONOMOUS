import { ImageEffectRenderer } from 'seng-effectrenderer';
import { DisposableManager } from 'seng-disposable-manager';
import { addEventListener } from 'seng-disposable-event-listener';
import debounce from 'lodash/debounce';
import { TweenMax } from 'gsap';

export const shaders = { wave: require('./shaders/wave.glsl') as string };

export type EffectType = keyof typeof shaders;

/**
 * @class ImageEffect
 * Render an image with a WebGL shader.
 *
 * @property wrapper - The element where the `<canvas>` element needs to be rendered in
 * @property images - Array of images that are used by the shader. Note that the selected effect can different image amounts
 * @property type - Effect type determined by the available shader
 * @property loop - Loop the animation
 * */
export default class ImageEffect {
  public readonly renderer: ImageEffectRenderer;
  private disposables = new DisposableManager();

  constructor(
    private wrapper: HTMLElement,
    private images: ReadonlyArray<string>,
    private type: EffectType,
    private loop: boolean,
  ) {
    this.renderer = ImageEffectRenderer.createTemporary(
      this.wrapper,
      shaders[this.type],
      loop,
      true,
    );

    this.disposables.add(
      addEventListener(
        window,
        'resize',
        debounce(() => this.renderer.updateSize(), 50, { leading: true }),
      ),
    );
  }

  /**
   * Initialise the effect renderer and start the animation
   *
   * @async
   * @public
   * */
  public async init(): Promise<void> {
    TweenMax.set(this.wrapper, {
      autoAlpha: 0,
    });

    const images = await Promise.all(this.images.map((image) => ImageEffect.loadImage(image)));

    (
      await Promise.all(this.images.map((image) => ImageEffect.loadImage(image)))
    ).forEach((image, index) => this.renderer.addImage(image, index));

    this.renderer.setUniformFloat('uScrAspectRatio', images[0].width / images[0].height);

    TweenMax.to(this.wrapper, 0.5, {
      autoAlpha: 1,
      clearProps: 'autoAlpha',
    });
  }

  private static loadImage(fileName: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = fileName;
    });
  }

  /**
   * Dispose the event listeners and stop the renderer. Use this method when cleaning up.
   * */
  public dispose(): void {
    this.disposables.dispose();
    this.renderer.stop();
  }
}

import AbstractComponent from 'app/component/AbstractComponent';
import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { loadScript } from 'app/util/loadScript';

interface LottieOptions {
  container: HTMLElement;
  path: string;
  assetsPath?: string;
  loop?: string;
  autoplay?: string;
}

export default class A20LottieAnimation extends AbstractComponent {
  public static readonly displayName: string = 'a20-lottie-animation';

  private readonly containerElement = this.getElement('[data-lottie-container]');
  private lottieInstance: AnimationItem | null = null;
  private readonly options: LottieOptions;

  constructor(el: HTMLElement) {
    super(el);

    if (this.containerElement === null) {
      throw new Error('Lottie container component does not exist');
    }

    const { lottieLoop, lottieJsonFilePath, lottieAutoplay } = this.containerElement.dataset;

    let { lottieAssetsFolderPath } = this.containerElement.dataset;

    if (lottieJsonFilePath === undefined) {
      throw new Error('No JSON path for Lottie provided');
    }

    // AEM can't place the path with the required trailing slash, so JS adds it.
    if (lottieAssetsFolderPath && lottieAssetsFolderPath.slice(-1) !== '/') {
      lottieAssetsFolderPath += '/';
    }

    this.options = {
      container: this.containerElement,
      path: lottieJsonFilePath,
      loop: lottieLoop,
      autoplay: lottieAutoplay,
      assetsPath: lottieAssetsFolderPath,
    };
  }

  public async adopted(): Promise<void> {
    if (this.options.autoplay === 'true') {
      try {
        await this.loadLottieLibrary();
        this.lottieInstance = await this.loadAnimation();
      } catch (error) {
        console.log(error);
      }
    }
  }

  public loadAnimation(): Promise<AnimationItem> {
    const { container, path, loop, autoplay, assetsPath } = this.options;
    return new Promise<AnimationItem>((resolve, reject) => {
      if (window.bodymovin) {
        const lottie = window.bodymovin.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: loop === 'true',
          autoplay: autoplay === 'true',
          path,
          assetsPath,
        });

        lottie.addEventListener('DOMLoaded', () => resolve(lottie));
      } else {
        reject('Bodymovin not available');
      }
    });
  }

  private async loadLottieLibrary() {
    await loadScript({
      id: 'lottie-web',
      source: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.4/lottie.min.js',
    });
  }

  public async play(): Promise<void> {
    if (!this.lottieInstance) {
      try {
        await this.loadLottieLibrary();
        this.lottieInstance = await this.loadAnimation();
        this.lottieInstance.play();
      } catch (error) {
        console.log(error);
      }
    }
  }
}

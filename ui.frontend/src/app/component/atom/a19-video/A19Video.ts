import AbstractComponent from 'app/component/AbstractComponent';
import debounce from 'lodash/debounce';
export default class A19Video extends AbstractComponent {
  public static readonly displayName: string = 'a19-video';

  private readonly video = this.getElement<HTMLVideoElement>('[data-video]');
  private readonly sources = this.video && this.getElements<HTMLSourceElement>('source');

  constructor(el: HTMLElement) {
    super(el);

    this.respondToWidthChange();
    this.addDisposableEventListener(window, 'resize', debounce(this.respondToWidthChange, 100));
  }

  private respondToWidthChange = () => {
    if (this.video && this.sources) {
      const source = this.selectSource(this.video, this.sources);
      if (this.video.src !== source) {
        this.video.src = source ? source : '';
      }
    }
  };

  private selectSource = (
    videoElement: HTMLVideoElement,
    sources: ReadonlyArray<HTMLSourceElement>,
  ) => {
    const findResponsiveSrc = (sources: ReadonlyArray<HTMLSourceElement>) =>
      sources.find(({ type, media }) => {
        return media && videoElement.canPlayType(type) && window.matchMedia(media).matches;
      })?.src;

    const findNextFallbackSrc = (sources: ReadonlyArray<HTMLSourceElement>) =>
      sources.find(({ type, media }) => {
        return !media && videoElement.canPlayType(type);
      })?.src;

    const responsiveSrc = findResponsiveSrc(sources);
    const nextFallbackSrc = findNextFallbackSrc(sources);

    return responsiveSrc ? responsiveSrc : nextFallbackSrc;
  };
}

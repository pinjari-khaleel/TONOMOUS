import { isEditor } from './aemEditorUtils';
import omit from 'lodash/omit';
import lerp from 'lerp';

export interface ScrollHijackStatus {
  progress: number;
  scrollPosition: number;
}

export interface ScrollHijackCallbacks {
  onScroll?: (status: ScrollHijackStatus) => void;
  onScrollBeforeInView?: (status: ScrollHijackStatus) => void;
  onScrollInView?: (status: ScrollHijackStatus) => void;
  onScrollAfterInView?: (status: ScrollHijackStatus) => void;
}

export interface ScrollHijackOptions extends ScrollHijackCallbacks {
  parentElement: HTMLElement;
}

export default class ScrollHijackController {
  private readonly parentElement: HTMLElement;
  private readonly callbacks: ScrollHijackCallbacks;

  public isActive = true;

  private animationFrameReference = 0;

  private scrollStatus = {
    scrollPosition: 0,
    progress: 0,
  };

  constructor(options: ScrollHijackOptions) {
    this.parentElement = options.parentElement;

    this.callbacks = omit<ScrollHijackCallbacks>(options, 'parentElement');
  }

  public async initScrollHijack(): Promise<ScrollHijackController> {
    if (isEditor()) throw new Error('Scroll hijacking is not possible in editor mode');
    this.tick();
    return this;
  }

  private tick(): void {
    if (!this.isActive) return this.tick();

    const scrollPosition = scrollY - this.parentElement.offsetTop;
    const maxHeight = this.parentElement.clientHeight - window.innerHeight;
    const progress = scrollPosition / maxHeight;

    const { onScroll, onScrollBeforeInView, onScrollInView, onScrollAfterInView } = this.callbacks;

    this.scrollStatus = {
      scrollPosition: lerp(this.scrollStatus.scrollPosition, scrollPosition, 0.8),
      progress: lerp(this.scrollStatus.progress, progress, 0.8),
    };

    onScroll?.(this.scrollStatus);

    if (this.scrollStatus.progress < 0) {
      onScrollBeforeInView?.(this.scrollStatus);
    } else if (this.scrollStatus.progress >= 0 && this.scrollStatus.progress <= 1) {
      onScrollInView?.(this.scrollStatus);
    } else if (this.scrollStatus.progress > 1) {
      onScrollAfterInView?.(this.scrollStatus);
    }

    this.animationFrameReference = requestAnimationFrame(this.tick.bind(this));
  }

  public dispose(): void {
    cancelAnimationFrame(this.animationFrameReference);
  }
}

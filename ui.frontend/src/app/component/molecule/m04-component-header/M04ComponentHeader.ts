import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M04ComponentHeaderTransitionController from './M04ComponentHeaderTransitionController';
import { SplitText } from '../../../vendor/gsap/SplitText';
import A05Moustache from '../../atom/a05-moustache/A05Moustache';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import A03Heading from '../../atom/a03-heading/A03Heading';

export default class M04ComponentHeader extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm04-component-header';

  public readonly transitionController: M04ComponentHeaderTransitionController;

  public splitHeading: typeof SplitText | null;
  public splitEyebrow: typeof SplitText | null = null;
  public splitMoustache: typeof SplitText | null = null;

  constructor(el: HTMLElement) {
    super(el);

    const heading = this.getElement(`[data-component="${A03Heading.displayName}"]`);
    const eyebrow = this.getElement(`[data-component="${A04Eyebrow.displayName}"]`);
    const moustache = this.getElement(`[data-component="${A05Moustache.displayName}"]`);

    if (heading) {
      heading.style.fontKerning = 'none';
      this.splitHeading = new SplitText(heading, { type: 'lines,words' });
    }

    if (eyebrow) {
      eyebrow.style.fontKerning = 'none';
      this.splitEyebrow = new SplitText(eyebrow, { type: 'lines,words' });
    }

    if (moustache) {
      moustache.style.fontKerning = 'none';
      this.splitMoustache = new SplitText(moustache, { type: 'lines,words' });
    }

    this.transitionController = new M04ComponentHeaderTransitionController(this);
  }
}

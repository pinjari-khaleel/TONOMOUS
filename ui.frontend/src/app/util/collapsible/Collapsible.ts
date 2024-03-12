import EventDispatcher from 'seng-event';
import { TimelineLite } from 'gsap';
import CollapsibleEvent from './CollapsibleEvent';
import eases from '../../animation/eases';
import deviceStateTracker from '../deviceStateTracker';

export class Collapsible extends EventDispatcher {
  private timeline?: TimelineLite;

  public readonly expandedItemContent: HTMLElement;
  public readonly parentBLockComponent: HTMLElement | undefined;

  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  constructor(expandedItemContent: HTMLElement, parentBLockComponent?: HTMLElement) {
    super();

    this.expandedItemContent = expandedItemContent;
    this.parentBLockComponent = parentBLockComponent;
  }

  protected extendExpandTimeline(timeline: TimelineLite, duration: number) {}

  protected extendCollapseTimeline(timeline: TimelineLite, duration: number) {}

  public toggle(duration: number = 0.8, force?: boolean) {
    const expand = force != null ? force : this.expandedItemContent.hasAttribute('hidden');

    if (expand) {
      this.expand(duration);
      return;
    }

    this.collapse(duration);
  }

  public expand(duration: number = 0.8): void {
    this.timeline && this.timeline.kill();

    this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.EXPAND, this));

    // We could be in the middle of a collapse transition thus we want to save the current height
    const currentHeight = this.expandedItemContent.clientHeight;

    // Remove hidden attribute before starting transition
    this.expandedItemContent.removeAttribute('hidden');

    this.timeline = new TimelineLite({
      onUpdate: () => {
        if (this.parentBLockComponent) this.parentBLockComponent.style.pointerEvents = 'none';
        this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.UPDATE, this));
      },
      onComplete: () => {
        if (this.parentBLockComponent) this.parentBLockComponent.style.pointerEvents = 'all';
        this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.UPDATE_COMPLETE, this));
      },
    });

    this.timeline.fromTo(
      this.expandedItemContent,
      duration,
      {
        height: currentHeight,
      },
      {
        height: this.expandedItemContent.clientHeight,
        clearProps: 'height',
        ease: eases.VinnieInOut,
      },
    );

    this.extendExpandTimeline(this.timeline, duration);
  }

  public collapse(duration: number = 0.8): void {
    this.timeline && this.timeline.kill();

    this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.COLLAPSE, this));

    this.timeline = new TimelineLite({
      onUpdate: () => {
        if (this.parentBLockComponent) this.parentBLockComponent.style.pointerEvents = 'none';
        this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.UPDATE, this));
      },
      onComplete: () => {
        if (this.parentBLockComponent) this.parentBLockComponent.style.pointerEvents = 'all';
        this.dispatchEvent(new CollapsibleEvent(CollapsibleEvent.UPDATE_COMPLETE, this));
      },
    });

    this.timeline.to(this.expandedItemContent, duration, {
      height: 0,
      clearProps: 'height',
      ease: eases.VinnieInOut,
    });
    this.extendCollapseTimeline(this.timeline, duration);

    this.timeline.add(() => this.expandedItemContent.setAttribute('hidden', ''));
  }
}

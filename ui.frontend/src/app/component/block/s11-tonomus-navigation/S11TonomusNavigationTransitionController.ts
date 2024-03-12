import { TimelineMax } from 'gsap';
import { IMubanTransitionMixin } from 'muban-transition-component';
import AbstractTransitionController from '../../AbstractTransitionController';
import S11TonomusNavigation from './S11TonomusNavigation';

class S11TonomusNavigationTransitionController extends AbstractTransitionController {
  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S11TonomusNavigation,
    id: string,
  ): void {
    timeline.from(parent.element, 0.6, { opacity: 0 });
  }

  /**
   * Use this method to setup your transition out timeline
   *
   * @protected
   * @method setupTransitionOutTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IMubanTransitionMixin} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S11TonomusNavigation,
    id: string,
  ): void {
    timeline.from(parent.element, 0.6, { opacity: 1 });
  }

  /**
   * Use this method to setup your looping timeline
   *
   * @protected
   * @method setupLoopingAnimationTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IMubanTransitionMixin} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S11TonomusNavigation,
    id: string,
  ): void {}
}

export default S11TonomusNavigationTransitionController;

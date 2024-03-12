import A01Image from './A01Image';
import eases from '../../../animation/eases';
import sample from 'lodash/sample';
import { fadeFromTo } from '../../../animation/fade';
import { TimelineMax, TweenLite } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';

interface ICounterObject {
  image: number;
  background: number;
  backgroundElement: HTMLElement;
  imageElement: HTMLElement;
  direction: ImageDirection;
}

export enum ImageDirection {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

class A01ImageTransitionController extends AbstractTransitionController {
  private onUpdate(counter: ICounterObject): void {
    const from = [ImageDirection.BOTTOM, ImageDirection.RIGHT].includes(counter.direction)
      ? 1 - counter.background
      : counter.background - 1;
    const isVertical = [ImageDirection.TOP, ImageDirection.BOTTOM].includes(counter.direction);

    TweenLite.set(counter.backgroundElement, {
      yPercent: isVertical ? from * 100 : 0,
      xPercent: isVertical ? 0 : from * 100,
    });

    const { offsetWidth, offsetHeight } = counter.imageElement;

    if (isVertical) {
      counter.imageElement.style.clip = `rect(${
        counter.direction === ImageDirection.BOTTOM ? offsetHeight * counter.image : 0
      }px, ${offsetWidth}px, ${
        counter.direction === ImageDirection.TOP ? offsetHeight * (1 - counter.image) : offsetHeight
      }px, 0)`;
    } else {
      counter.imageElement.style.clip = `rect(0px, ${
        counter.direction === ImageDirection.LEFT ? offsetWidth * (1 - counter.image) : offsetWidth
      }px, ${offsetHeight}px, ${
        counter.direction === ImageDirection.RIGHT ? offsetWidth * counter.image : 0
      }px)`;
    }
  }

  private onTweenComplete(counter: ICounterObject): void {
    TweenLite.set(counter.backgroundElement, { clearProps: 'xPercent,yPercent' });
    TweenLite.set(counter.imageElement, { clearProps: 'clip' });
  }

  private getTransitionDirection(): ImageDirection {
    switch (this.parentController.element.dataset.direction) {
      default:
      case 'bottom':
        return ImageDirection.BOTTOM;
      case 'top':
        return ImageDirection.TOP;
      case 'left':
        return ImageDirection.LEFT;
      case 'right':
        return ImageDirection.RIGHT;
      case 'random':
        return sample(
          Object.values(ImageDirection).filter(
            (key: any) => typeof ImageDirection[key] !== 'number',
          ),
        ) as ImageDirection;
    }
  }

  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IMubanTransitionMixin} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: A01Image, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    // We might not want all the images to transition inb
    if (parent.element.dataset.enableTransition === 'false') {
      return;
    }

    const image = <HTMLElement>parent.getElement('[data-image-img]');

    const counter = {
      image: 0,
      background: 0,
      backgroundElement: <HTMLElement>parent.getElement('[data-image-background]'),
      imageElement: <HTMLElement>parent.getElement('[data-image-wrapper]'),
      direction: this.getTransitionDirection(),
    } as ICounterObject;

    timeline.eventCallback('onUpdate', this.onUpdate.bind(this, counter));
    timeline.eventCallback('onComplete', this.onTweenComplete.bind(this, counter));

    timeline.add(fadeFromTo(parent.element, 0.01));

    timeline.fromTo(
      counter,
      0.85,
      {
        background: 0,
      },
      {
        background: 1,
        ease: eases.VinnieInOut,
      },
    );

    timeline.addLabel('image', 0.3);

    timeline.fromTo(
      counter,
      0.85,
      {
        image: 1,
      },
      {
        image: 0,
        ease: eases.VinnieInOut,
      },
      'image',
    );
    timeline.fromTo(
      image,
      1.4,
      {
        scale: 1.2,
      },
      {
        scale: 1,
        ease: eases.VinnieInOut,
        clearProps: 'scale',
      },
      'image',
    );
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
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: A01Image, id: string): void {}

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
    parent: A01Image,
    id: string,
  ): void {}
}

export default A01ImageTransitionController;

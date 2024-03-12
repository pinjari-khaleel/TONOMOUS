import { handleMultipleItemStateClassNames } from 'app/util/stateClassNamesToggle';
import {
  setInitialActiveIndicator,
  updateActiveIndicator,
} from '../../../util/activeIndicatorSwitcher';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C84TabbedCtaTransitionController from './C84TabbedCtaTransitionController';

export default class C84TabbedCta extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c84-tabbed-cta';

  public readonly transitionController: C84TabbedCtaTransitionController;
  private readonly tabIndicator = this.getElement('[data-tab-indicator]');
  private readonly tabs = this.getElements('[data-tab]');
  private readonly contentItems = this.getElements('[data-content-item]');
  private readonly activeTab = this.tabs.find((item) =>
    item.classList.contains(StateClassNames.ACTIVE),
  );

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C84TabbedCtaTransitionController(this);
    this.activeTab &&
      this.tabIndicator &&
      setInitialActiveIndicator(this.activeTab, this.tabIndicator);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.tabs.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.handleTabActiveState(item, index);
      });
      this.addDisposableEventListener(window, 'resize', () =>
        this.handleTabActiveState(item, index),
      );
    });
  }

  private handleTabActiveState(item: HTMLElement, index: number): void {
    handleMultipleItemStateClassNames(this.tabs, `${StateClassNames.ACTIVE}`, index);
    handleMultipleItemStateClassNames(this.contentItems, `${StateClassNames.ACTIVE}`, index);
    this.tabIndicator &&
      this.tabs.length &&
      updateActiveIndicator(this.tabs[index], this.tabIndicator);
  }
}

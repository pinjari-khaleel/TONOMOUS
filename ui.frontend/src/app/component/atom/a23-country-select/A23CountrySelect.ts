import AbstractComponent from 'app/component/AbstractComponent';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import A23CountrySelectEvent from './A23CountrySelectEvent';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class A23CountrySelect extends AbstractComponent {
  public static readonly displayName: string = 'a23-country-select';

  private readonly valueWrapperElement = this.getElement<HTMLDivElement>('[data-value-wrapper]');
  private readonly valueElement = this.getElement<HTMLSpanElement>('[data-value]');
  private readonly chevronElement = this.getElement<HTMLDivElement>('[data-chevron]');
  private readonly optionsElement = this.getElement<HTMLUListElement>('[data-options]');
  private readonly optionElements = this.getElements<HTMLElement>('[data-option]');
  private readonly placeholder = this.valueElement?.innerText;

  private isDropdownOpen = false;
  private value: string | null = null;
  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  public adopted(): void {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    if (this.valueWrapperElement && !this.isMobile) {
      this.addDisposableEventListener(
        this.valueWrapperElement,
        'click',
        this.toggleDropdown.bind(this),
      );
    }

    this.optionElements.forEach((item) => {
      this.addDisposableEventListener(item, 'click', this.onItemClick.bind(this));
    });

    this.addDisposableEventListener(window, 'click', this.onOutsideClick.bind(this));
  }

  private get flagsPath(): string {
    return this.element.dataset.flagsPath || '';
  }

  private get showRawValue(): boolean {
    return this.element.dataset.showRawValue === 'true';
  }

  private toggleDropdown(): void {
    if (!this.optionsElement || !this.chevronElement) return;

    [this.optionsElement, this.chevronElement].forEach((element) =>
      element.classList.toggle(StateClassNames.OPEN),
    );

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  private onItemClick(event: MouseEvent): void {
    const element = <HTMLElement>event.currentTarget;
    const { code, value, label } = element.dataset;
    if (!code || !value || !label || !this.valueElement) return;

    this.value = value;

    this.updateValueElement(this.value, code, label);

    this.toggleDropdown();

    this.dispatcher.dispatchEvent(new A23CountrySelectEvent(A23CountrySelectEvent.UPDATE, this));
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;

    this.disposables.dispose();
    this.addEventListeners();
  }

  private onOutsideClick(event: Event): void {
    if (!this.isDropdownOpen) return;

    const element = <HTMLElement>event.target;

    if (element !== this.valueWrapperElement) {
      this.toggleDropdown();
    }
  }

  public updateValueElement(value: string, countryCode: string, label: string): void {
    if (!this.valueElement) return;
    const flagImagePath = `${this.flagsPath}${countryCode.toLowerCase()}`;

    if (this.showRawValue) {
      this.valueElement.innerHTML = `<img src="${flagImagePath}.png" class="a-countrySelect__flag" alt="${countryCode}"> ${countryCode} ${value}`;
    } else {
      this.valueElement.innerHTML = `<img src="${flagImagePath}.png" class="a-countrySelect__flag" alt="${countryCode}"> ${label}`;
    }
  }

  public get currentValue(): string | null {
    return this.value;
  }

  public reset() {
    if (this.valueElement && this.placeholder) {
      this.valueElement.innerText = this.placeholder;
    }
  }
}

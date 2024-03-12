import AbstractComponent from 'app/component/AbstractComponent';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { getComponentForElement } from 'muban-core';
import A23CountrySelect from '../../atom/a23-country-select/A23CountrySelect';
import A23CountrySelectEvent from '../../atom/a23-country-select/A23CountrySelectEvent';
import A15Select from '../../atom/a15-select/A15Select';
import { A23CountrySelectItemProps } from '../../atom/a23-country-select/A23CountrySelect.types';
import { StateClassNames } from 'app/data/enum/StateClassNames';

export default class M41CountryDropdown extends AbstractComponent {
  public static readonly displayName: string = 'm41-country-dropdown';

  private readonly selectElement = this.getElement<HTMLSelectElement>(
    `[data-component="${A15Select.displayName}"]`,
  );
  private selectComponent: A15Select | null = null;

  private readonly countrySelectElement = this.getElement(
    `[data-component="${A23CountrySelect.displayName}"]`,
  );
  private countrySelectComponent: A23CountrySelect | null = null;

  private items: ReadonlyArray<A23CountrySelectItemProps> = [];

  private value: string | null = null;
  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  constructor(el: HTMLDivElement) {
    super(el);
  }

  public adopted() {
    const itemJsonString = this.element.dataset.items;
    if (itemJsonString) {
      this.items = JSON.parse(itemJsonString);
    }

    if (this.countrySelectElement) {
      this.countrySelectComponent = getComponentForElement<A23CountrySelect>(
        this.countrySelectElement,
      );
    }

    if (this.selectElement) {
      this.selectComponent = getComponentForElement<A15Select>(this.selectElement);
    }

    this.addEventListeners();

    this.observeSelectErrors();
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;

    this.disposables.dispose();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    if (this.isMobile) {
      if (this.selectComponent?.select) {
        this.addDisposableEventListener(
          this.selectComponent.select,
          'change',
          this.onSelectValueChange.bind(this),
        );
      }
    } else {
      if (this.countrySelectComponent) {
        this.addDisposableEventListener<A23CountrySelectEvent>(
          this.countrySelectComponent.dispatcher,
          A23CountrySelectEvent.UPDATE,
          this.onCountrySelectChange.bind(this),
        );
      }
    }
  }

  private onCountrySelectChange(event: A23CountrySelectEvent): void {
    const { currentValue } = event.countrySelect;
    if (this.selectComponent?.select && currentValue) {
      this.selectComponent.select.value = currentValue;
      const event = new Event('change');
      this.selectComponent.select.dispatchEvent(event);
    }
  }

  private onSelectValueChange(event: Event): void {
    const select = <HTMLSelectElement>event.currentTarget;

    const currentItem = this.items.find((item) => {
      if (item.value === select.value) return item;
    });

    if (currentItem) {
      this.countrySelectComponent?.updateValueElement(
        currentItem.value,
        currentItem.countryCode,
        currentItem.label,
      );
      this.value = currentItem.value;
    }
  }

  private observeSelectErrors() {
    const a23Select = this.selectComponent?.select;
    if (a23Select) {
      const callback: MutationCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (a23Select.classList.contains(StateClassNames.HAS_ERROR)) {
              this.countrySelectElement &&
                this.countrySelectElement.classList.add(StateClassNames.HAS_ERROR);
            } else {
              this.countrySelectElement &&
                this.countrySelectElement.classList.remove(StateClassNames.HAS_ERROR);
            }
          }
        });
      };
      const options = { attributes: true };
      const observer = new MutationObserver(callback);

      observer.observe(a23Select, options);
    }
  }

  public resetCountrySelect() {
    this.countrySelectComponent?.reset();
  }
}

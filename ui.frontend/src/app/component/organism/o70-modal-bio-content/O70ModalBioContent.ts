import AbstractComponent from 'app/component/AbstractComponent';
import { isRtl } from 'app/util/rtlUtils';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O10Modal from '../o10-modal/O10Modal';

export default class O70ModalBioContent extends AbstractComponent {
  public static readonly displayName: string = 'o70-modal-bio-content';

  private O10Modal: null | HTMLElement = this.getElement(
    `[data-component="${O10Modal.displayName}"`,
    document.body,
  );
  private sectorElement: null | HTMLElement = this.getElement('[data-sector]');
  private regionElement: null | HTMLElement = this.getElement('[data-region]');
  private divisions: null | HTMLElement = this.getElement('[data-divisions]');
  private isRtl = isRtl();

  constructor(el: HTMLElement) {
    super(el);

    const i18nForModals = this.O10Modal?.dataset.i18n && JSON.parse(this.O10Modal?.dataset.i18n);

    const { biography } = i18nForModals;

    const region = this.regionElement?.textContent;
    const sector = this.sectorElement?.textContent;

    if (this.sectorElement) {
      this.sectorElement.textContent = this.isRtl
        ? `${sector} :${biography.sector}`
        : `${biography.sector}: ${sector}`;
    }
    if (this.regionElement) {
      this.regionElement.textContent = this.isRtl
        ? `${region} :${biography.region}`
        : `${biography.region}: ${region}`;
    }

    if (this.isRtl && this.divisions) {
      const reversedDivisions = Array.from(this.divisions.childNodes).reverse();
      this.divisions.innerHTML = '';
      this.divisions.append(...reversedDivisions);
    }
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}

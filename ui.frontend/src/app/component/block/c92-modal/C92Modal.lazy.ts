import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getAppComponent } from '../../../util/getElementComponent';
import { MODAL } from '../../../util/overlayActionTypes';
import App from '../../layout/app/App';

import './c92-modal.scss';

type LoadTemplateImport = Promise<{ default: (data?: Record<string, any>) => string }>;
type LoadTemplate = () => LoadTemplateImport;

const modalTemplates = {
  O86ModalForm: 'o86-modal-form',
} as const;

type ModalTemplatesKeys = keyof typeof modalTemplates;

const templates: Record<typeof modalTemplates[ModalTemplatesKeys], LoadTemplate> = {
  [modalTemplates.O86ModalForm]: () =>
    import('../../organism/o86-modal-form/o86-modal-form.hbs?include') as LoadTemplateImport,
};

type ComponentName = keyof typeof templates;

export default class C92Modal extends AbstractComponent {
  public static readonly displayName: string = 'c92-modal';

  private readonly headerContent = document.querySelector('.b-tonomusNavigation__dropdownContent');
  private readonly ctaHeaderButton = this.headerContent?.querySelector(
    '[data-component="m02-button"]',
  ) as HTMLAnchorElement;
  private readonly ctalinks = [
    ...document.querySelectorAll('[data-cta-item]'),
  ] as HTMLAnchorElement[];

  private app: App | undefined;

  private get component(): ComponentName | undefined {
    return this.element.dataset.name as any;
  }

  private get data(): Record<string, any> | undefined {
    const jsonString = this.element.dataset.data;
    const data = jsonString ? JSON.parse(jsonString) : undefined;

    return data;
  }

  private get loadTemplate() {
    if (this.component == null || templates[this.component] == null) {
      throw new Error(`Component "${this.component}" is not available in C92Modal`);
    }

    return templates[this.component];
  }

  constructor(element: HTMLElement) {
    super(element);
  }

  public async adopted() {
    setAsInitialised(this.element);

    if (this.element.id == null) {
      throw new Error('this.element.id is undefined');
    }

    this.app = await getAppComponent();

    if (this.app.overlay == null) {
      throw new Error('this.app.overlay is undefined');
    }

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      if (((event as unknown) as CustomEvent).detail.type === MODAL.CLOSE) {
        this.close();
      }
    });

    // When hash is changed to id open popup
    this.addDisposableEventListener(window, 'hashchange', this.onHashChange.bind(this));

    if (this.ctaHeaderButton) {
      this.addDisposableEventListener(
        this.ctaHeaderButton,
        'click',
        this.handleLinkClick.bind(this),
      );
    }

    this.ctalinks.forEach((link) => {
      this.addDisposableEventListener(link, 'click', this.handleLinkClick.bind(this));
    });

    if (window.location.hash === `#${this.element.id}`) {
      this.open();
    }
  }

  private async open(): Promise<void> {
    const template = await this.loadTemplate();

    if (this.app && this.data) {
      this.app?.overlay?.dispatchAction({
        type: MODAL.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data: this.data,
        },
      });
    }
  }

  private close(): void {
    const url = new URL(window.location.href);
    url.hash = '';

    history.pushState(null, '', url.href);
  }

  private handleLinkClick(event: MouseEvent): void {
    const anchorElement = event.currentTarget as HTMLAnchorElement;
    const hashTagPosition = anchorElement.href.indexOf('#');

    if (hashTagPosition !== -1) {
      const anchorId = anchorElement.href.slice(hashTagPosition, anchorElement.href.length);
      if (anchorId === `#${this.element.id}`) {
        event.preventDefault();
        this.open();
      }
    }
  }

  private onHashChange(event: HashChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (window.location.hash === `#${this.element.id}`) {
      this.open();
    }
  }
}

import AbstractComponent from 'app/component/AbstractComponent';
import { TweenMax } from 'gsap';
import { getAppComponent } from '../../../util/getElementComponent';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { cleanElement, getComponentForElement } from 'muban-core';
import eases from 'app/animation/eases';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import A02Icon from '../../atom/a02-icon/A02Icon';
import IconTemplate from '../../atom/a02-icon/a02-icon.hbs?include';
import App from '../../layout/app/App';

export default class M33Cursor extends AbstractComponent {
  public static readonly displayName: string = 'm33-cursor';

  private cursorPointer = this.getElement('[data-cursor-pointer]');

  private xPosition: number = 0;
  private yPosition: number = 0;

  private isGenerated: boolean = false;
  private currentIcon: string = '';

  private iconComponent: HTMLElement | null = this.getElement(
    `[data-component="${A02Icon.displayName}"`,
  );

  private cursorIcon: A02Icon | null = null;
  private isMobile: boolean = false;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.addDisposableEventListener(window, 'mousemove', this.getCursorPosition.bind(this));
  }

  private getCursorPosition(event: MouseEvent): void {
    this.xPosition = event.x;
    this.yPosition = event.y;

    this.moveCursor();
  }

  private moveCursor(): void {
    if (this.iconComponent) {
      TweenMax.set(this.iconComponent, {
        x: this.xPosition,
        y: this.yPosition,
      });
    }
  }

  public transformCursor(icon?: string, variant?: string) {
    if (this.isMobile) return;
    if (icon && this.currentIcon !== icon) {
      this.generateCursor(icon, variant);
    }
  }

  private generateCursor(icon: string, variant?: string): void {
    this.currentIcon = icon;
    this.isGenerated = true;

    if (this.cursorPointer === null) throw new Error('Cursor pointer was not found');
    cleanElement(this.cursorPointer);
    const element = renderItem(this.cursorPointer, IconTemplate, {
      name: icon,
      variant: variant || '',
    });
    this.cursorIcon = getComponentForElement<A02Icon>(element);

    this.iconComponent = this.getElement(`[data-component="${A02Icon.displayName}"`);

    this.moveCursor();
    this.showCursor();
  }

  private showCursor(): void {
    if (this.iconComponent) {
      document.body.style.cursor = 'none';

      TweenMax.fromTo(
        this.iconComponent,
        0.3,
        {
          scale: 0.2,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
      );
    }
  }

  public resetCursor(): void {
    if (!this.isGenerated) return;
    document.body.style.cursor = 'default';

    if (this.iconComponent) {
      TweenMax.to(this.iconComponent, 0.5, {
        scale: 0.2,
        autoAlpha: 0,
        ease: eases.VinnieInOut,
      });
    }

    this.isGenerated = false;
    this.currentIcon = '';
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    state > mq.deviceState.LARGE ? (this.isMobile = false) : (this.isMobile = true);
  }
}

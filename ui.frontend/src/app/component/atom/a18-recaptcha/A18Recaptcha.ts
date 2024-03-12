import AbstractComponent from 'app/component/AbstractComponent';
import { loadScript } from '../../../util/loadScript';

let recaptchaResolveMethod: ((value: unknown) => void) | null = null;

const recaptchaLoaded = new Promise((resolve) => {
  recaptchaResolveMethod = resolve;
});

// We want one global callback method that can be triggered by ReCaptcha
// @ts-ignore
window.onloadCallback = () => {
  if (recaptchaResolveMethod) {
    recaptchaResolveMethod('');
    recaptchaResolveMethod = null;
  }
};

export default class A18Recaptcha extends AbstractComponent {
  public static readonly displayName: string = 'a18-recaptcha';

  private readonly sitekey: string = this.element.dataset.sitekey || '';
  private readonly widgetElement = this.getElement('[data-recaptcha]');

  private recaptchaExecuteMethod: ((value: unknown) => void) | null = null;
  private recaptchaExecuted = new Promise((resolve) => {
    this.recaptchaExecuteMethod = resolve;
  });

  private widgetId: number | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted(): Promise<void> {
    await this.render();
  }

  private async render(): Promise<void> {
    if (!this.widgetElement) return;
    await loadScript({
      id: 'recaptcha',
      source: 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit',
    });

    await recaptchaLoaded;
    this.widgetId = grecaptcha.render(this.widgetElement, {
      sitekey: this.sitekey,
      size: 'invisible',
      callback: this.onExecuteCallback.bind(this),
    });
  }

  private resetRecaptcha(id: number): void {
    grecaptcha.reset(id);
    this.recaptchaExecuted = new Promise((resolve) => {
      this.recaptchaExecuteMethod = resolve;
    });
  }

  private onExecuteCallback(): void {
    if (this.recaptchaExecuteMethod) {
      this.recaptchaExecuteMethod("");
      this.recaptchaExecuteMethod = null;
    }
  }

  private async executeRecaptcha(id: number): Promise<void> {
    grecaptcha.execute(id);
    await this.recaptchaExecuted;
  }

  public getResponse(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.widgetId && this.widgetId !== 0) return reject(new Error('Widget ID is undefined'));
      if (!this.recaptchaExecuteMethod) this.resetRecaptcha(this.widgetId);

      await this.executeRecaptcha(this.widgetId);
      const response = grecaptcha.getResponse(this.widgetId);

      if (response) {
        resolve(response);
      } else {
        reject(new Error('Recaptcha is required'));
      }
    });
  }

  public dispose() {
    super.dispose();
  }
}

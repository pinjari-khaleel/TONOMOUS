import AbstractComponent from 'app/component/AbstractComponent';

export default class C101TeaserCard extends AbstractComponent {
  public static readonly displayName: string = 'c101-teaser-card';
  private readonly imageContainer = this.getElement('[data-image]') as HTMLElement;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted(): Promise<void> {
    await this.render();
  }

  private async render(): Promise<void> {
    if (this.imageContainer) {
      const childCount = this.imageContainer.children.length;
      this.imageContainer.classList.add(`-count${childCount}`);
    }
  }

  public dispose() {
    super.dispose();
  }
}

import AbstractComponent from 'app/component/AbstractComponent';

// declare var require:any;

export const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);

export default class A02Icon extends AbstractComponent {
  public static readonly displayName: string = 'a02-icon';

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    this.element.innerHTML = await svgContext(`./${this.element.dataset.icon}.svg`);
  }

  public async setIcon(name: string) {
    this.element.innerHTML = await svgContext(`./${name}.svg`);
  }
}

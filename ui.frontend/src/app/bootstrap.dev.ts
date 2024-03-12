/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import Handlebars from 'handlebars/runtime';
import { bootstrap } from 'muban-core/lib/dev';
import { lazyLoadComponents } from './lazyLoadComponents';
import RequireContext = __WebpackModuleApi.RequireContext;
import { extractNumber } from './util/extractNumber';
import registerPartialMap from './registerPartialMap';

declare var require: any;
declare var module: any;

// create context for json data and handlebar templates
// pick any json/yaml file that doesn't start with a _ in the filename
const dataContext = require.context('../data/', true, /^(.*[\/\\])?[^_][^\/\\]+\.(yaml|json|js)$/);

const partialsContext = require.context('./component/', true, /\.hbs$/);
// require global handlebar variables
const replaceVariables: { [index: string]: any } =
  ((r: RequireContext) => r.keys()[0] && r(r.keys()[0]))(
    require.context('../data/', false, /_variables.yaml/),
  ) || {};

// bootstrap the app
const appElement = document.getElementById('app');
if (!appElement) {
  throw new ReferenceError('Could not find DOM element with id "app"');
}
const app = bootstrap(appElement, <any>{
  Handlebars,
  dataContext,
  partialsContext,
  indexTemplate: require('./component/layout/index'),
  appTemplate: require('./component/layout/app'),
  onData: (data: any) => ({
    ...replaceVariables,
    ...JSON.parse(
      Object.keys(replaceVariables).reduce(
        (data, varName) =>
          // replace ${foo} occurrences in the data to be rendered.
          data.replace(new RegExp(`\\$\{${varName}}`, 'g'), () => replaceVariables[varName]),
        JSON.stringify(data),
      ),
    ),
  }),
  registerPartialMap: registerPartialMap,
  onBeforeInit() {
    resortBlockPages();
    lazyLoadComponents(appElement);
  },
});

const resortBlockPages = () => {
  const isIndexRoot = document.querySelector('[data-component="index-root"]');

  if (!isIndexRoot) {
    return;
  }

  const blockHeader = document.querySelector('[data-category="Block"]');
  const blockPagesContainer = blockHeader?.nextElementSibling;
  const blockPagesCollection = blockPagesContainer?.children;

  if (blockPagesCollection) {
    const blockPages = Array.from(blockPagesCollection) as HTMLElement[];

    blockPages.forEach((element) => {
      element.dataset.id = element.querySelector('span.id')?.textContent || '0';
    });

    const blockPagesSorted = blockPages.slice().sort((a, b) => {
      const numberIdA = a.dataset.id && extractNumber(a.dataset.id);
      const numberIdB = b.dataset.id && extractNumber(b.dataset.id);

      if (numberIdA && numberIdB) {
        return numberIdA - numberIdB;
      }
      return 0;
    });

    if (blockPagesContainer) {
      blockPagesContainer.innerHTML = '';
      blockPagesContainer.append(...blockPagesSorted);
    }
  }
};

// Hot reloading support
if (module.hot) {
  module.hot.accept(dataContext.id, () => {
    const changedContext = require.context(
      '../data/',
      true,
      /^(.*[\/\\])?[^_][^\/\\]+\.(yaml|json|js)$/,
    );
    app.updateData(changedContext);
  });

  module.hot.accept(partialsContext.id, () => {
    const changedContext = require.context('./component/', true, /\.hbs$/);
    app.updatePartials(changedContext);
  });

  module.hot.accept(['./component/layout/index', './component/layout/app'], () => {
    app.update(require('./component/layout/index'), require('./component/layout/app'));
  });
}

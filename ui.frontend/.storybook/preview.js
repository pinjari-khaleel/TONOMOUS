import '../src/app/style/main.scss';
import { bootstrap } from 'muban-core/lib/dist';
import { lazyLoadComponents } from '../src/app/lazyLoadComponents';
import registerPartialMap from '../src/app/registerPartialMap';
import { getModuleContext } from 'muban-core/lib/utils/webpackUtils';
import registerComponent from 'muban-core/lib/dev-utils/registerComponent';
const partialsContext = require.context('../src/app/component/', true, /\.hbs$/);
import Handlebars from 'handlebars/runtime';

// This file controls the way stories are rendered and global decorators and parameters.
export const parameters = {
  docs: {
    iframeHeight: 200,
  },
  storySort: {
    method: 'alphabetical',
    includeName: true,
  },
};

const loadDynamicPartials = (partialsContext, options) => {
  getModuleContext(partialsContext, (_, key, module) => {
    registerComponent(key, module, options);
  });
};

loadDynamicPartials(partialsContext, { registerPartialMap, Handlebars });

// load and register lazy loaded components
const rootElement = document.getElementById('root');

bootstrap(rootElement, {
  onBeforeInit() {
    lazyLoadComponents(rootElement);
    initiateHotreload(rootElement);
  },
});

const initiateHotreload = (appContainer) => {
  const mutationObserver = new MutationObserver(() => {
    lazyLoadComponents(appContainer);
  });

  mutationObserver.observe(appContainer, {
    childList: true,
  });
};

// GLOBAL TYPES

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'tonomus',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['tonomus'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};

// DECORATORS

const setTheme = (themeName) => {
  document.querySelector('html').dataset.theme = themeName;
};

const withThemeProvider = (story, context) => {
  setTheme(context.globals.theme);
  return story();
};
export const decorators = [withThemeProvider];

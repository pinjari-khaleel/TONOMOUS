import App from './component/layout/app/App';
import { getAppComponent } from './util/getElementComponent';

export const addComponentInstancesToScrollManager = async () => {
  try {
    const app: App = await getAppComponent();
    app && app.addComponentsToScrollTracker();
  } catch (err) {
    console.error('Could not run addComponentsToScrollTracker()');
  }
};

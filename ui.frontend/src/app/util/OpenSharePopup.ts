import { O46ShareListProps } from 'app/component/organism/o46-share-list/O46ShareList.types';
import App from '../component/layout/app/App';
import { getAppComponent } from './getElementComponent';
import { POPUP } from './overlayActionTypes';

const lazyO46Template = () =>
  import('../component/organism/o46-share-list/o46-share-list.hbs?include') as LoadTemplateImport<
    O46ShareListProps
  >;

export const openSharePopup = async (shareButton: HTMLElement | null) => {
  const app: App = await getAppComponent();

  const content = {
    ...JSON.parse(<string>shareButton?.dataset.share),
    shareSuccessMessage: <string>shareButton?.dataset.successMessage,
  };

  const shareItems =
    content.items &&
    content.items.map((item: any) => ({
      ...item,
      eventTracking: {
        ...content.eventTracking,
        socialNetwork: item.label,
        sharingMethod:
          item.label === 'Copy Link' || item.label === 'Email' ? item.label : 'Social Network',
      },
    }));

  const template = await lazyO46Template();

  const data = {
    heading: content.heading,
    successMessage: content.successMessage,
    items: shareItems,
  };

  app?.overlay?.dispatchAction({
    type: POPUP.STANDARD_DYNAMIC,
    payload: {
      template: template.default,
      data,
    },
  });
};

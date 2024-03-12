import { renderItem } from 'muban-core/lib/utils/dataUtils';
import O41MediaCardTemplate from 'app/component/organism/o41-media-card/o41-media-card.hbs?include';
import { cleanElement } from 'muban-core';

export const renderFilteredItems = (
  updatedItemListData: any,
  isAemEnvironment: Element,
  listElementClassName: string,
  updatedListElements: Array<HTMLElement>,
  mediaItemsContainer: HTMLElement,
  developmentEnvUrl: string | undefined,
) => {
  cleanElement(mediaItemsContainer);
  updatedItemListData.forEach((item: any) => {
    if (!isAemEnvironment) {
      item.image.src = `${developmentEnvUrl}${item.image.src}`;
      item.lightbox.image.src = `${developmentEnvUrl}${item.lightbox.image.src}`;
    }
    const listElement = document.createElement('li');
    listElement.className = listElementClassName;
    listElement && renderItem(listElement, O41MediaCardTemplate, item);
    updatedListElements.push(listElement);
  });
};

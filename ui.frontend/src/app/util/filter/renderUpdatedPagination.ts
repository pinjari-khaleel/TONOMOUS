import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import O57PaginationItemTemplate from 'app/component/organism/o57-pagination-item/o57-pagination-item.hbs?include';
import { cleanElement } from 'muban-core';

export const renderUpdatedPagination = (
  updatedPaginationPages: any,
  paginationContainer: Element | null | undefined,
  paginationList: HTMLElement,
  updatedPaginationItems: Array<HTMLElement>,
) => {
  if (updatedPaginationPages && updatedPaginationPages.length > 1) {
    paginationContainer?.classList.remove(StateClassNames.HIDDEN);
    paginationList && cleanElement(paginationList);

    updatedPaginationPages.forEach((item: any) => {
      const listElement = document.createElement('li');
      listElement.className = 'o-pagination__item';
      listElement && renderItem(listElement, O57PaginationItemTemplate, item);
      updatedPaginationItems.push(listElement);
    });
  } else {
    paginationContainer?.classList.add(StateClassNames.HIDDEN);
  }
};

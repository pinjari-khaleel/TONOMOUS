import { addEventListener } from 'seng-disposable-event-listener';
import Carousel from './Carousel';
import DisposableManager from 'seng-disposable-manager/lib/DisposableManager';

/**
 * Util that generates bullets based on the provided carousel instance
 *
 * NOTE: You will still need to append them to the DOM.
 *
 * @param carouselInstance - The instance of the Carousel that needs the bullets.
 * @param disposables - The instance of the disposable manager where you want to add the click listeners to.
 */
export const createBullets = (
  carouselInstance: Carousel,
  disposables: DisposableManager,
): Array<HTMLElement> =>
  Array.from({ length: carouselInstance.getSlideCount() }, (_, index) => {
    // Create the elements
    const li = document.createElement('li');
    const button = document.createElement('button');

    // For accessibility reasons we add the index of the slide it refers to.
    button.innerHTML = String(index);

    // Add listeners to all the bullets so we can open the correct slide.
    disposables.add(addEventListener(button, 'click', () => carouselInstance.open(index)));

    li.classList.add('bullet');
    li.appendChild(button);

    return li;
  });

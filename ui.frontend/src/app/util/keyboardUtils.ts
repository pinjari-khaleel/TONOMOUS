import { addEventListener } from 'seng-disposable-event-listener';
import { Key } from 'ts-key-enum';

type KeyPressCallback = (event: KeyboardEvent) => void;

/**
 * Will add an keyboard event and listen for the provided key
 *
 * @param keys - The key where you want to bind the event to
 * @param callback - The callback that will be triggered if the user presses the key
 */
export const addKeyPressListener = (
  keys: Key | Array<Key>,
  callback: KeyPressCallback,
): (() => void) =>
  addEventListener(document, 'keydown', (event: KeyboardEvent) => {
    if (Array.isArray(keys) ? keys.includes(event.key as Key) : event.key === keys) {
      callback(event);
    }
  });

/**
 * Will add an keyboard event and listen for the escape key
 *
 * @param callback - The callback that will be triggered if the user presses the `Escape` key
 */
export const addEscapeKeyListener = (callback: KeyPressCallback): (() => void) =>
  addKeyPressListener(Key.Escape, callback);

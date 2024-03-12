import Key from 'mediamonks-webgl/utils/input/Key';

export default class KeyListener {
  private keyState: { [k: string]: boolean } = {};
  private keyHitCallbacks: { [k: string]: (() => void)[] } = {};
  private static _instance: KeyListener;

  constructor(win: any = window) {
    if (KeyListener._instance) {
      console.log('!-use static methods!');
    }

    win.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const code = e.key;
        KeyListener.instance.keyState[code] = true;
        if (KeyListener.instance.keyHitCallbacks[code]) {
          KeyListener.instance.keyHitCallbacks[code].forEach((callback) => {
            callback();
          });
        }
      },
      false,
    );

    win.addEventListener(
      'keyup',
      (e: KeyboardEvent) => {
        const code = e.key;
        KeyListener.instance.keyState[code] = false;
      },
      false,
    );
  }

  private static get instance(): KeyListener {
    if (!KeyListener._instance) {
      KeyListener._instance = new KeyListener();
    }
    return KeyListener._instance;
  }

  public static getKeyCodeDown(code: Key): boolean {
    return KeyListener.instance.keyState[code];
  }

  public static addKeyHitEvent(code: Key, callback: () => void): void {
    if (!KeyListener.instance.keyHitCallbacks[code]) {
      KeyListener.instance.keyHitCallbacks[code] = [];
    }
    KeyListener.instance.keyHitCallbacks[code].push(callback);
  }
}

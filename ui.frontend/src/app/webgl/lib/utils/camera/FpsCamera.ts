import Vector2 from '../../renderer/math/Vector2';
import Renderer from '../../renderer/render/Renderer';
import FlyCamera from './FlyCamera';

/**
 * Created by reinder on 20/01/17.
 */

class FpsCamera extends FlyCamera {
  private _enabled: boolean = false;
  private _mouseMovement: Vector2 = new Vector2();
  private _mouseMovementAdd: Vector2 = new Vector2();

  constructor(
    renderer: Renderer,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 100,
    invertMouse: boolean = true,
  ) {
    super(renderer, fov, nearPlane, farPlane, invertMouse);

    this._mouseListener.addClickEvent(() => {
      this.lockPointer();
    });

    document.addEventListener(
      'mousemove',
      (event: any) => {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this._mouseMovementAdd.x += movementX / 500;
        this._mouseMovementAdd.y += movementY / 500;
      },
      false,
    );

    this.setDamping(1000);
  }

  public getMouseDown(): boolean {
    return true;
  }

  public getMouseSpeed(): Vector2 {
    if (this._enabled) {
      this._mouseMovement.copy(this._mouseMovementAdd);
      this._mouseMovementAdd.setValues(0, 0);
      return this._mouseMovement;
    } else {
      return new Vector2();
    }
  }

  private lockPointer(): void {
    const message = document.getElementById('message');
    const blocker = document.getElementById('blocker');
    const pointerlockerror = () => {
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.keyCode == 27) {
            // ESC
            //       controls.enabled = false;
            //       blocker.style.display = 'block';
            //       message.style.display = 'none';
          }
        },
        false,
      );
      //     message.innerHTML = document.getElementById('errorMessage').innerHTML;
      //    blocker.style.display = 'none';
      //     message.style.display = 'block';
      //   controls.enabled = true;
    };

    const havePointerLock =
      'pointerLockElement' in document ||
      'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document;

    if (havePointerLock) {
      const _body: any = document.body;
      const _doc: any = document;
      _body.requestPointerLock =
        _body.requestPointerLock || _body.mozRequestPointerLock || _body.webkitRequestPointerLock;

      const pointerlockchange = () => {
        if (
          _doc.pointerLockElement === _body ||
          _doc.mozPointerLockElement === _body ||
          _doc.webkitPointerLockElement === _body
        ) {
          this._enabled = true;
          //      blocker.style.display = 'none';
          //      message.style.display = 'block';
        } else {
          this._enabled = false;
          //    blocker.style.display = 'block';
          //    message.style.display = 'none';
        }
      };
      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      if (/Firefox/i.test(navigator.userAgent)) {
        const fullscreenchange = () => {
          if (
            _doc.fullscreenElement === _body ||
            _doc.mozFullscreenElement === _body ||
            _doc.mozFullScreenElement === _body
          ) {
            _doc.removeEventListener('fullscreenchange', fullscreenchange);
            _doc.removeEventListener('mozfullscreenchange', fullscreenchange);
            _body.requestPointerLock();
            this._enabled = true;
          } else {
            this._enabled = false;
          }
        };
        _doc.addEventListener('fullscreenchange', fullscreenchange, false);
        _doc.addEventListener('mozfullscreenchange', fullscreenchange, false);
        _body.requestFullscreen =
          _body.requestFullscreen ||
          _body.mozRequestFullscreen ||
          _body.mozRequestFullScreen ||
          _body.webkitRequestFullscreen;
        _body.requestFullscreen();
      } else {
        _body.requestPointerLock();
      }
    } else {
      pointerlockerror();
    }
  }
}

export default FpsCamera;

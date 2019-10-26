import RippleRender from './RippleRender';
import enableKeyboardFocus from './enableKeyboardFocus';
import KeyboardFocusWrapper from './KeyboardFocusWrapper';
import { RippleConfig } from './types';

const defaultRippleConfig = {
  enableKeyboardFocus: true,
};

/**
 * 启用Ripple效果的元素
 *
 * @export
 * @class RippleElement
 */
export default class RippleElement {
  private rippleRender: RippleRender;

  private keyboardFocusHandler?: KeyboardFocusWrapper;

  private rippleConfig: RippleConfig;

  private eventTriggers: Array<{
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any;
  }> = [];

  private enabled = false;

  constructor(
    private element: HTMLElement,
    rippleConfig: RippleConfig = defaultRippleConfig,
  ) {
    this.rippleConfig = {
      ...defaultRippleConfig,
      ...rippleConfig,
    };

    this.rippleRender = new RippleRender(element, this.rippleConfig);

    this.enable();
  }

  public setConfig(rippleConfig: RippleConfig = defaultRippleConfig) {
    this.rippleConfig = {
      ...defaultRippleConfig,
      ...rippleConfig,
    };
    this.rippleRender.setConfig(this.rippleConfig);
  }

  /**
   * 取消ripple效果
   */
  public cancel() {
    this.rippleRender.clean();
    if (this.keyboardFocusHandler) {
      this.keyboardFocusHandler.clean();
    }
    this.eventTriggers.forEach(({ name, callback }) => {
      this.element.removeEventListener(name, callback, false);
    });
  }

  /**
   * 禁用ripple效果
   */
  public disable() {
    if (this.enabled === false) {
      return;
    }
    this.enabled = false;
    this.cancel();
  }

  /**
   * 启用ripple效果
   */
  public enable() {
    if (this.enabled) {
      return;
    }

    this.eventTriggers = [];
    this.enabled = true;

    this.enableDesktopClickRipple();
    this.enableMobileTouchRipple();

    this.eventTriggers.forEach(({ name, callback }) => {
      this.element.addEventListener(name, callback, false);
    });

    if (this.rippleConfig.enableKeyboardFocus) {
      this.onSpaceDownWhenKeyboardFocus = this.onSpaceDownWhenKeyboardFocus.bind(
        this,
      );
      this.onSpaceUpWhenKeyboardFocus = this.onSpaceUpWhenKeyboardFocus.bind(
        this,
      );
      this.enableKeyboardFocusRipple();
    }
  }

  private ignoringMouseDown = false;

  /**
   * 开始水波纹效果
   */
  private start = (event: MouseEvent | TouchEvent) => {
    if (event && event.type === 'mousedown' && this.ignoringMouseDown) {
      this.ignoringMouseDown = false;
      return;
    }
    if (event && event.type === 'touchstart') {
      this.ignoringMouseDown = true;
    }

    this.rippleRender.addRipple();
  };

  private enableDesktopClickRipple() {
    this.eventTriggers.push(
      {
        name: 'mousedown',
        callback: this.start,
      },
      {
        name: 'mouseup',
        callback: this.rippleRender.removeRipple,
      },
      {
        name: 'mouseleave',
        callback: this.rippleRender.removeRipple,
      },
    );
  }

  private enableMobileTouchRipple() {
    this.eventTriggers.push(
      {
        name: 'touchstart',
        callback: this.start,
      },
      {
        name: 'touchmove',
        callback: this.rippleRender.removeRipple,
      },
      {
        name: 'touchend',
        callback: this.rippleRender.removeRipple,
      },
    );
  }

  private enableKeyboardFocusRipple() {
    this.keyboardFocusHandler = enableKeyboardFocus(this.element, {
      onFocus: this.rippleRender.focusRipple,
      onBlur: this.rippleRender.blurRipple,
      onSpaceDown: this.onSpaceDownWhenKeyboardFocus,
      onSpaceUp: this.onSpaceUpWhenKeyboardFocus,
    });
  }

  private onSpaceDownWhenKeyboardFocus(_event: KeyboardEvent) {
    this.rippleRender.blurRipple().then(() => this.rippleRender.addRipple());
  }

  private onSpaceUpWhenKeyboardFocus() {
    this.rippleRender.removeRipple().then(this.rippleRender.focusRipple);
  }
}

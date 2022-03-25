/* eslint-disable @typescript-eslint/no-non-null-assertion */
import keycode from 'keycode';
import isMobile from 'is-mobile';
import {
  detectKeyboardFocus,
  focusKeyPressed,
  listenForFocusKeys,
} from './keyboardFocus';

export interface KeyboardFocusEventListeners {
  onFocus?: () => void;
  onBlur?: () => void;
  onSpaceDown?: (event: KeyboardEvent) => void;
  onSpaceUp?: (event: KeyboardEvent) => void;
}

/**
 * 产生KeyboardFocus相关事件的事件包装器
 */
export default class KeyboardFocusWrapper {
  private keyboardFocused = false;

  private keyDown = false;

  private eventTriggers: Array<{
    name: string;
    callback: any;
  }>;

  private mobile = isMobile();

  public readonly keyboardFocusCheckTime: number = 50;

  public readonly keyboardFocusMaxCheckTimes: number = 5;

  public keyboardFocusTimeout = -1;

  /**
   * Creates an instance of KeyboardFocusWrapper.
   * @param {HTMLElement} element 产生事件的HTML元素
   * @param {KeyboardFocusEventListeners} eventListeners 事件监听器
   */
  constructor(
    private readonly element: HTMLElement,
    private readonly eventListeners: KeyboardFocusEventListeners,
  ) {
    listenForFocusKeys();

    this.onKeyboardFocus = this.onKeyboardFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.eventTriggers = [
      {
        name: 'focus',
        callback: this.onFocus.bind(this),
      },
      {
        name: 'mousedown',
        callback: this.onBlur,
      },
      {
        name: 'blur',
        callback: this.onBlur,
      },
      {
        name: 'keydown',
        callback: this.onKeyDown.bind(this),
      },
      {
        name: 'keyup',
        callback: this.onKeyUp,
      },
    ];

    if (this.mobile) {
      this.eventTriggers.push({
        name: 'touchstart',
        callback: this.onBlur,
      });
    }

    this.eventTriggers.forEach(({ name, callback }) =>
      this.element.addEventListener(name, callback, false),
    );
  }

  public clean() {
    this.eventTriggers.forEach(({ name, callback }) => {
      this.element.removeEventListener(name, callback, false);
    });
  }

  private onFocus(_event: FocusEvent) {
    detectKeyboardFocus(this, this.element, this.onKeyboardFocus);
  }

  private onKeyboardFocus() {
    this.keyDown = false;
    this.keyboardFocused = true;

    this.eventListeners.onFocus!();
  }

  private onBlur() {
    clearTimeout(this.keyboardFocusTimeout);
    focusKeyPressed(false);

    if (this.keyboardFocused) {
      this.keyboardFocused = false;
      this.eventListeners.onBlur!();
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    const key = keycode(event);

    if (!this.keyDown && this.keyboardFocused && key === 'space') {
      this.keyDown = true;
      this.eventListeners.onSpaceDown!(event);
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const key = keycode(event);

    if (this.keyboardFocused && key === 'space') {
      this.keyDown = false;

      this.eventListeners.onSpaceUp!(event);
    }
  }
}

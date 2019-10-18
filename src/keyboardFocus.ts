/* eslint-disable no-param-reassign */
import keycode from 'keycode';
import warning from 'warning';
import contains from 'dom-helpers/query/contains';

/**
 * 用户可以通过按下一些键盘中的键，让页面元素获取到焦点。此文件是实现监测指定页面元素是否发生了这种情况。
 *
 * 我们称这样的焦点为**键盘焦点**（`keyboardFocus`），称可以产生键盘焦点的键为**焦点键**。
 */

const internal = {
  listening: false,
  focusKeyPressed: false,
};

/**
 * 获取或者设置是否由按下键盘获取到焦点
 *
 * @param {boolean?} pressed
 */
export function focusKeyPressed(pressed?: boolean) {
  if (typeof pressed !== 'undefined') {
    internal.focusKeyPressed = Boolean(pressed);
  }

  return internal.focusKeyPressed;
}

/**
 * 检测是否处于键盘焦点状态。
 *
 * @param instance 检测源
 * @param element 检测对象
 * @param callback 键盘焦点事件的回调函数
 * @param attempt 第几次尝试检测
 */
export function detectKeyboardFocus(
  instance: {
    keyboardFocusCheckTime: number;
    keyboardFocusMaxCheckTimes: number;
    keyboardFocusTimeout: number;
  },
  element: HTMLElement,
  callback: () => void,
  attempt = 1,
) {
  warning(
    instance.keyboardFocusCheckTime,
    'missing instance.keyboardFocusCheckTime',
  );
  warning(
    instance.keyboardFocusMaxCheckTimes,
    ' missing instance.keyboardFocusMaxCheckTimes',
  );

  const time = instance.keyboardFocusCheckTime;
  instance.keyboardFocusTimeout = window.setTimeout(() => {
    const { activeElement } = document;
    if (
      focusKeyPressed() &&
      (activeElement === element ||
        (!!activeElement && contains(element, activeElement)))
    ) {
      callback();
    } else if (attempt < instance.keyboardFocusMaxCheckTimes) {
      detectKeyboardFocus(instance, element, callback, attempt + 1);
    }
  }, time);
}

/**
 * 可引起焦点变化的按键，称之为**焦点键**。
 */
const FOCUS_KEYS = [
  'tab',
  'enter',
  'space',
  'esc',
  'up',
  'down',
  'left',
  'right',
];

/**
 * 判断按下的是否是焦点键
 *
 * @export
 * @param {KeyboardEvent} event
 * @returns
 */
export function isFocusKey(event: KeyboardEvent) {
  return FOCUS_KEYS.indexOf(keycode(event)) !== -1;
}

/**
 * 按下键盘的监听器
 *
 * @export
 * @param {KeyboardEvent} event 按下键盘事件
 */
export function onKeyup(event: KeyboardEvent) {
  if (isFocusKey(event)) {
    internal.focusKeyPressed = true;
  }
}

/**
 * 全局监控可引起焦点变化的键盘输入事件
 *
 * @export
 */
export function listenForFocusKeys() {
  // It's a singleton, we only need to listen once.
  // Also, this logic is client side only, we don't need a teardown.
  if (!internal.listening) {
    window.addEventListener('keyup', onKeyup, false);
    internal.listening = true;
  }
}

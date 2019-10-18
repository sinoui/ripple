import KeyboardFocusWrapper, {
  KeyboardFocusEventListeners,
} from './KeyboardFocusWrapper';

/**
 * 启用键盘焦点事件
 *
 * @export
 * @param {HTMLElement} element 监听事件的元素
 * @param {KeyboardFocusEventListeners} eventListeners 事件监听器
 * @returns 返回键盘焦点事件监控的包装器
 */
export default function enableKeyboardFocus(
  element: HTMLElement,
  eventListeners: KeyboardFocusEventListeners,
) {
  return new KeyboardFocusWrapper(element, eventListeners);
}

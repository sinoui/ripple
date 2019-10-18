import RippleElement from './RippleElement';
import { RippleConfig } from './types';

/**
 * 给元素应用上ripple效果
 *
 * @param element 应用ripple效果的元素
 * @param rippleConfig ripple效果配置
 */
export default function enableRipple(
  element: HTMLElement,
  rippleConfig: RippleConfig,
) {
  return new RippleElement(element, rippleConfig);
}

export interface RippleConfig {
  /**
   * 居中显示
   */
  center?: boolean;
  /**
   * 启用键盘focus
   */
  enableKeyboardFocus?: boolean;
  /**
   * 给ripple应用的css样式名
   */
  rippleClassName?: string;
  /**
   * 给ripple容器应用的css样式名
   */
  rippleLayoutClassName?: string;
  /**
   * 固定ripple的尺寸
   */
  fixSize?: boolean;
  /**
   * 指定水波纹的颜色
   */
  color?: string;
  /**
   * 不可用状态
   */
  disabled?: boolean;
}

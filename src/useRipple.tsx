import { useRef, useEffect } from 'react';
import { RippleConfig } from './types';
import enableRipple from './enableRipple';
import RippleElement from './RippleElement';

const defaultConfig = {};

/**
 * 使用水波纹效果
 *
 * @param config 配置
 */
export default function useRipple<T extends HTMLElement>(
  config: RippleConfig & {
    position?: 'absolute' | 'relative' | 'fixed' | 'static';
    color?: string;
  } = defaultConfig,
  disabled?: boolean,
) {
  const domRef = useRef<T>();
  const rippleRef = useRef<RippleElement>();

  useEffect(() => {
    if (domRef.current && !disabled) {
      rippleRef.current = enableRipple(domRef.current, config);

      if (config.position) {
        domRef.current.style.position = config.position;
      } else if (domRef.current.style.position === 'static') {
        domRef.current.style.position = 'relative';
      }
    }

    return () => {
      if (rippleRef.current) {
        rippleRef.current.cancel();
        rippleRef.current = undefined;
      }
    };
  }, [disabled, config]);

  return domRef;
}

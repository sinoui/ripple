import { useRef, useEffect, useMemo } from 'react';
import { RippleConfig } from './types';
import enableRipple from './enableRipple';
import RippleElement from './RippleElement';

const defaultConfig = {};

/**
 * 使用水波纹效果
 * /**
 * @deprecated 从1.0.0版本开始，建议disabled放入config中处理
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

  const isDisabled = useMemo(() => disabled || config.disabled, [
    config.disabled,
    disabled,
  ]);

  useEffect(() => {
    if (domRef.current && !isDisabled) {
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
  }, [isDisabled, config]);

  return domRef;
}

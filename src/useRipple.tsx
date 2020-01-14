import { useRef, useEffect } from 'react';
import { RippleConfig } from './types';
import enableRipple from './enableRipple';
import RippleElement from './RippleElement';

const defaultConfig = {};

/**
 * 启用水波纹效果
 *
 * @param config 配置
 * @param disabled 禁用。注意：从1.0.0版本开始，disabled放入config中处理
 */
export default function useRipple<T extends HTMLElement>(
  config: RippleConfig & {
    position?: 'absolute' | 'relative' | 'fixed' | 'static';
    color?: string;
  } = defaultConfig,
  disabled?: boolean,
) {
  const configRef = useRef(config);
  const isDisabled = config.disabled || disabled;
  const domRef = useRef<T | null>(null);
  const rippleRef = useRef<RippleElement | null>(null);

  useEffect(() => {
    const element = domRef.current;
    if (!element) {
      return undefined;
    }

    const ripple = enableRipple(element, configRef.current);
    rippleRef.current = ripple;

    return () => {
      ripple.disable();
    };
  }, []);

  useEffect(() => {
    if (!rippleRef.current) {
      return;
    }
    if (isDisabled) {
      rippleRef.current.disable();
    } else {
      rippleRef.current.enable();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (rippleRef.current) {
      rippleRef.current.setConfig(config);
    }
  }, [config]);

  const { position = 'relative' } = config;

  useEffect(() => {
    const element = domRef.current;

    if (element && element.addEventListener) {
      const { position: originPosition } = getComputedStyle(element, null);
      if (originPosition === 'static') {
        element.style.position = position;
        return () => {
          element.style.position = 'static';
        };
      }
    }

    return undefined;
  }, [position]);

  return domRef;
}

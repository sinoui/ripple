import React from 'react';
import { findDOMNode } from 'react-dom';
import { RippleConfig } from './types';
import RippleElement from './RippleElement';

interface BaseProps {
  disabled?: boolean;
}

const withRipple = (rippleConfig?: RippleConfig) => {
  function createEnableRippleComponent<P extends BaseProps>(Component: any) {
    const name =
      typeof Component === 'string' ? Component : Component.displayName;
    return class EnableRippleComponent extends React.Component<P> {
      // eslint-disable-next-line react/static-property-placement
      public static displayName = `withRipple(${name})`;

      public static sinouiName = name;

      public rippleElement?: RippleElement;

      public componentDidMount() {
        this.createRippleElement();
      }

      public componentDidUpdate(prevProps: P) {
        const { disabled } = this.props;
        const disabledChanged = prevProps.disabled !== disabled;

        if (disabledChanged && disabled && this.rippleElement) {
          this.rippleElement.disable();
        } else if (disabledChanged && !disabled) {
          if (!this.rippleElement) {
            this.createRippleElement();
          } else {
            this.rippleElement.enable();
          }
        }
      }

      public componentWillUnmount() {
        if (this.rippleElement) {
          this.rippleElement.cancel();
        }
      }

      public createRippleElement() {
        // eslint-disable-next-line react/no-find-dom-node
        const element = findDOMNode(this) as HTMLElement;
        this.rippleElement = new RippleElement(element, rippleConfig);
        requestAnimationFrame(() => {
          const { position } = window.getComputedStyle(element);
          if (!position || position === 'static') {
            element.style.position = 'relative';
          }
        });
      }

      public render() {
        return <Component {...this.props} />;
      }
    };
  }

  return createEnableRippleComponent;
};

export default withRipple;

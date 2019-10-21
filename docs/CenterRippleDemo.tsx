import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useRipple } from '../src';

const Wrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: transparent;
  outline: none;
  border: 0px;
  padding: 0px;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  &::-moz-focus-inner {
    border-style: none;
  }
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  margin: 8px;
  overflow: visible;

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &.sinoui-icon-button-disabled {
    pointer-events: none;
    cursor: default;
  }

  .sinoui-icon-button__ripple-layout {
    left: -14px;
    top: -14px;
    width: 48px;
    height: 48px;
  }

  .sinoui-icon-button__ripple {
    width: 48px;
    height: 48px;
  }
`;

function CenterRipple(props) {
  const rippleRef = useRipple({
    center: true,
    rippleLayoutClassName: 'sinoui-icon-button__ripple-layout',
    rippleClassName: 'sinoui-icon-button__ripple',
    fixSize: true,
  });
  const { disabled } = props;
  return (
    <Wrapper
      className={classNames('sinoui-icon-button', {
        'sinoui-icon-button-disabled': disabled,
      })}
      ref={rippleRef}
      {...props}
    />
  );
}

export default function CenterRippleDemo() {
  return <CenterRipple>Avatar</CenterRipple>;
}

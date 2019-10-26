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
  padding: 8px 16px;
  min-width: 88px;
  min-height: 36px;
  box-sizing: border-box;
  margin: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &.sinoui-button-disabled {
    pointer-events: none;
    cursor: default;
  }

  -webkit-tap-highlight-color: transparent;
`;

export default function SimpleButton(props) {
  const rippleRef = useRipple();
  const { disabled } = props;
  return (
    <Wrapper
      className={classNames('sinoui-button', {
        'sinoui-button-disabled': disabled,
      })}
      ref={rippleRef}
      {...props}
    />
  );
}

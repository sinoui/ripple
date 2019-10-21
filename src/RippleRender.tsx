/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ReactDOM from 'react-dom';
import { keyframes, createGlobalStyle, css } from 'styled-components';
import React from 'react';
import { RippleConfig } from './types';

const rippleEnter = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3,
  }
`;

const enterAnimationRule = css`
  animation: ${rippleEnter} 450ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const ripplePulsate = keyframes`
  0% {
      transform: scale(1);
  }

  50% {
      transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;

const pulsateAnimationRule = css`
  animation: ${ripplePulsate} 2500ms cubic-bezier(0.4, 0, 0.2, 1) 200ms infinite;
`;

const rippleExit = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0%;
  }
`;

const exitAnimationRule = css`
  animation: ${rippleExit} 400ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const RippleStyle = createGlobalStyle`
  .sinoui-ripple-element {
    position: relative;
  }
  .sinoui-ripple-layout {
    position: absolute;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .sinoui-button-ripple-layout {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .sinoui-ripple {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    opacity: 0.3;
    transform: scale(1);
    ${enterAnimationRule};
  }

  .sinoui-ripple::after {
    content: ' ';
    width: 100%;
    height: 100%;
    opacity: 1;
    display: block;
    border-radius: 50%;
    background-color: currentColor;
  }

  .sinoui-ripple-pulsate {
    animation-duration: 200ms;
  }

  .sinoui-ripple-pulsate::after {
    position: absolute;
    top: 0;
    left: 0;
    ${pulsateAnimationRule};
  }

  .sinoui-ripple-exit::after {
    opacity: 0;
    ${exitAnimationRule};
  }
`;

const id = 'sinouiRippleStyle';
function addRippleRules() {
  if (!document.getElementById(id)) {
    const div = document.createElement('div');
    div.id = id;
    document.body.appendChild(div);
    ReactDOM.render(<RippleStyle />, div);
  }
}

export default class RippleRender {
  private rippleLayout: HTMLElement | undefined;

  private rippleInstances: HTMLElement[];

  private focusRippleInstance: HTMLElement | undefined;

  private timeouts: number[];

  private containerRect: ClientRect | null = null;

  private containerRectTimeout = -1;

  public constructor(
    private element: HTMLElement,
    private rippleConfig: RippleConfig,
  ) {
    addRippleRules();
    this.focusRipple = this.focusRipple.bind(this);
    this.blurRipple = this.blurRipple.bind(this);
    this.addRipple = this.addRipple.bind(this);
    this.removeRipple = this.removeRipple.bind(this);
    this.rippleInstances = [];
    this.timeouts = [];
  }

  public setConfig(rippleConfig: RippleConfig) {
    this.rippleConfig = rippleConfig;
  }

  /**
   * 显示focus状态下的ripple效果，为pulsate效果。
   *
   * @returns
   * @memberof RippleRender
   */
  public focusRipple() {
    this.addRippleLayout();
    const ripplePos = this.getRipplePos(true);
    const rippleSize = this.getCenterRippleSize();
    const ripple = this.createRippleInstance(ripplePos, rippleSize);
    ripple.classList.add('sinoui-ripple-pulsate');
    this.rippleLayout!.appendChild(ripple);
    this.focusRippleInstance = ripple;
    return Promise.resolve();
  }

  public blurRipple() {
    if (this.focusRippleInstance) {
      this.rippleLayout!.removeChild(this.focusRippleInstance);
    }
    return Promise.resolve();
  }

  /**
   * 添加ripple
   *
   * @param {(MouseEvent | TouchEvent)} [event]
   */
  public addRipple(event?: MouseEvent | TouchEvent) {
    this.addRippleLayout();
    const ripplePos = this.getRipplePos(this.rippleConfig.center, event);
    const rippleSize = this.getRippleSize(ripplePos);
    const ripple = this.createRippleInstance(ripplePos, rippleSize);
    this.rippleLayout!.appendChild(ripple);
    this.rippleInstances.push(ripple);
    return Promise.resolve();
  }

  /**
   * 删除ripple
   */
  public removeRipple() {
    const ripple = this.rippleInstances.shift();
    if (ripple) {
      ripple.classList.add('sinoui-ripple-exit');
      const timeout = setTimeout(() => {
        this.clearContainerRect();
        this.rippleLayout!.removeChild(ripple);
        this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
      }, 550);
      this.timeouts.push(timeout);
    }
    return Promise.resolve();
  }

  public clean() {
    clearTimeout(this.containerRectTimeout);
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }

  private clearContainerRect() {
    clearTimeout(this.containerRectTimeout);
    const timeout = setTimeout(() => {
      if (this.rippleInstances.length === 0) {
        this.containerRect = null;
      }
    }, 450);
    this.containerRectTimeout = timeout;
  }

  private getContainerRect() {
    if (!this.containerRect) {
      this.containerRect = this.rippleLayout!.getBoundingClientRect();
    }

    return this.containerRect;
  }

  private createRippleInstance(
    ripplePos: { x: number; y: number },
    rippleSize: number,
  ) {
    const ripple = document.createElement('span');
    if (!this.rippleConfig.fixSize) {
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;
    }
    if (!this.rippleConfig.center) {
      ripple.style.left = `${-(rippleSize / 2) + ripplePos.x}px`;
      ripple.style.top = `${-(rippleSize / 2) + ripplePos.y}px`;
    }
    ripple.classList.add('sinoui-ripple');
    if (this.rippleConfig.rippleClassName) {
      ripple.classList.add(this.rippleConfig.rippleClassName);
    }
    return ripple;
  }

  private getRippleSize(pos: { x: number; y: number }) {
    const sizeX =
      Math.max(Math.abs(this.getContainerRect().width - pos.x), pos.x) * 2 + 2;
    const sizeY =
      Math.max(Math.abs(this.getContainerRect().height - pos.y), pos.y) * 2 + 2;
    const rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);

    return rippleSize;
  }

  /**
   * 获取在元素中心显示的ripple的尺寸
   *
   * @private
   * @memberof RippleRender
   */
  private getCenterRippleSize() {
    const rect = this.getContainerRect();
    const rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);

    return rippleSize;
  }

  /**
   * 获取ripple元素的尺寸
   *
   * @private
   * @param {boolean} center
   * @param {(MouseEvent | TouchEvent)} [event]
   * @returns
   * @memberof RippleRender
   */
  private getRipplePos(
    center: boolean | undefined,
    event?: MouseEvent | TouchEvent,
  ) {
    const rect = this.getContainerRect();

    if (center || !event) {
      return {
        x: rect.width / 2,
        y: rect.height / 2,
      };
    }

    const clientX =
      (event as MouseEvent).clientX ||
      ((event as TouchEvent).touches
        ? (event as TouchEvent).touches[0].clientX
        : 0);
    const clientY =
      (event as MouseEvent).clientY ||
      ((event as TouchEvent).touches
        ? (event as TouchEvent).touches[0].clientY
        : 0);

    if (clientX === 0 && clientY === 0) {
      return {
        x: rect.width / 2,
        y: rect.height / 2,
      };
    }

    return {
      x: Math.round(clientX - rect.left),
      y: Math.round(clientY - rect.top),
    };
  }

  private addRippleLayout() {
    if (!this.rippleLayout) {
      this.rippleLayout = document.createElement('span');
      // 修复IE不支持多参数的add引起的bug：[can i use - classList](https://caniuse.com/#feat=classlist)
      this.rippleLayout.classList.add('sinoui-ripple-layout');
      this.rippleLayout.classList.add(
        this.rippleConfig.rippleLayoutClassName ||
          'sinoui-button-ripple-layout',
      );
      if (this.rippleConfig.color) {
        this.rippleLayout.style.color = this.rippleConfig.color;
      }
      this.element.appendChild(this.rippleLayout);
    }
  }
}

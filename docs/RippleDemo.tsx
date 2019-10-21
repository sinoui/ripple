import React from 'react';
import { useRipple } from '../src';

interface Props {
  children?: React.ReactNode;
}

function RippleButton(props: Props) {
  const ref = useRipple<HTMLButtonElement>();

  return (
    <button type="button" className="sinoui-button" {...props} ref={ref} />
  );
}

export default function RippleDemo() {
  return <RippleButton>这是按钮</RippleButton>;
}

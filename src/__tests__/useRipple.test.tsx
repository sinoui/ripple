import React from 'react';
import renderer from 'react-test-renderer';
import withRipple from '../withRipple';

const Demo = () => <div>test</div>;
const RippleDemo = withRipple({})(Demo);

it('快照测试', () => {
  const tree = renderer.create(<RippleDemo />);

  expect(tree.toJSON()).toMatchSnapshot();
});

const { forEach } = Array.prototype;

const elementsForEach = <T extends Node>(
  nodeList: NodeListOf<T>,
  fn: (element: T, index: number) => void,
) => {
  forEach.call(nodeList, fn);
};

export default elementsForEach;

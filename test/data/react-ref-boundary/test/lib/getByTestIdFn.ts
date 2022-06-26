import { ReactTestInstance } from 'react-test-renderer';

function findByTestId(node, id) {
  if (node.props && node.props['testID'] === id) return node;

  for (let index = 0; index < node.children.length; index++) {
    const found = findByTestId(node.children[index], id);
    if (found) return found;
  }
  return null;
}

// TODO: figure out why getByTestId fails on react-native-web
export default function findByTestIdFn(
  container: ReactTestInstance,
): (id) => ReactTestInstance {
  return function getByTestId(id: string) {
    return findByTestId(container, id);
  };
}

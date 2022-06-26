import type { ReactTestInstance } from 'react-test-renderer';
import type { NativeElement } from '../../src/index';

let _nativeTag = 1;
const map = new Map();

export default function toNativeElement(
  node: ReactTestInstance | string,
): NativeElement {
  const found = map.get(node);
  if (found) {
    return found;
  }

  let NativeElement = null;
  if (!(node as ReactTestInstance).children) {
    NativeElement = { _nativeTag: _nativeTag++, _children: [] };
  } else {
    NativeElement = {
      _nativeTag: _nativeTag++,
      _children: (node as ReactTestInstance).children.map(toNativeElement),
    };
  }
  map.set(node, NativeElement);
  return NativeElement;
}

function match(element: Element, testID: string): boolean {
  const propsKey = Object.keys(element).find(function (x) {
    return x.startsWith('__reactProps');
  });
  return propsKey ? element[propsKey]['data-testid'] === testID : false;
}

export default function getByTestId(element: Element, testID: string) {
  if (Array.isArray(element)) {
    for (let i = 0; i < element.length; i++) {
      const found = getByTestId(element[i], testID);
      if (found) return found;
    }
    return null;
  } else {
    if (match(element, testID)) return element;
    if (!element.children) return;
    for (let i = 0; i < element.children.length; i++) {
      const found = getByTestId(element.children[i], testID);
      if (found) return found;
    }
    return null;
  }
}

## react-ref-boundary

React context for grouping react references by boundary in react dom, native and web. Ideal for group references for contains checks when using react portals.

### Example 1

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

function NonBoundaryComponent() {
  const ref = React.useRef < HTMLDivElement > null;
  return <div ref={ref} />;
}

function BoundaryComponent() {
  const ref = useRef < HTMLDivElement > null;
  return <div ref={ref} />;
}

function BoundaryChecker() {
  const boundary = useBoundary();
  return (
    <button
      onClick={(event) => {
        if (
          !boundary.refs.some(
            (ref) => ref.current && ref.current.contains(event.target),
          )
        ) {
          // outside all of the references
        }
      }}
    />
  );
}

function BoundaryChecker({ getRefs }) {
  const boundary = useBoundary();
  getRefs(boundary.refs);
  return <React.Fragment />;
}

render(
  <BoundaryProvider>
    <BoundaryComponent />
    <NonBoundaryComponent />
    <BoundaryComponent />
    <BoundaryChecker />
  </BoundaryProvider>,
);
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-ref-boundary/)

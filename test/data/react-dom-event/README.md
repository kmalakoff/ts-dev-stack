## react-dom-event

React context for subscribing to all DOM user interaction events.

For a react-native version, check out [react-native-event](https://www.npmjs.com/package/react-native-event)

### Example 1

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEvent, EventProvider } from 'react-dom-event';

function UseEventComponent() {
  const handler = React.useCallback((event) => {
    /* do something with any event */
  });

  useEvent(handler, [handler]);
  return <React.Fragment />;
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.Fragment>
    <EventProvider events={['click'] /* default */}>
      <UseEventComponent />
      <button id="demo-1" onClick={() => {}} />
    </EventProvider>
    <button id="demo-2" onClick={() => {}} />
  </React.Fragment>,
);

// any click will call the global event handler
document.getElementById('demo-1').click();
document.getElementById('demo-2').click();
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-dom-event/)

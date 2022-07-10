import React from 'react';

export type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => void;
};

export const EventContext = React.createContext<EventContextType | undefined>(
  undefined,
);

export type EventProviderProps = {
  events?: string[];
  children?: React.ReactNode;
};
export function EventProvider({
  events = ['click'],
  children,
}: EventProviderProps) {
  const state = React.useState<HandlerType[]>([]);
  const handlers = state[0]; // reduce transpiled array helpers

  function onEvent(event: EventTypes) {
    handlers.forEach((handler: HandlerType) => handler(event));
  }
  function subscribe(handler: HandlerType) {
    handlers.push(handler);
    return () => handlers.splice(handlers.indexOf(handler), 1);
  }

  React.useEffect(() => {
    events.forEach((event) =>
      window.document.addEventListener(event, onEvent, true),
    );
    return () =>
      events.forEach((event) =>
        window.document.removeEventListener(event, onEvent, true),
      );
  });
  return (
    <EventContext.Provider value={{ subscribe }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent(handler, dependencies) {
  const context = React.useContext(EventContext);
  if (!context) {
    throw new Error(
      'react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event',
    );
  }

  React.useEffect(
    () => context.subscribe(handler),
    [context.subscribe, handler].concat(dependencies),
  );
}

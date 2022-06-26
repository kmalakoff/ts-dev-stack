import React, {
  useState,
  useRef as useRefReact,
  useEffect,
  createContext,
  useContext,
  Ref,
  RefObject,
  ReactNode,
} from 'react';

export type RefContextType = {
  addRef: (ref: Ref<unknown>) => void;
  refs: Ref<unknown>[];
};

const RefContext = createContext<RefContextType | null>(null);

export interface BoundaryProviderProps {
  children?: ReactNode;
}
export const BoundaryProvider: React.FC<BoundaryProviderProps> = ({
  children,
}) => {
  const [refs] = useState([]);
  function addRef(ref) {
    refs.push(ref);
    return () => refs.splice(refs.indexOf(ref), 1);
  }

  return (
    <RefContext.Provider value={{ addRef, refs }}>
      {children}
    </RefContext.Provider>
  );
};

export function useRef<T>(): RefObject<T> {
  const ref = useRefReact<T>();
  const context = useContext(RefContext);
  if (!context)
    throw new Error(
      'Missing react-ref-boundary context. Check for correct use of BoundaryProvider',
    );
  useEffect(() => context.addRef(ref));
  return ref;
}

export function useBoundary() {
  const context = useContext(RefContext);
  if (!context)
    throw new Error(
      'Missing react-ref-boundary context. Check for correct use of BoundaryProvider',
    );
  return { refs: context.refs };
}

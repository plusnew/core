type invokeGuard<T> = (callback: () => T) => { hasError: true } | { hasError: false, result: T };

export type renderOptions = {
  createChildrenComponents?: boolean;
  namespace?: string;
  invokeGuard?: invokeGuard<any>;
  addAsyncListener?: (promise: Promise<void>) => void;
};

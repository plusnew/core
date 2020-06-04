export interface Suspense {
  identifier: symbol;
  addPromise: (promise: Promise<any>) => void;
  removePromise: (promise: Promise<any>) => void;
}

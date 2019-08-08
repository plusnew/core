import { IDriver } from "./driver";

type invokeGuard<T> = (callback: () => T) => { hasError: true } | { hasError: false, result: T };

export type renderOptions<HostElement, HostTextElement> = {
  driver: IDriver<HostElement, HostTextElement>;
  createChildrenComponents?: boolean;
  xmlns?: string;
  xmlnsPrefixes?: Partial<{
    [key: string]: string;
  }>;
  invokeGuard?: invokeGuard<any>;
  addAsyncListener?: (promise: Promise<void>) => void;
};

import type { portalRenderOption } from "../components/portal";
import type { IDriver } from "./driver";
import type ComponentInstance from "../instances/types/Component/Instance";

export type invokeGuard<T> = (
  callback: () => T,
  component: ComponentInstance<any, any, any>
) => { hasError: true } | { hasError: false; result: T };

export type renderOptions<HostElement, HostTextElement> = {
  driver: IDriver<HostElement, HostTextElement>;
  createChildrenComponents?: boolean;
  xmlns?: string;
  xmlnsPrefixes?: Partial<{
    [key: string]: string;
  }>;
  invokeGuard?: invokeGuard<any>;
  addAsyncListener?: (promise: Promise<void>) => void;
  portals?: portalRenderOption<HostElement, HostTextElement>;
  contexts?: { [context: symbol]: ComponentInstance<any, any, any> };
};

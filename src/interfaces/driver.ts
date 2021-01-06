import type InstanceTypes from "../instances/types/types";
import type { props } from "./component";
import type { renderOptions } from "./renderOptions";

type Instance<HostElement, HostTextElement> = {
  nodeType: InstanceTypes;
  parentInstance?: Instance<HostElement, HostTextElement>;
  renderOptions: renderOptions<HostElement, HostTextElement>;
  findParent(
    callback: (instance: Instance<HostElement, HostTextElement>) => boolean
  ): Instance<HostElement, HostTextElement> | undefined;
};

export type RootInstance<HostElement, HostTextElement> = Instance<
  HostElement,
  HostTextElement
> & { nodeType: InstanceTypes.Root; ref: HostElement };

export type HostInstance<HostElement, HostTextElement> = Instance<
  HostElement,
  HostTextElement
> & {
  nodeType: InstanceTypes.Host;
  ref: HostElement;
  type: string;
  props: props;
  setProp: (key: string, value: any) => void;
};

export type TextInstance<HostElement, HostTextElement> = Instance<
  HostElement,
  HostTextElement
> & { nodeType: InstanceTypes.Text; ref: HostTextElement };

export type IDriver<HostElement, HostTextElement> = {
  element: {
    create: (
      HostInstance: HostInstance<HostElement, HostTextElement>
    ) => HostElement;
    remove: (HostInstance: HostInstance<HostElement, HostTextElement>) => void;
    dealloc: (HostInstance: HostInstance<HostElement, HostTextElement>) => void;
    setAttribute: (
      HostInstance: HostInstance<HostElement, HostTextElement>,
      attributeName: string,
      attributeValue: any
    ) => void;
    unsetAttribute: (
      HostInstance: HostInstance<HostElement, HostTextElement>,
      attributeName: string
    ) => void;
    moveAfterSibling: (
      self: HostInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
    appendChildAfterSibling: (
      parentInstance:
        | HostInstance<HostElement, HostTextElement>
        | RootInstance<HostElement, HostTextElement>,
      childInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
    elementDidMountHook: (
      HostInstance: HostInstance<HostElement, HostTextElement>
    ) => void;
  };

  text: {
    create: (text: string) => HostTextElement;
    remove: (textInstance: TextInstance<HostElement, HostTextElement>) => void;
    update: (
      textInstance: TextInstance<HostElement, HostTextElement>,
      newText: string
    ) => void;

    moveAfterSibling: (
      self: TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
  };

  getRootElement: (
    rootInstance: RootInstance<HostElement, HostTextElement>
  ) => HostElement;
  setupPortal: (opt: {
    portalEntrance: Instance<HostElement, HostTextElement>;
    portalExit: Instance<HostElement, HostTextElement>;
  }) => void;
};

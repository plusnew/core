import DomInstance from "../instances/types/Dom/Instance";
import TextInstance from "../instances/types/Text/Instance";
import RootInstance from "instances/types/Root/Instance";

export type IDriver<HostElement, HostTextElement> = {
  element: {
    create: (domInstance: DomInstance<HostElement, HostTextElement>) => HostElement;
    remove: (domInstance: DomInstance<HostElement, HostTextElement>) => void;
    setAttribute: (
      domInstance: DomInstance<HostElement, HostTextElement>,
      attributeName: string,
      attributeValue: any
    ) => void;
    moveBeforeSibling: (
      self: DomInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | DomInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
    appendChildBeforeSibling: (
      parentInstance: DomInstance<HostElement, HostTextElement> | RootInstance<HostElement, HostTextElement>,
      childInstance:
        | DomInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | DomInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
    elementDidMountHook: (
      domInstance: DomInstance<HostElement, HostTextElement>
    ) => void;
  };

  text: {
    create: (text: string) => HostTextElement;
    remove: (textInstance: TextInstance<HostElement, HostTextElement>) => void;
    update: (
      textInstance: TextInstance<HostElement, HostTextElement>,
      newText: string
    ) => void;

    moveBeforeSibling: (
      self: TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | DomInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null
    ) => void;
  };

  getRootElement: (rootInstance: RootInstance<HostElement, HostTextElement>) => HostElement;
};

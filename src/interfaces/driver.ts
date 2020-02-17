import HostInstance from '../instances/types/Host/Instance';
import TextInstance from '../instances/types/Text/Instance';
import RootInstance from '../instances/types/Root/Instance';
import { renderOptions } from './renderOptions';

type Instance<HostElement, HostTextElement> = {
  parentInstance?: Instance<HostElement, HostTextElement>;
  renderOptions: renderOptions<HostElement, HostTextElement>;
};

export type IDriver<HostElement, HostTextElement> = {
  element: {
    create: (HostInstance: HostInstance<HostElement, HostTextElement>) => HostElement;
    remove: (HostInstance: HostInstance<HostElement, HostTextElement>) => void;
    setAttribute: (
      HostInstance: HostInstance<HostElement, HostTextElement>,
      attributeName: string,
      attributeValue: any,
    ) => void;
    unsetAttribute: (
      HostInstance: HostInstance<HostElement, HostTextElement>,
      attributeName: string,
    ) => void;
    moveAfterSibling: (
      self: HostInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null,
    ) => void;
    appendChildAfterSibling: (
      parentInstance: HostInstance<HostElement, HostTextElement> | RootInstance<HostElement, HostTextElement>,
      childInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null,
    ) => void;
    elementDidMountHook: (
      HostInstance: HostInstance<HostElement, HostTextElement>,
    ) => void;
  };

  text: {
    create: (text: string) => HostTextElement;
    remove: (textInstance: TextInstance<HostElement, HostTextElement>) => void;
    update: (
      textInstance: TextInstance<HostElement, HostTextElement>,
      newText: string,
    ) => void;

    moveAfterSibling: (
      self: TextInstance<HostElement, HostTextElement>,
      previousSiblingInstance:
        | HostInstance<HostElement, HostTextElement>
        | TextInstance<HostElement, HostTextElement>
        | null,
    ) => void;
  };

  getRootElement: (rootInstance: RootInstance<HostElement, HostTextElement>) => HostElement;
  setupPortal: (opt: { portalEntrance: Instance<HostElement, HostTextElement>, portalExit: Instance<HostElement, HostTextElement> }) => void;
};

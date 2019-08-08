import DomInstance from "../instances/types/Dom/Instance";
import TextInstance from "../instances/types/Text/Instance";

export type IDriver<HostElement, HostTextElement> = {
  createElement: (type: string, namespace: string) => HostElement;
  removeElement: (domInstance: DomInstance<HostElement, HostTextElement>) => void;
  setAttribute: (domInstance: DomInstance<HostElement, HostTextElement>, attributeName: string, attributeValue: any) => void;
  addEventListener: (domInstance: DomInstance<HostElement, HostTextElement>, eventName: string, eventListener: () => void) => void;
  insertElementBefore: (parentDomInstance: DomInstance<HostElement, HostTextElement>, previousChildInstance: DomInstance<HostElement, HostTextElement> | TextInstance<HostElement, HostTextElement> | null) => void;
  elementDidMount: (domInstance: DomInstance<HostElement, HostTextElement>) => void;
  // @TODO move
  createTextElement: (text: string) => HostTextElement;
  removeTextElement: (domInstance: TextInstance<HostElement, HostTextElement>) => void;
  updateText: (domInstance: TextInstance<HostElement, HostTextElement>, newText: string) => void;
};

import element from './element';
import text from './text';
import { IDriver } from 'interfaces/driver';

export default (rootElement: Element): IDriver<Element, Text> =>  {
  for (let i = 0; i < rootElement.childNodes.length; i += 1) {
    rootElement.childNodes[i].remove();
  }

  return {
    element,
    text,
    getRootElement: () => rootElement,
  };
};

import element from './element';
import text from './text';
import { IDriver } from 'interfaces/driver';

export default (rootElement: Element): IDriver<Element, Text> => ({
  element,
  text,
  getRootElement: () => rootElement,
});

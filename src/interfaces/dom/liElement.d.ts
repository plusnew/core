import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type liElement = htmlGlobalAttributesElement<HTMLLIElement> & {
  value?: number;
};

export { liElement };

import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type delElement = htmlGlobalAttributesElement<HTMLModElement> & {
  cite?: string;
  datetime?: string;
};

export { delElement };

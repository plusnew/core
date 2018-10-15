import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type insElement =  htmlGlobalAttributesElement<HTMLModElement> & {
  cite?: string;
  datetime?: string;
};

export { insElement };

import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type slotElement =  htmlGlobalAttributesElement<HTMLElement> & {
  name?: string;
};

export { slotElement };

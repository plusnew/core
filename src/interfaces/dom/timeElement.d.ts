import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type timeElement =  htmlGlobalAttributesElement<HTMLTimeElement> & {
  datetime?: string;
};

export { timeElement };

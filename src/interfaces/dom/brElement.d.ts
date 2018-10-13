import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type brElement =  htmlGlobalAttributesElement<HTMLBRElement> & {
  clear?: string;
};

export { brElement };

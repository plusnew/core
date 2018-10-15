import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type paramElement =  htmlGlobalAttributesElement<HTMLParamElement> & {
  name?: string;
  value?: string;
};

export { paramElement };

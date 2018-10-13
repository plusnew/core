import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type dataElement =  htmlGlobalAttributesElement<HTMLDataElement> & {
  value?: string;
};

export { dataElement };

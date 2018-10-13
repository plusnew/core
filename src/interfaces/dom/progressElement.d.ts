import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type progressElement =  htmlGlobalAttributesElement<HTMLProgressElement> & {
  max?: number;
  value?: string;
};

export { progressElement };

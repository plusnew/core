import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type colElement =  htmlGlobalAttributesElement<HTMLTableColElement> & {
  span?: number;
};

export { colElement };

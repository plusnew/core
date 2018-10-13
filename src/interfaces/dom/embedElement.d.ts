import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type embedElement =  htmlGlobalAttributesElement<HTMLEmbedElement> & {
  height?: number;
  src?: string;
  type?: string;
  width?: number;
};

export { embedElement };

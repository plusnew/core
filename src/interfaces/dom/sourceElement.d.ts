import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type sourceElement =  htmlGlobalAttributesElement<HTMLSourceElement> & {
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
  media?: string;
};

export { sourceElement };

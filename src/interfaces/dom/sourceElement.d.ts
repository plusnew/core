import { globalAttributesElement } from './abstract/globalAttributesElement';


type sourceElement =  globalAttributesElement<HTMLSourceElement> & {
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
  media?: string;
};

export { sourceElement };

import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type styleElement =  htmlGlobalAttributesElement<HTMLStyleElement> & {
  type?: string;
  media?: string;
  content?: string;
  nonce?: string;
  title?: string;
};

export { styleElement };

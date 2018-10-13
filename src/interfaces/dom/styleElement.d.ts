import { globalAttributesElement } from './abstract/globalAttributesElement';


type styleElement =  globalAttributesElement<HTMLStyleElement> & {
  type?: string;
  media?: string;
  content?: string;
  nonce?: string;
  title?: string;
};

export { styleElement };

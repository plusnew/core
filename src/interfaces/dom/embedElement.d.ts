import { globalAttributesElement } from './abstract/globalAttributesElement';


type embedElement =  globalAttributesElement<HTMLEmbedElement> & {
  height?: number;
  src?: string;
  type?: string;
  width?: number;
};

export { embedElement };

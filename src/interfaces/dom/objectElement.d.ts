import { globalAttributesElement } from './abstract/globalAttributesElement';


type objectElement =  globalAttributesElement<HTMLObjectElement> & {
  data?: string;
  form?: string;
  height?: number;
  name?: string;
  type?: string;
  typemustmatch?: boolean;
  usemap?: string;
  width?: number;
};

export { objectElement };

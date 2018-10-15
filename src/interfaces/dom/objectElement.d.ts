import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type objectElement = htmlGlobalAttributesElement<HTMLObjectElement> & {
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

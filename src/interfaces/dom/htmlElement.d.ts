import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type htmlElement = htmlGlobalAttributesElement<HTMLHtmlElement> & {
  xmlns?: string;
};

export { htmlElement };

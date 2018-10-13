import { globalAttributesElement } from './abstract/globalAttributesElement';


type htmlElement =  globalAttributesElement<HTMLHtmlElement> & {
  xmlns?: string;
};

export { htmlElement };

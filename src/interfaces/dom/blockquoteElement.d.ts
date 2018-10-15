import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type blockquoteElement =  htmlGlobalAttributesElement<HTMLQuoteElement> & {
  cite?: string;
};

export { blockquoteElement };

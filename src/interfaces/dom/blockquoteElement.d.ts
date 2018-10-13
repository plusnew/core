import { globalAttributesElement } from './abstract/globalAttributesElement';


type blockquoteElement =  globalAttributesElement<HTMLQuoteElement> & {
  cite?: string;
};

export { blockquoteElement };

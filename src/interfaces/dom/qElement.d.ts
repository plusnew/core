import { globalAttributesElement } from './abstract/globalAttributesElement';


type qElement =  globalAttributesElement<HTMLQuoteElement> & {
  cite?: string;
};

export { qElement };

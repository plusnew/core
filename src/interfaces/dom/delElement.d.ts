import { globalAttributesElement } from './abstract/globalAttributesElement';


type delElement =  globalAttributesElement<HTMLModElement> & {
  cite?: string;
  datetime?: string;
};

export { delElement };

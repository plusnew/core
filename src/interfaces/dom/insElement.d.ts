import { globalAttributesElement } from './abstract/globalAttributesElement';


type insElement =  globalAttributesElement<HTMLModElement> & {
  cite?: string;
  datetime?: string;
};

export { insElement };

import { globalAttributesElement } from './abstract/globalAttributesElement';


type timeElement =  globalAttributesElement<HTMLTimeElement> & {
  datetime?: string;
};

export { timeElement };

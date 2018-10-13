import { globalAttributesElement } from './abstract/globalAttributesElement';


type olElement =  globalAttributesElement<HTMLOListElement> & {
  reversed?: boolean;
  start?: number;
  type?: "a" | "A" | "i" | "I" | "1";
};

export { olElement };

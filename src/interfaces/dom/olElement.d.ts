import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type olElement = htmlGlobalAttributesElement<HTMLOListElement> & {
  reversed?: boolean;
  start?: number;
  type?: "a" | "A" | "i" | "I" | "1";
};

export { olElement };

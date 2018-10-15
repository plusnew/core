import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type labelElement = htmlGlobalAttributesElement<HTMLLabelElement> & {
  htmlFor?: string;
  form?: string;
};

export { labelElement };

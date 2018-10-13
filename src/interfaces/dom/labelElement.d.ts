import { globalAttributesElement } from './abstract/globalAttributesElement';


type labelElement =  globalAttributesElement<HTMLLabelElement> & {
  htmlFor?: string;
  form?: string;
};

export { labelElement };

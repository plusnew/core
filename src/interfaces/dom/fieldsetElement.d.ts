import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type fieldsetElement = htmlGlobalAttributesElement<HTMLFieldSetElement> & {
  disabled?: boolean;
  form?: string;
  name?: string;
};

export { fieldsetElement };

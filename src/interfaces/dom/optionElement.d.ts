import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type optionElement = htmlGlobalAttributesElement<HTMLOptionElement> & {
  disabled?: boolean;
  label?: string;
  value?: string;
};

export { optionElement };

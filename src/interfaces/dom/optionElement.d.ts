import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type optionElement =  htmlGlobalAttributesElement<HTMLOptionElement> & {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string;
};

export { optionElement };

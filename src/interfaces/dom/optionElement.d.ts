import { globalAttributesElement } from './abstract/globalAttributesElement';


type optionElement =  globalAttributesElement<HTMLOptionElement> & {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string;
};

export { optionElement };

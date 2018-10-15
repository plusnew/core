import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { autocomplete } from './types/autocomplete';

type selectElement = htmlGlobalAttributesElement<HTMLSelectElement> & {
  autocomplete?: autocomplete;
  autofocus?: boolean;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
};

export { selectElement };

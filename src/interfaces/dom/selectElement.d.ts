import { globalAttributesElement } from './abstract/globalAttributesElement';
import { autocomplete } from './types/autocomplete';

type selectElement =  globalAttributesElement<HTMLSelectElement> & {
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

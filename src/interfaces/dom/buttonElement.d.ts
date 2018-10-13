import { globalAttributesElement } from './abstract/globalAttributesElement';
import { enctype } from './types/enctype';
import { target } from './types/target';

type buttonElement =  globalAttributesElement<HTMLButtonElement> & {
  autofocus?: boolean;
  disabled?: boolean;
  form?: string;
  formaction?: string;
  formenctype?: enctype;
  formnovalidate?: boolean;
  formtarget?: target;
  name?: string;
  value?: string;
};

export { buttonElement };

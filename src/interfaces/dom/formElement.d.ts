import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { enctype } from './types/enctype';
import { method } from './types/method';
import { target } from './types/target';

type formElement = htmlGlobalAttributesElement<HTMLFormElement> & {
  acceptCharset?: string;
  action?: string;
  autocomplete?: "on" | "off";
  enctype?: enctype;
  method?: method;
  name?: string;
  novalidate?: boolean;
  target?: target;
};

export { formElement };

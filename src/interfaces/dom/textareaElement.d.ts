import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type textareaElement =  htmlGlobalAttributesElement<HTMLTextAreaElement> & {
  autocomplete?: "on" | "off";
  autofocus?: boolean;
  cols?: number;
  disabled?: boolean;
  form?: string;
  maxlength?: number;
  minlength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  spellcheck?: "true" | "default" | "false";
  wrap?: "hard" | "soft";
};

export { textareaElement };

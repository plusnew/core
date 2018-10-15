import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type outputElement = htmlGlobalAttributesElement<HTMLOutputElement> & {
  for?: string;
  form?: string;
  name?: string;
};

export { outputElement };

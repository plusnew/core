import { globalAttributesElement } from './abstract/globalAttributesElement';


type outputElement =  globalAttributesElement<HTMLOutputElement> & {
  for?: string;
  form?: string;
  name?: string;
};

export { outputElement };

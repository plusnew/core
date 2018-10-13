import { globalAttributesElement } from './abstract/globalAttributesElement';


type liElement =  globalAttributesElement<HTMLLIElement> & {
  value?: number;
};

export { liElement };

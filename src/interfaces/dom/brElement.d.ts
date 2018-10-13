import { globalAttributesElement } from './abstract/globalAttributesElement';


type brElement =  globalAttributesElement<HTMLBRElement> & {
  clear?: string;
};

export { brElement };

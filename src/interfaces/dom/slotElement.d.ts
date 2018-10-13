import { globalAttributesElement } from './abstract/globalAttributesElement';


type slotElement =  globalAttributesElement<HTMLElement> & {
  name?: string;
};

export { slotElement };

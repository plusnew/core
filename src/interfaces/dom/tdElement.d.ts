import { globalAttributesElement } from './abstract/globalAttributesElement';


type tdElement =  globalAttributesElement<HTMLElement> & {
  colspan?: number;
  headers?: string;
  rowspan?: number;
};

export { tdElement };

import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type tdElement = htmlGlobalAttributesElement<HTMLElement> & {
  colspan?: number;
  headers?: string;
  rowspan?: number;
};

export { tdElement };

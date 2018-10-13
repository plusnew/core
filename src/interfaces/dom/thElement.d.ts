import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type thElement =  htmlGlobalAttributesElement<HTMLElement> & {
  abbr?: string;
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: "row" | "col" | "rowgroup" | "colgroup" | "auto";
};

export { thElement };

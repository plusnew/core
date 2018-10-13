import { globalAttributesElement } from './abstract/globalAttributesElement';


type thElement =  globalAttributesElement<HTMLElement> & {
  abbr?: string;
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: "row" | "col" | "rowgroup" | "colgroup" | "auto";
};

export { thElement };

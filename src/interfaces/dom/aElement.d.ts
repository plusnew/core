import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { referrerpolicy } from './types/referrerpolicy';
import { target } from './types/target';

type aElement = htmlGlobalAttributesElement<HTMLAnchorElement> & {
  download?: string;
  href?: string;
  hreflang?: string;
  ping?: string;
  referrerpolicy?: referrerpolicy;
  rel?: string;
  target?: target;
  type?: string;
};

export { aElement };

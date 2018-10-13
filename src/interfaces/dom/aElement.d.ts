import { globalAttributesElement } from './abstract/globalAttributesElement';
import { referrerpolicy } from './types/referrerpolicy';
import { target } from './types/target';

type aElement =  globalAttributesElement<HTMLAnchorElement> & {
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

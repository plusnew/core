import { globalAttributesElement } from './abstract/globalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { importance } from './types/importance';
import { referrerpolicy } from './types/referrerpolicy';

type linkElement =  globalAttributesElement<HTMLLinkElement> & {
  as?: string;
  crossorigin?: crossorigin;
  href?: string;
  hreflang?: string;
  importance?: importance;
  integrity?: string;
  referrerpolicy?: referrerpolicy;
  rel?: string;
  sizes?: string;
  title?: string;
  type?: string;
};

export { linkElement };

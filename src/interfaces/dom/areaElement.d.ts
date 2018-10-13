import { globalAttributesElement } from './abstract/globalAttributesElement';
import { referrerpolicy } from './types/referrerpolicy';

type areaElement =  globalAttributesElement<HTMLAreaElement> & {
  alt: string;
  coords?: string;
  download?: string;
  href?: string;
  hreflang?: string;
  ping?: string;
  referrerpolicy?: referrerpolicy;
  rel?: string;
  shape?: string;
  target?: string;
};

export { areaElement };

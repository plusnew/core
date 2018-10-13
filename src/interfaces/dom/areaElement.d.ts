import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { referrerpolicy } from './types/referrerpolicy';

type areaElement =  htmlGlobalAttributesElement<HTMLAreaElement> & {
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

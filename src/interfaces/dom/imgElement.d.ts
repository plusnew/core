import { globalAttributesElement } from './abstract/globalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { importance } from './types/importance';
import { referrerpolicy } from './types/referrerpolicy';

type imgElement =  globalAttributesElement<HTMLImageElement> & {
  alt?: string;
  crossorigin?: crossorigin;
  decoding?: "sync" | "async" | "auto";
  height?: number;
  importance?: importance;
  ismap?: boolean;
  referrerpolicy?: referrerpolicy;
  sizes?: string;
  src: string;
  srcset?: string;
  width?: number;
  usemap?: string;
};

export { imgElement };

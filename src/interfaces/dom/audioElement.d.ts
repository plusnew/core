import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { preload } from './types/preload';

type audioElement =  htmlGlobalAttributesElement<HTMLAudioElement> & {
  autoplay?: boolean;
  crossorigin?: crossorigin;
  loop?: boolean;
  muted?: boolean;
  preload?: preload;
  src?: string;
};

export { audioElement };

import { globalAttributesElement } from './abstract/globalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { preload } from './types/preload';

type audioElement =  globalAttributesElement<HTMLAudioElement> & {
  autoplay?: boolean;
  crossorigin?: crossorigin;
  loop?: boolean;
  muted?: boolean;
  preload?: preload;
  src?: string;
};

export { audioElement };

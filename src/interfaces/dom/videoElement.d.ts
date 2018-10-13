import { globalAttributesElement } from './abstract/globalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { preload } from './types/preload';

type videoElement =  globalAttributesElement<HTMLVideoElement> & {
  autoplay?: boolean;
  buffered?: string;
  controls?: boolean;
  crossorigin?: crossorigin;
  height?: number;
  loop?: boolean;
  muted?: boolean;
  preload?: preload;
  poster?: string;
  src?: string;
  width?: number;
  playsinline?: string;
};

export { videoElement };

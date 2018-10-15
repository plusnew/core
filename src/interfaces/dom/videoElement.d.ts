import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { preload } from './types/preload';

type videoElement = htmlGlobalAttributesElement<HTMLVideoElement> & {
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

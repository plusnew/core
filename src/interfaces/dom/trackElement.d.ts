import { globalAttributesElement } from './abstract/globalAttributesElement';


type trackElement =  globalAttributesElement<HTMLTrackElement> & {
  default?: boolean;
  kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
  src: string;
  srclang?: string;
};

export { trackElement };

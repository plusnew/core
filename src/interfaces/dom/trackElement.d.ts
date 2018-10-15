import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type trackElement =  htmlGlobalAttributesElement<HTMLTrackElement> & {
  default?: boolean;
  kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
  src: string;
  srclang?: string;
};

export { trackElement };

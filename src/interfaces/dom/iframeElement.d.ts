import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';
import { importance } from './types/importance';
import { referrerpolicy } from './types/referrerpolicy';

type iframeElement = htmlGlobalAttributesElement<HTMLIFrameElement> & {
  allow?: string;
  height?: number;
  importance?: importance;
  name?: string;
  referrerpolicy?: referrerpolicy;
  sandbox?: "allow-forms" | "allow-modals" | "allow-orientation-lock" | "allow-pointer-lock" | "allow-popups" | "allow-popups-to-escape-sandbox" | "allow-presentation" | "allow-same-origin" | "allow-ScriptProcessorNodeallow-top-navigation" | "allow-top-navigation-by-user-activation";
  src?: string;
  srcdoc?: string;
  width?: number;
};

export { iframeElement };

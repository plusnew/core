import { globalAttributesElement } from './abstract/globalAttributesElement';
import { crossorigin } from './types/crossorigin';
import { importance } from './types/importance';

type scriptElement =  globalAttributesElement<HTMLScriptElement> & {
  async?: boolean;
  crossorigin?: crossorigin;
  defer?: boolean;
  importance?: importance;
  integrity?: string;
  nomodule?: boolean;
  nonce?: string;
  src?: string;
  text?: string;
  type?: string;
};

export { scriptElement };

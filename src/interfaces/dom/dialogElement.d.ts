import { globalAttributesElement } from './abstract/globalAttributesElement';


type dialogElement =  globalAttributesElement<HTMLDialogElement> & {
  open?: boolean;
};

export { dialogElement };

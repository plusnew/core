import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type dialogElement =  htmlGlobalAttributesElement<HTMLDialogElement> & {
  open?: boolean;
};

export { dialogElement };

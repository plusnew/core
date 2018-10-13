import { globalAttributesElement } from './abstract/globalAttributesElement';


type detailsElement =  globalAttributesElement<HTMLDetailsElement> & {
  open?: boolean;
};

export { detailsElement };

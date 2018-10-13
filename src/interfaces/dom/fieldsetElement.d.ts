import { globalAttributesElement } from './abstract/globalAttributesElement';


type fieldsetElement =  globalAttributesElement<HTMLFieldSetElement> & {
  disabled?: boolean;
  form?: string;
  name?: string;
};

export { fieldsetElement };

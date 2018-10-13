import { globalAttributesElement } from './abstract/globalAttributesElement';


type optgroupElement =  globalAttributesElement<HTMLOptGroupElement> & {
  disabled?: boolean;
  label?: string;
};

export { optgroupElement };

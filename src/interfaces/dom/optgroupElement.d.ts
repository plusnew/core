import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type optgroupElement =  htmlGlobalAttributesElement<HTMLOptGroupElement> & {
  disabled?: boolean;
  label?: string;
};

export { optgroupElement };

import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type mapElement =  htmlGlobalAttributesElement<HTMLMapElement> & {
  name?: string;
};

export { mapElement };

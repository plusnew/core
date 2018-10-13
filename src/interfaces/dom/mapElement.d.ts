import { globalAttributesElement } from './abstract/globalAttributesElement';


type mapElement =  globalAttributesElement<HTMLMapElement> & {
  name?: string;
};

export { mapElement };

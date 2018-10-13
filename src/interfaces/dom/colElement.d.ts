import { globalAttributesElement } from './abstract/globalAttributesElement';


type colElement =  globalAttributesElement<HTMLTableColElement> & {
  span?: number;
};

export { colElement };

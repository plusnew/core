import { globalAttributesElement } from './abstract/globalAttributesElement';


type colgroupElement =  globalAttributesElement<HTMLTableColElement> & {
  span?: number;
};

export { colgroupElement };

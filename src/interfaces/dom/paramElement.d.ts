import { globalAttributesElement } from './abstract/globalAttributesElement';


type paramElement =  globalAttributesElement<HTMLParamElement> & {
  name?: string;
  value?: string;
};

export { paramElement };

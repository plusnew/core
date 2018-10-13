import { globalAttributesElement } from './abstract/globalAttributesElement';


type dataElement =  globalAttributesElement<HTMLDataElement> & {
  value?: string;
};

export { dataElement };

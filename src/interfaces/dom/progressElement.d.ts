import { globalAttributesElement } from './abstract/globalAttributesElement';


type progressElement =  globalAttributesElement<HTMLProgressElement> & {
  max?: number;
  value?: string;
};

export { progressElement };

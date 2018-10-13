import { globalAttributesElement } from './abstract/globalAttributesElement';


type meterElement =  globalAttributesElement<HTMLMeterElement> & {
  value?: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  form?: string;
};

export { meterElement };

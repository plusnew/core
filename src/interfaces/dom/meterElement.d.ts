import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type meterElement = htmlGlobalAttributesElement<HTMLMeterElement> & {
  value?: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  form?: string;
};

export { meterElement };

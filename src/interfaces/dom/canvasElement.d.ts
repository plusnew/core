import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type canvasElement =  htmlGlobalAttributesElement<HTMLCanvasElement> & {
  height?: number;
  width?: number;
};

export { canvasElement };

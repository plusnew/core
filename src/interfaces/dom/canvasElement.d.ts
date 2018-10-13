import { globalAttributesElement } from './abstract/globalAttributesElement';


type canvasElement =  globalAttributesElement<HTMLCanvasElement> & {
  height?: number;
  width?: number;
};

export { canvasElement };

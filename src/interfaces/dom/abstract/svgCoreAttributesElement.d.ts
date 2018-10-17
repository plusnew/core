import { svgStyleAttributesElement } from './../abstract/svgStyleAttributesElement';


type svgCoreAttributesElement<currentElement> = svgStyleAttributesElement<SVGElement> & {
  [key: string]: any;
};

export { svgCoreAttributesElement };
